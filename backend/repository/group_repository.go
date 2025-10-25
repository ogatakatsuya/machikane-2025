package repository

import (
	"backend/dto"
	"context"
	"fmt"

	db "backend/db/generated"
	"github.com/google/uuid"
)


type groupRepository struct {
	queries *db.Queries
}

func NewGroupRepository(queries *db.Queries) GroupRepository {
	return &groupRepository{
		queries: queries,
	}
}

func (r *groupRepository) CreateGroup(ctx context.Context, req dto.CreateGroupDto) (*dto.GroupResponseDto, error) {
	groupID := uuid.Must(uuid.NewV7())

	params := db.CreateGroupParams{
		ID:        groupID,
		Name:      req.Name,
		GroupSize: req.GroupSize,
	}

	group, err := r.queries.CreateGroup(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create group: %w", err)
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