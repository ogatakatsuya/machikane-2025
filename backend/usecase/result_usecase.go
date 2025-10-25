package usecase

import (
	"backend/dto"
	"backend/repository"
	"context"

	"github.com/google/uuid"
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
	return u.resultRepo.CreateResult(ctx, groupID, req)
}

func (u *resultUseCase) GetResults(ctx context.Context, groupID uuid.UUID) (*dto.ResultResponseDto, error) {
	return u.resultRepo.GetResults(ctx, groupID)
}

func (u *resultUseCase) GetRanking(ctx context.Context, offset, limit int32) (*dto.RankingResponseDto, error) {
	return u.resultRepo.GetRanking(ctx, offset, limit)
}