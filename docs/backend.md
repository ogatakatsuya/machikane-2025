# Backend Documentation

## Overview

Go language and Echo framework based backend API server

## Tech Stack

- **Language**: Go 1.24.3
- **Framework**: [Echo v4](https://echo.labstack.com/)
- **Database**: PostgreSQL with [sqlc](https://sqlc.dev/) for type-safe queries
- **Cache**: Redis via [Upstash](https://upstash.com/)
- **Port**: 8080

## Project Structure

```
backend/
├── cmd/
│   └── main.go          # Entry point
├── controller/          # HTTP handlers and interfaces
│   ├── group_controller.go
│   ├── group_interface.go
│   ├── result_controller.go
│   └── result_interface.go
├── usecase/            # Business logic and interfaces
│   ├── group_usecase.go
│   ├── group_interface.go
│   ├── result_usecase.go
│   └── result_interface.go
├── repository/         # Data access layer with caching
│   ├── repository_interface.go
│   ├── group_repository.go
│   └── result_repository.go
├── dto/                # Data Transfer Objects
│   ├── group_dto.go
│   └── result_dto.go
├── cache/              # Redis client and utilities
│   └── redis.go
├── db/
│   ├── generated/      # sqlc generated code
│   ├── migrations/     # Database migrations
│   ├── queries/        # SQL queries for sqlc
│   └── schema/         # Database schema files
├── go.mod              # Go modules definition
└── go.sum              # Dependencies checksum
```

## Setup

### Prerequisites

- Go 1.24.3+
- PostgreSQL database
- Redis instance (or Upstash Redis)

### Environment Variables

```bash
# Required for Redis connection
REDIS_TOKEN=your_upstash_redis_token
```

### Installation

```bash
cd backend
go mod download
```

### Run

```bash
go run cmd/main.go
```

Server starts at `http://localhost:8080`

### Build

```bash
go build -o bin/server cmd/main.go
```

## API Endpoints

### GET /

Hello World endpoint

**Response**
```
Hello, World!
```

### POST /groups

Create a new group

**Request Body**
```json
{
  "name": "string (required)",
  "group_size": "number (required, minimum: 1)"
}
```

**Response (201 Created)**
```json
{
  "id": "uuid",
  "name": "string",
  "group_size": "number",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

**Error Responses**
- `400 Bad Request`: Invalid request body or validation failed
- `500 Internal Server Error`: Failed to create group

### POST /results/{group_id}

Save quiz result for a specific group. Returns the result with its ranking position and top 5 rankings.

**Path Parameters**
- `group_id`: UUID of the group

**Request Body**
```json
{
  "score": "number (required, minimum: 0)",
  "context": {
    "groupId": "string",
    "startedAt": "ISO 8601 timestamp string",
    "totalQuestions": "number",
    "questionStates": [
      {
        "id": "number",
        "status": "unanswered | correct | incorrect",
        "answer": "string (optional)"
      }
    ]
  }
}
```

**Response (201 Created)**
```json
{
  "id": "uuid",
  "group_id": "uuid",
  "score": "number",
  "context": {
    "groupId": "string",
    "startedAt": "ISO 8601 timestamp string",
    "totalQuestions": "number",
    "questionStates": [
      {
        "id": "number",
        "status": "unanswered | correct | incorrect",
        "answer": "string (optional)"
      }
    ]
  },
  "rank": "number",
  "deviation": "number",
  "percentile": "number",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp",
  "top_five": [
    {
      "id": "uuid",
      "group_id": "uuid",
      "group_name": "string",
      "score": "number",
      "rank": "number",
      "created_at": "ISO 8601 timestamp"
    }
  ]
}
```

**Response Fields (New)**
- `deviation`: 偏差値（20-80の範囲、平均50、標準偏差10）
- `percentile`: 正答率（0-100の範囲、score/45*100で計算）

**Error Responses**
- `400 Bad Request`: Invalid group_id format, request body, or validation failed
- `500 Internal Server Error`: Failed to create result

### GET /ranking

Get paginated ranking results

**Query Parameters**
- `offset`: Starting position (optional, default: 0)
- `limit`: Number of results to return (optional, default: 30)

**Response (200 OK)**
```json
{
  "rankings": [
    {
      "id": "uuid",
      "group_id": "uuid", 
      "group_name": "string",
      "score": "number",
      "rank": "number",
      "created_at": "ISO 8601 timestamp"
    }
  ]
}
```

**Error Responses**
- `500 Internal Server Error`: Failed to get ranking

## Middleware

- **Logger**: Request logging
- **Recover**: Panic recovery

## Development

### Test

```bash
go test ./...
```

### Format

```bash
go fmt ./...
```

## Docker

### Build Image

```bash
cd backend
docker build -t machikane-backend .
```

### Run Container

```bash
docker run -p 8080:8080 machikane-backend
```

### Using Docker Compose

See [Docker documentation](./docker.md) for full setup with all services.

## Architecture & Coding Standards

### Clean Architecture

This project follows Clean Architecture principles with dependency injection:

1. **Controller Layer** (`controller/`)
   - HTTP request handling
   - Request/Response validation
   - Depends on UseCase interfaces

2. **UseCase Layer** (`usecase/`)
   - Business logic coordination
   - Depends on Repository interfaces
   - Independent of HTTP and data concerns

3. **Repository Layer** (`repository/`)
   - Data access abstraction
   - Database operations with caching
   - Redis cache management
   - Depends on database and cache clients

4. **DTO Layer** (`dto/`)
   - Data Transfer Objects
   - Request/Response structures
   - Validation tags

5. **Cache Layer** (`cache/`)
   - Redis client wrapper
   - Connection management
   - Key generation utilities

### Coding Conventions

#### Interface Design
- Always define interfaces before implementations
- Use dependency injection pattern
- Controllers depend on UseCase interfaces
- UseCases depend on Repository interfaces
- Repositories depend on database and cache clients

#### Naming Conventions
- **Files**: snake_case (e.g., `group_controller.go`)
- **Interfaces**: PascalCase with descriptive names (e.g., `GroupController`, `GroupUseCase`)
- **DTOs**: PascalCase ending with `Dto` (e.g., `CreateGroupDto`)
- **Functions**: camelCase, exported functions start with capital letter

#### Error Handling
- Always include specific error messages with context
- Use `fmt.Errorf` for error wrapping
- Return detailed error messages in API responses for debugging

#### Database & Caching
- Use UUID v7 for all primary keys (time-sortable)
- Use sqlc for type-safe database operations
- All database operations should be in the Repository layer
- Redis caching for performance optimization
- Optimized indexes for ranking queries:
  - `idx_results_ranking`: (score DESC, created_at ASC) for global ranking
  - `idx_results_group_score`: (group_id, score DESC) for group-specific ranking

#### Caching Strategy
- **Ranking Cache**: Key format `ranking:{limit}:{offset}`
- **TTL**: 5 minutes for ranking data
- **Cache Invalidation**: Automatic on new result creation
- **Fallback**: Always serve from database if cache fails

#### Validation
- Use struct tags for request validation (`validate:"required"`)
- Validate all incoming requests in controllers
- Return detailed validation error messages

#### Example Implementation Pattern
```go
// 1. Define DTO
type CreateEntityDto struct {
    Name string `json:"name" validate:"required"`
}

// 2. Define repository interface
type EntityRepository interface {
    CreateEntity(ctx context.Context, dto CreateEntityDto) (*EntityResponseDto, error)
}

// 3. Implement repository
type entityRepository struct {
    queries *db.Queries
    redisClient *cache.RedisClient
}

// 4. Define usecase interface
type EntityUseCase interface {
    CreateEntity(ctx context.Context, dto CreateEntityDto) (*EntityResponseDto, error)
}

// 5. Implement usecase
type entityUseCase struct {
    entityRepo EntityRepository
}

// 6. Implement controller
type entityController struct {
    entityUseCase EntityUseCase
}
```

## Caching & Performance

### Redis Caching

#### Connection
- **Provider**: Upstash Redis
- **URL**: `rediss://default:{token}@nice-earwig-18408.upstash.io:6379`
- **Authentication**: Token-based via `REDIS_TOKEN` environment variable

#### Caching Strategy
- **Ranking Queries**: Cached for 5 minutes with key `ranking:{limit}:{offset}`
- **Cache Invalidation**: Triggered on new result creation
- **Error Handling**: Graceful fallback to database if Redis fails
- **Common Cache Keys**: Pre-warmed for popular pagination combinations

#### Performance Benefits
- **Reduced Database Load**: Frequently accessed rankings served from cache
- **Faster Response Times**: Sub-millisecond cache lookups
- **Scalability**: Better handling of concurrent ranking requests

## Statistical Calculations

### Deviation Score (偏差値)

The system calculates deviation scores in real-time without requiring additional database queries for optimal performance.

#### Calculation Method
```
偏差値 = 50 + 10 × (個人のスコア - 推定平均) / 推定標準偏差
```

#### Assumptions
- **Estimated Mean**: 60% of max score (27 out of 45 points)
- **Estimated Standard Deviation**: 20% of max score (9 points)
- **Range**: Clamped to 20-80 for realistic results
- **Adjustment**: If top 5 average is significantly higher, the mean is adjusted upward

#### Performance Features
- **No Additional Queries**: Uses existing rank and top results data
- **Real-time Calculation**: Computed in repository layer
- **Lightweight**: Statistical estimation provides sufficient accuracy

### Percentile (正答率)

Simple percentage calculation based on score ratio:
```
正答率 = (スコア / 45) × 100
```

## CI/CD

Automated build and test with GitHub Actions
- Workflow: `.github/workflows/ci-backend.yml`
- Workflow: `.github/workflows/update-image.yml` (Docker image build on backend changes)
- Trigger: Changes to `backend/` directory