package repository

import (
	"backend/cache"
	"context"
	"encoding/json"
	"fmt"
	"time"

	db "backend/db/generated"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
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

// CreateResult corresponds to CreateResult SQL query
func (r *resultRepository) CreateResult(ctx context.Context, params db.CreateResultParams) (*db.CreateResultRow, error) {
	result, err := r.queries.CreateResult(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create result: %w", err)
	}

	// Invalidate ranking cache when new result is created
	r.invalidateRankingCache(ctx)

	return &result, nil
}

// GetLatestResultByGroup corresponds to GetLatestResultByGroup SQL query
func (r *resultRepository) GetLatestResultByGroup(ctx context.Context, groupID uuid.UUID) (*db.GetLatestResultByGroupRow, error) {
	result, err := r.queries.GetLatestResultByGroup(ctx, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest result by group: %w", err)
	}
	return &result, nil
}

// GetResultRank corresponds to GetResultRank SQL query
func (r *resultRepository) GetResultRank(ctx context.Context, resultID uuid.UUID) (int64, error) {
	rank, err := r.queries.GetResultRank(ctx, resultID)
	if err != nil {
		return 0, fmt.Errorf("failed to get result rank: %w", err)
	}
	return rank, nil
}

// GetTopResults corresponds to GetTopResults SQL query with caching
func (r *resultRepository) GetTopResults(ctx context.Context, params db.GetTopResultsParams) ([]db.GetTopResultsRow, error) {
	// Generate cache key
	cacheKey := r.redisClient.GenerateRankingKey(params.Limit, params.Offset)
	
	// Try to get from cache first
	if cachedData, err := r.redisClient.Get(ctx, cacheKey); err == nil {
		var cachedResults []db.GetTopResultsRow
		if err := json.Unmarshal([]byte(cachedData), &cachedResults); err == nil {
			return cachedResults, nil
		}
	} else if err != redis.Nil {
		// Log cache error but continue with database query
		fmt.Printf("Redis cache error: %v\n", err)
	}

	// Get results from database
	results, err := r.queries.GetTopResults(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to get top results: %w", err)
	}

	// Cache the results for 60 seconds
	if resultsJSON, err := json.Marshal(results); err == nil {
		if err := r.redisClient.Set(ctx, cacheKey, resultsJSON, 60*time.Second); err != nil {
			// Log cache error but don't fail the request
			fmt.Printf("Failed to cache top results: %v\n", err)
		}
	}

	return results, nil
}

// GetGroupWithResults corresponds to GetGroupWithResults SQL query
func (r *resultRepository) GetGroupWithResults(ctx context.Context, groupID uuid.UUID) ([]db.GetGroupWithResultsRow, error) {
	results, err := r.queries.GetGroupWithResults(ctx, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get group with results: %w", err)
	}
	return results, nil
}

// invalidateRankingCache removes common ranking cache entries
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