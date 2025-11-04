package usecase

import (
	"backend/dto"
	"context"

	"github.com/google/uuid"
)

type ResultUseCase interface {
	CreateResult(ctx context.Context, groupID uuid.UUID, req dto.CreateResultDto) error
	GetResults(ctx context.Context, groupID uuid.UUID) (*dto.ResultResponseDto, error)
	GetRanking(ctx context.Context, offset, limit int32) (*dto.RankingResponseDto, error)
}
