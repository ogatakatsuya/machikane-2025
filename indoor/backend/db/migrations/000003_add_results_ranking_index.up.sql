-- Create results table with all required fields
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add composite index for ranking queries (score DESC, created_at ASC for tie-breaking)
CREATE INDEX IF NOT EXISTS idx_results_ranking ON results(score DESC, created_at ASC);

-- Add index for group_id with score DESC for group-specific ranking
CREATE INDEX IF NOT EXISTS idx_results_group_score ON results(group_id, score DESC);

-- Add basic index for group_id lookups
CREATE INDEX IF NOT EXISTS idx_results_group_id ON results(group_id);