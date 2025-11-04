package usecase

import (
	"backend/dto"
	"context"
)

type GroupUseCase interface {
	CreateGroup(ctx context.Context, dto dto.CreateGroupDto) (*dto.GroupResponseDto, error)
}
