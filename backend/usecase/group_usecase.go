package usecase

import (
	"backend/dto"
	"backend/repository"
	"context"
)

type groupUseCase struct {
	groupRepo repository.GroupRepository
}

func NewGroupUseCase(groupRepo repository.GroupRepository) GroupUseCase {
	return &groupUseCase{
		groupRepo: groupRepo,
	}
}

func (u *groupUseCase) CreateGroup(ctx context.Context, req dto.CreateGroupDto) (*dto.GroupResponseDto, error) {
	return u.groupRepo.CreateGroup(ctx, req)
}