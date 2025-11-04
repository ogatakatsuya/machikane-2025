-- name: CreateGroup :one
INSERT INTO groups (id, name, group_size)
VALUES ($1, $2, $3)
RETURNING id, name, group_size, created_at, updated_at;

-- name: ListGroups :many
SELECT id, name, group_size, created_at, updated_at
FROM groups
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;