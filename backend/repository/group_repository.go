package repository

import (
	"context"
	"fmt"

	db "backend/db/generated"
)

type groupRepository struct {
	queries *db.Queries
}

func NewGroupRepository(queries *db.Queries) GroupRepository {
	return &groupRepository{
		queries: queries,
	}
}

// CreateGroup corresponds to CreateGroup SQL query
func (r *groupRepository) CreateGroup(ctx context.Context, params db.CreateGroupParams) (*db.Group, error) {
	group, err := r.queries.CreateGroup(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create group: %w", err)
	}
	return &group, nil
}
