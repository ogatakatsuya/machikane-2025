# Docker Setup

## Overview

Docker Compose setup for local development with hot reload support.

## Services

- **Frontend**: Next.js app with hot reload (port 3000)
- **Backend**: Go API server (port 8080)
- **MySQL**: Database server (port 3306)

## Prerequisites

- Docker
- Docker Compose

## Quick Start

```bash
# Start all services
docker compose up

# Start services in background
docker compose up -d

# Stop services
docker compose down

# Rebuild and start
docker compose up --build
```

## Service URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- MySQL: localhost:3306

## Database Configuration

- **Host**: mysql (or localhost from host machine)
- **Port**: 3306
- **Database**: machikane
- **User**: root
- **Password**: password

## Hot Reload

### Frontend
Files in `frontend/` are mounted as volume, changes trigger automatic reload.

### Backend
Backend currently requires manual rebuild. For hot reload, consider using [air](https://github.com/cosmtrek/air).

## Volume Management

```bash
# View volumes
docker volume ls

# Remove volumes (WARNING: deletes data)
docker compose down -v
```

## Logs

```bash
# View all logs
docker compose logs

# Follow logs
docker compose logs -f

# Service-specific logs
docker compose logs frontend
docker compose logs backend
docker compose logs mysql
```

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080
lsof -i :3306
```

### Database connection issues
Wait for MySQL to be healthy:
```bash
docker compose ps
```

### Reset everything
```bash
docker compose down -v
docker compose up --build
```