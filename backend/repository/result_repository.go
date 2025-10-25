package repository

import (
	"backend/cache"
	"backend/dto"
	"context"
	"encoding/json"
	"fmt"
	"time"

	db "backend/db/generated"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/sqlc-dev/pqtype"
)

type resultRepository struct {
	queries     *db.Queries
	redisClient *cache.RedisClient
}

func NewResultRepository(queries *db.Queries, redisClient *cache.RedisClient) ResultRepository {
	return &resultRepository{
		queries:     queries,
		redisClient: redisClient,
	}
}

func (r *resultRepository) GetRanking(ctx context.Context, offset, limit int32) (*dto.RankingResponseDto, error) {
	// Generate cache key
	cacheKey := r.redisClient.GenerateRankingKey(limit, offset)
	
	// Try to get from cache first
	if cachedData, err := r.redisClient.Get(ctx, cacheKey); err == nil {
		var response dto.RankingResponseDto
		if err := json.Unmarshal([]byte(cachedData), &response); err == nil {
			return &response, nil
		}
	} else if err != redis.Nil {
		// Log cache error but continue with database query
		fmt.Printf("Redis cache error: %v\n", err)
	}

	// Get top results with ranking from database
	topResults, err := r.queries.GetTopResults(ctx, db.GetTopResultsParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get top results: %w", err)
	}

	rankings := make([]dto.RankingItemDto, 0, len(topResults))
	for _, tr := range topResults {
		item := dto.RankingItemDto{
			ID:        tr.ID,
			GroupID:   tr.GroupID,
			GroupName: tr.GroupName,
			Score:     tr.Score,
			Rank:      tr.Rank,
		}
		if tr.CreatedAt.Valid {
			item.CreatedAt = tr.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
		}
		rankings = append(rankings, item)
	}

	response := &dto.RankingResponseDto{
		Rankings: rankings,
	}

	// Cache the response for 5 minutes
	if responseJSON, err := json.Marshal(response); err == nil {
		if err := r.redisClient.Set(ctx, cacheKey, responseJSON, 5*time.Minute); err != nil {
			// Log cache error but don't fail the request
			fmt.Printf("Failed to cache ranking data: %v\n", err)
		}
	}

	return response, nil
}

func (r *resultRepository) CreateResult(ctx context.Context, groupID uuid.UUID, req dto.CreateResultDto) error {
	resultID := uuid.Must(uuid.NewV7())

	// Convert context to JSON
	var contextJSON pqtype.NullRawMessage
	if req.Context.GroupID != "" {
		contextBytes, err := json.Marshal(req.Context)
		if err != nil {
			return fmt.Errorf("failed to marshal context: %w", err)
		}
		contextJSON = pqtype.NullRawMessage{
			RawMessage: contextBytes,
			Valid:      true,
		}
	}

	params := db.CreateResultParams{
		ID:      resultID,
		GroupID: groupID,
		Score:   req.Score,
		Context: contextJSON,
	}

	_, err := r.queries.CreateResult(ctx, params)
	if err != nil {
		return fmt.Errorf("failed to create result: %w", err)
	}

	// Invalidate ranking cache when new result is created
	r.invalidateRankingCache(ctx)

	return nil
}

