package usecase

import (
	"backend/dto"
	"context"

	"github.com/google/uuid"
)

type ResultUseCase interface {
	CreateResult(ctx context.Context, groupID uuid.UUID, dto dto.CreateResultDto) error
	GetResults(ctx context.Context, groupID uuid.UUID) (*dto.ResultResponseDto, error)
}