package usecase

import (
	"backend/dto"
	"backend/repository"
	"context"
	"encoding/json"
	"fmt"

	db "backend/db/generated"

	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

type resultUseCase struct {
	resultRepo repository.ResultRepository
}

func NewResultUseCase(resultRepo repository.ResultRepository) ResultUseCase {
	return &resultUseCase{
		resultRepo: resultRepo,
	}
}

func (u *resultUseCase) CreateResult(ctx context.Context, groupID uuid.UUID, req dto.CreateResultDto) error {
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

	_, err := u.resultRepo.CreateResult(ctx, params)
	if err != nil {
		return fmt.Errorf("failed to create result: %w", err)
	}

	return nil
}

func (u *resultUseCase) GetResults(ctx context.Context, groupID uuid.UUID) (*dto.ResultResponseDto, error) {
	// Get the latest result for the group
	result, err := u.resultRepo.GetLatestResultByGroup(ctx, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest result: %w", err)
	}

	// Get the rank of the result
	var rank int64 = 1
	rankResult, err := u.resultRepo.GetResultRank(ctx, result.ID)
	if err == nil {
		rank = rankResult
	}

	// Get top 5 results
	topResults, err := u.resultRepo.GetTopResults(ctx, db.GetTopResultsParams{
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
	deviation, percentile := u.calculateDeviationFromRank(result.Score, rank, topResults)

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

func (u *resultUseCase) GetRanking(ctx context.Context, offset, limit int32) (*dto.RankingResponseDto, error) {
	// Get top results with ranking from repository
	topResults, err := u.resultRepo.GetTopResults(ctx, db.GetTopResultsParams{
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

	return response, nil
}

// calculateDeviationFromRank calculates deviation score and percentile using existing rank and top results
func (u *resultUseCase) calculateDeviationFromRank(score int32, rank int64, topResults []db.GetTopResultsRow) (float64, float64) {
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
	maxScore := float64(45)           // From frontend: /45 units
	estimatedMean := maxScore * 0.6   // Assume average is 60% of max
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
