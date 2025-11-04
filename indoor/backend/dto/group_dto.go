package dto

import "github.com/google/uuid"

type CreateGroupDto struct {
	Name      string `json:"name" validate:"required"`
	GroupSize int32  `json:"group_size" validate:"required,min=1"`
}

type GroupResponseDto struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	GroupSize int32     `json:"group_size"`
	CreatedAt string    `json:"created_at"`
	UpdatedAt string    `json:"updated_at"`
}
