package usecase

import (
	"backend/dto"
	"context"
	"fmt"

	db "backend/db/generated"
	"github.com/google/uuid"
)

type resultUseCase struct {
	queries *db.Queries
}

func NewResultUseCase(queries *db.Queries) ResultUseCase {
	return &resultUseCase{
		queries: queries,
	}
}

func (u *resultUseCase) CreateResult(ctx context.Context, groupID uuid.UUID, req dto.CreateResultDto) (*dto.ResultResponseDto, error) {
	resultID := uuid.Must(uuid.NewV7())

	params := db.CreateResultParams{
		ID:      resultID,
		GroupID: groupID,
		Score:   req.Score,
	}

	result, err := u.queries.CreateResult(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create result: %w", err)
	}

	// Get the rank of the newly created result
	var rank int64 = 1
	if result.CreatedAt.Valid {
		rankParams := db.GetResultRankParams{
			Score:     result.Score,
			CreatedAt: result.CreatedAt,
		}
		rankResult, err := u.queries.GetResultRank(ctx, rankParams)
		if err == nil {
			rank = int64(rankResult)
		}
	}

	// Get top 5 results
	topResults, err := u.queries.GetTopResults(ctx, 5)
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

	response := &dto.ResultResponseDto{
		ID:      result.ID,
		GroupID: result.GroupID,
		Score:   result.Score,
		Rank:    rank,
		TopFive: topFive,
	}

	if result.CreatedAt.Valid {
		response.CreatedAt = result.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
	}

	if result.UpdatedAt.Valid {
		response.UpdatedAt = result.UpdatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
	}

	return response, nil
}