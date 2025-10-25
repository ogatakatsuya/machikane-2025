package repository

import (
	"context"

	db "backend/db/generated"

	"github.com/google/uuid"
)

type ResultRepository interface {
	CreateResult(ctx context.Context, params db.CreateResultParams) (*db.CreateResultRow, error)
	GetLatestResultByGroup(ctx context.Context, groupID uuid.UUID) (*db.GetLatestResultByGroupRow, error)
	GetResultRank(ctx context.Context, resultID uuid.UUID) (int64, error)
	GetTopResults(ctx context.Context, params db.GetTopResultsParams) ([]db.GetTopResultsRow, error)
	GetGroupWithResults(ctx context.Context, groupID uuid.UUID) ([]db.GetGroupWithResultsRow, error)
}

type GroupRepository interface {
	CreateGroup(ctx context.Context, params db.CreateGroupParams) (*db.Group, error)
}