// calculateDeviationFromRank calculates deviation score and percentile using existing rank and top results
func (r *resultRepository) calculateDeviationFromRank(score int32, rank int64, topResults []db.GetTopResultsRow) (float64, float64) {
	// Calculate percentile based on score (simple score/45 * 100)
	percentile := (float64(score) / 45.0) * 100
	if percentile > 100 {
		percentile = 100
	}
	if percentile < 0 {
		percentile = 0
	}
	
	// Estimate mean and standard deviation from score distribution
	// Assume quiz scores follow normal distribution with mean around 60% of max score
	maxScore := float64(45) // From frontend: /45 units
	estimatedMean := maxScore * 0.6 // Assume average is 60% of max
	estimatedStdDev := maxScore * 0.2 // Assume std dev is 20% of max score
	
	// If we have top results, use them to refine estimates
	if len(topResults) >= 3 {
		highScores := make([]float64, 0, len(topResults))
		for _, tr := range topResults {
			highScores = append(highScores, float64(tr.Score))
		}
		
		// Adjust mean estimate based on top scores
		topAvg := 0.0
		for _, s := range highScores {
			topAvg += s
		}
		topAvg /= float64(len(highScores))
		
		// If top average is much higher than our estimate, adjust
		if topAvg > estimatedMean*1.2 {
			estimatedMean = (estimatedMean + topAvg*0.8) / 1.8
		}
	}
	
	// Calculate deviation score (mean=50, stddev=10)
	deviation := 50 + 10*(float64(score)-estimatedMean)/estimatedStdDev
	
	// Clamp deviation to reasonable range
	if deviation < 20 {
		deviation = 20
	}
	if deviation > 80 {
		deviation = 80
	}
	
	return deviation, percentile
}

func (r *resultRepository) GetResults(ctx context.Context, groupID uuid.UUID) (*dto.ResultResponseDto, error) {
	// Get the latest result for the group
	result, err := r.queries.GetLatestResultByGroup(ctx, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest result: %w", err)
	}

	// Get the rank of the result
	var rank int64 = 1
	rankResult, err := r.queries.GetResultRank(ctx, result.ID)
	if err == nil {
		rank = rankResult
	}

	// Get top 5 results
	topResults, err := r.queries.GetTopResults(ctx, db.GetTopResultsParams{
		Limit:  5,
		Offset: 0,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get top results: %w", err)
	}

	topFive := make([]dto.RankingItemDto, 0, len(topResults))
	for _, tr := range topResults {
		item := dto.RankingItemDto{
			ID:        tr.ID,
			GroupID:   tr.GroupID,
			GroupName: tr.GroupName,
			Score:     tr.Score,
			Rank:      tr.Rank,
		}
		if tr.CreatedAt.Valid {
			item.CreatedAt = tr.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
		}
		topFive = append(topFive, item)
	}

	// Calculate deviation and percentile using existing data
	deviation, percentile := r.calculateDeviationFromRank(result.Score, rank, topResults)

	response := &dto.ResultResponseDto{
		ID:         result.ID,
		GroupID:    result.GroupID,
		GroupName:  result.GroupName,
		Score:      result.Score,
		Rank:       rank,
		Deviation:  deviation,
		Percentile: percentile,
		TopFive:    topFive,
	}

	// Add context to response if available
	if result.Context.Valid && len(result.Context.RawMessage) > 0 {
		var contextData dto.SerializedQuizContext
		if err := json.Unmarshal(result.Context.RawMessage, &contextData); err == nil {
			response.Context = &contextData
		}
	}

	if result.CreatedAt.Valid {
		response.CreatedAt = result.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
	}

	if result.UpdatedAt.Valid {
		response.UpdatedAt = result.UpdatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
	}

	return response, nil
}

// invalidateRankingCache removes all ranking cache entries
func (r *resultRepository) invalidateRankingCache(ctx context.Context) {
	// Delete cache entries for common limit/offset combinations
	commonCombinations := []struct{ limit, offset int32 }{
		{30, 0}, {30, 30}, {30, 60}, {30, 90},
		{50, 0}, {50, 50}, {50, 100},
		{100, 0}, {100, 100}, {100, 200},
	}
	
	keys := make([]string, 0, len(commonCombinations))
	for _, combo := range commonCombinations {
		keys = append(keys, r.redisClient.GenerateRankingKey(combo.limit, combo.offset))
	}
	
	if err := r.redisClient.Del(ctx, keys...); err != nil {
		fmt.Printf("Failed to invalidate ranking cache: %v\n", err)
	}
}