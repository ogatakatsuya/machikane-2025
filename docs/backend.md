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
├── go.mod               # Go modules definition
└── go.sum               # Dependencies checksum
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

## CI/CD

Automated build and test with GitHub Actions
- Workflow: `.github/workflows/ci-backend.yml`
- Trigger: Changes to `backend/` directory