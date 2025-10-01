-- name: CreateResult :one
INSERT INTO results (id, group_id, score)
VALUES ($1, $2, $3)
RETURNING id, group_id, score, created_at;

-- name: GetGroupWithResults :many
SELECT 
    g.id as group_id,
    g.name as group_name,
    g.group_size,
    g.created_at as group_created_at,
    g.updated_at as group_updated_at,
    r.id as result_id,
    r.score,
    r.created_at as result_created_at
FROM groups g
LEFT JOIN results r ON g.id = r.group_id
WHERE g.id = $1
ORDER BY r.created_at DESC;