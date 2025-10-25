package repository

import (
	"backend/dto"
	"context"

	"github.com/google/uuid"
)

type ResultRepository interface {
	GetRanking(ctx context.Context, offset, limit int32) (*dto.RankingResponseDto, error)
	CreateResult(ctx context.Context, groupID uuid.UUID, req dto.CreateResultDto) error
	GetResults(ctx context.Context, groupID uuid.UUID) (*dto.ResultResponseDto, error)
}

type GroupRepository interface {
	CreateGroup(ctx context.Context, req dto.CreateGroupDto) (*dto.GroupResponseDto, error)
}