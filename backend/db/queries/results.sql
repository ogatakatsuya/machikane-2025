-- name: CreateResult :one
WITH inserted_result AS (
    INSERT INTO results (id, group_id, score, context)
    VALUES ($1, $2, $3, $4)
    RETURNING id, group_id, score, context, created_at, updated_at
)
SELECT 
    ir.id,
    ir.group_id,
    ir.score,
    ir.context,
    ir.created_at,
    ir.updated_at,
    g.name as group_name
FROM inserted_result ir
JOIN groups g ON ir.group_id = g.id;

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

-- name: GetResultRank :one
SELECT rank FROM (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY score DESC, created_at ASC) as rank
    FROM results
) ranked_results
WHERE id = $1;

-- name: GetTopResults :many
SELECT 
    r.id,
    r.group_id,
    r.score,
    r.created_at,
    g.name as group_name,
    g.group_size,
    ROW_NUMBER() OVER (ORDER BY r.score DESC, r.created_at ASC) as rank
FROM results r
JOIN groups g ON r.group_id = g.id
ORDER BY r.score DESC, r.created_at ASC
LIMIT $1;