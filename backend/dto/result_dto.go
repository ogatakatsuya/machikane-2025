package dto

import "github.com/google/uuid"

type CreateResultDto struct {
	Score   int32                 `json:"score" validate:"required,min=0"`
	Context SerializedQuizContext `json:"context"`
}

type RankingItemDto struct {
	ID        uuid.UUID `json:"id"`
	GroupID   uuid.UUID `json:"group_id"`
	GroupName string    `json:"group_name"`
	Score     int32     `json:"score"`
	Rank      int64     `json:"rank"`
	CreatedAt string    `json:"created_at"`
}

type ResultResponseDto struct {
	ID        uuid.UUID             `json:"id"`
	GroupID   uuid.UUID             `json:"group_id"`
	Score     int32                 `json:"score"`
	Context   *SerializedQuizContext `json:"context,omitempty"`
	Rank      int64                 `json:"rank"`
	CreatedAt string                `json:"created_at"`
	UpdatedAt string                `json:"updated_at"`
	TopFive   []RankingItemDto      `json:"top_five"`
}