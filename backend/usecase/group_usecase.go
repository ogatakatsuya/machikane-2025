package usecase

import (
	"backend/dto"
	"backend/repository"
	"context"

	db "backend/db/generated"

	"github.com/google/uuid"
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
	groupID := uuid.Must(uuid.NewV7())

	params := db.CreateGroupParams{
		ID:        groupID,
		Name:      req.Name,
		GroupSize: req.GroupSize,
	}

	group, err := u.groupRepo.CreateGroup(ctx, params)
	if err != nil {
		return nil, err
	}

	response := &dto.GroupResponseDto{
		ID:        group.ID,
		Name:      group.Name,
		GroupSize: group.GroupSize,
	}

	if group.CreatedAt.Valid {
		response.CreatedAt = group.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
	}

	if group.UpdatedAt.Valid {
		response.UpdatedAt = group.UpdatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
	}

	return response, nil
}
