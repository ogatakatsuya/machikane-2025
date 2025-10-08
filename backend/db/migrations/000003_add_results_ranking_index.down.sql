-- Drop indexes
DROP INDEX IF EXISTS idx_results_ranking;
DROP INDEX IF EXISTS idx_results_group_score;
DROP INDEX IF EXISTS idx_results_group_id;

-- Drop results table
DROP TABLE IF EXISTS results;