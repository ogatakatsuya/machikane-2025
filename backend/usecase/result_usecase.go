package usecase

import (
	"backend/dto"
	"context"
	"encoding/json"
	"fmt"

	db "backend/db/generated"

	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

type resultUseCase struct {
	queries *db.Queries
}

func NewResultUseCase(queries *db.Queries) ResultUseCase {
	return &resultUseCase{
		queries: queries,
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

	_, err := u.queries.CreateResult(ctx, params)
	if err != nil {
		return fmt.Errorf("failed to create result: %w", err)
	}

	return nil
}

func (u *resultUseCase) GetResults(ctx context.Context, groupID uuid.UUID) (*dto.ResultResponseDto, error) {
	// Get the latest result for the group
	result, err := u.queries.GetLatestResultByGroup(ctx, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest result: %w", err)
	}

	// Get the rank of the result
	var rank int64 = 1
	rankResult, err := u.queries.GetResultRank(ctx, result.ID)
	if err == nil {
		rank = rankResult
	}

	// Get top 5 results
	topResults, err := u.queries.GetTopResults(ctx, db.GetTopResultsParams{
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

	response := &dto.ResultResponseDto{
		ID:        result.ID,
		GroupID:   result.GroupID,
		GroupName: result.GroupName,
		Score:     result.Score,
		Rank:      rank,
		TopFive:   topFive,
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
	// Get top results with ranking
	topResults, err := u.queries.GetTopResults(ctx, db.GetTopResultsParams{
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
