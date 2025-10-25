package repository

import (
	"backend/cache"
	"context"
	"encoding/json"
	"fmt"
	"time"

	db "backend/db/generated"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type resultRepository struct {
	queries     *db.Queries
	redisClient *cache.RedisClient
}

func NewResultRepository(queries *db.Queries, redisClient *cache.RedisClient) ResultRepository {
	return &resultRepository{
		queries:     queries,
		redisClient: redisClient,
	}
}

// CreateResult corresponds to CreateResult SQL query
func (r *resultRepository) CreateResult(ctx context.Context, params db.CreateResultParams) (*db.CreateResultRow, error) {
	result, err := r.queries.CreateResult(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create result: %w", err)
	}

	return &result, nil
}

// GetLatestResultByGroup corresponds to GetLatestResultByGroup SQL query with caching
func (r *resultRepository) GetLatestResultByGroup(ctx context.Context, groupID uuid.UUID) (*db.GetLatestResultByGroupRow, error) {
	// Generate cache key
	cacheKey := r.redisClient.GenerateLatestResultKey(groupID.String())

	// Try to get from cache first
	if cachedData, err := r.redisClient.Get(ctx, cacheKey); err == nil {
		var cachedResult db.GetLatestResultByGroupRow
		if err := json.Unmarshal([]byte(cachedData), &cachedResult); err == nil {
			return &cachedResult, nil
		}
	} else if err != redis.Nil {
		// Log cache error but continue with database query
		fmt.Printf("Redis cache error: %v\n", err)
	}

	// Get result from database
	result, err := r.queries.GetLatestResultByGroup(ctx, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest result by group: %w", err)
	}

	// Cache the result for 5 minutes
	if resultJSON, err := json.Marshal(result); err == nil {
		if err := r.redisClient.Set(ctx, cacheKey, resultJSON, 5*time.Minute); err != nil {
			// Log cache error but don't fail the request
			fmt.Printf("Failed to cache latest result: %v\n", err)
		}
	}

	return &result, nil
}

// GetResultRank corresponds to GetResultRank SQL query with caching
func (r *resultRepository) GetResultRank(ctx context.Context, resultID uuid.UUID) (int64, error) {
	// Generate cache key
	cacheKey := r.redisClient.GenerateResultRankKey(resultID.String())

	// Try to get from cache first
	if cachedData, err := r.redisClient.Get(ctx, cacheKey); err == nil {
		var cachedRank int64
		if err := json.Unmarshal([]byte(cachedData), &cachedRank); err == nil {
			return cachedRank, nil
		}
	} else if err != redis.Nil {
		// Log cache error but continue with database query
		fmt.Printf("Redis cache error: %v\n", err)
	}

	// Get rank from database
	rank, err := r.queries.GetResultRank(ctx, resultID)
	if err != nil {
		return 0, fmt.Errorf("failed to get result rank: %w", err)
	}

	// Cache the rank for 3 minutes
	if rankJSON, err := json.Marshal(rank); err == nil {
		if err := r.redisClient.Set(ctx, cacheKey, rankJSON, 3*time.Minute); err != nil {
			// Log cache error but don't fail the request
			fmt.Printf("Failed to cache result rank: %v\n", err)
		}
	}

	return rank, nil
}

// GetTopResults corresponds to GetTopResults SQL query with caching
func (r *resultRepository) GetTopResults(ctx context.Context, params db.GetTopResultsParams) ([]db.GetTopResultsRow, error) {
	// Generate cache key
	cacheKey := r.redisClient.GenerateRankingKey(params.Limit, params.Offset)

	// Try to get from cache first
	if cachedData, err := r.redisClient.Get(ctx, cacheKey); err == nil {
		var cachedResults []db.GetTopResultsRow
		if err := json.Unmarshal([]byte(cachedData), &cachedResults); err == nil {
			return cachedResults, nil
		}
	} else if err != redis.Nil {
		// Log cache error but continue with database query
		fmt.Printf("Redis cache error: %v\n", err)
	}

	// Get results from database
	results, err := r.queries.GetTopResults(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to get top results: %w", err)
	}

	// Cache the results for 60 seconds
	if resultsJSON, err := json.Marshal(results); err == nil {
		if err := r.redisClient.Set(ctx, cacheKey, resultsJSON, 10*time.Minute); err != nil {
			// Log cache error but don't fail the request
			fmt.Printf("Failed to cache top results: %v\n", err)
		}
	}

	return results, nil
}

// GetGroupWithResults corresponds to GetGroupWithResults SQL query
func (r *resultRepository) GetGroupWithResults(ctx context.Context, groupID uuid.UUID) ([]db.GetGroupWithResultsRow, error) {
	results, err := r.queries.GetGroupWithResults(ctx, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get group with results: %w", err)
	}
	return results, nil
}

// invalidateRankingCache removes common ranking cache entries
func (r *resultRepository) invalidateRankingCache(ctx context.Context) {
	// Delete cache entries for common limit/offset combinations
	commonCombinations := []struct{ limit, offset int32 }{
		{30, 0}, {30, 30}, {30, 60}, {30, 90},
		{50, 0}, {50, 50}, {50, 100},
		{100, 0}, {100, 100}, {100, 200},
	}

	keys := make([]string, 0, len(commonCombinations))
	for _, combo := range commonCombinations {
		keys = append(keys, r.redisClient.GenerateRankingKey(combo.limit, combo.offset))
	}

	if err := r.redisClient.Del(ctx, keys...); err != nil {
		fmt.Printf("Failed to invalidate ranking cache: %v\n", err)
	}
}

// invalidateLatestResultCache removes latest result cache for a specific group
func (r *resultRepository) invalidateLatestResultCache(ctx context.Context, groupID uuid.UUID) {
	cacheKey := r.redisClient.GenerateLatestResultKey(groupID.String())
	if err := r.redisClient.Del(ctx, cacheKey); err != nil {
		fmt.Printf("Failed to invalidate latest result cache: %v\n", err)
	}
}

// invalidateAllResultRankCache removes all result rank caches
// Note: This is a simplified approach. In production, you might want to use pattern-based deletion or track result IDs
func (r *resultRepository) invalidateAllResultRankCache(_ context.Context) {
	// For now, we'll log that rank caches should be invalidated
	// In a production system, you might want to implement pattern-based deletion
	// or maintain a set of cached result IDs to invalidate specifically
	fmt.Printf("New result created - all result rank caches should be invalidated\n")
}
