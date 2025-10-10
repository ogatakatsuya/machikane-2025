# Backend Documentation

## Overview

Go language and Echo framework based backend API server

## Tech Stack

- **Language**: Go 1.24.3
- **Framework**: [Echo v4](https://echo.labstack.com/)
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
├── dto/                # Data Transfer Objects
│   ├── group_dto.go
│   └── result_dto.go
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

**Error Responses**
- `400 Bad Request`: Invalid group_id format, request body, or validation failed
- `500 Internal Server Error`: Failed to create result

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
   - Business logic implementation
   - Depends on database interfaces
   - Independent of HTTP concerns

3. **DTO Layer** (`dto/`)
   - Data Transfer Objects
   - Request/Response structures
   - Validation tags

### Coding Conventions

#### Interface Design
- Always define interfaces before implementations
- Use dependency injection pattern
- Controllers depend on UseCase interfaces
- UseCases depend on Repository interfaces

#### Naming Conventions
- **Files**: snake_case (e.g., `group_controller.go`)
- **Interfaces**: PascalCase with descriptive names (e.g., `GroupController`, `GroupUseCase`)
- **DTOs**: PascalCase ending with `Dto` (e.g., `CreateGroupDto`)
- **Functions**: camelCase, exported functions start with capital letter

#### Error Handling
- Always include specific error messages with context
- Use `fmt.Errorf` for error wrapping
- Return detailed error messages in API responses for debugging

#### Database
- Use UUID v7 for all primary keys (time-sortable)
- Use sqlc for type-safe database operations
- All database operations should be in the UseCase layer
- Optimized indexes for ranking queries:
  - `idx_results_ranking`: (score DESC, created_at ASC) for global ranking
  - `idx_results_group_score`: (group_id, score DESC) for group-specific ranking

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

// 2. Define interface
type EntityUseCase interface {
    CreateEntity(ctx context.Context, dto CreateEntityDto) (*EntityResponseDto, error)
}

// 3. Implement usecase
type entityUseCase struct {
    queries *db.Queries
}

// 4. Implement controller
type entityController struct {
    entityUseCase EntityUseCase
}
```

## CI/CD

Automated build and test with GitHub Actions
- Workflow: `.github/workflows/ci-backend.yml`
- Trigger: Changes to `backend/` directory