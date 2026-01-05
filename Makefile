.PHONY: help dev staging up down build logs ps clean test

# Default environment
ENV ?= dev

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Environments:$(NC)"
	@echo "  $(YELLOW)dev$(NC)      - Development (hot-reload, localhost)"
	@echo ""
	@echo "$(GREEN)Usage examples:$(NC)"
	@echo "  make dev-up          # Start development environment"
	@echo "  make dev-logs        # Show development logs"
	@echo "  make clean           # Clean all containers and volumes"

# Development commands
dev-up: ## Start development environment
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:8000"
	@echo "Adminer: http://localhost:8080"
	@echo "Mailcatcher: http://localhost:1080"

dev-down: ## Stop development environment
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-build: ## Build development environment
	@echo "$(GREEN)Building development environment...$(NC)"
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build

dev-logs: ## Show development logs
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

dev-ps: ## Show development containers status
	docker compose -f docker-compose.yml -f docker-compose.dev.yml ps

dev-restart: ## Restart development environment
	@make dev-down
	@make dev-up
# Common commands
clean: ## Clean all containers, volumes and networks
	@echo "$(RED)Warning: This will remove all containers, volumes and orphaned containers!$(NC)"
	@bash -c 'read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans; \
		docker compose -f docker-compose.yml -f docker-compose.traefik.yml -f docker-compose.staging.yml down -v --remove-orphans; \
		echo "$(GREEN)Cleanup completed!$(NC)"; \
	fi'

config: ## Show merged development configuration
	docker compose -f docker-compose.yml -f docker-compose.dev.yml config

# Backend specific commands
backend-shell: ## Open backend shell (dev)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend bash

backend-logs: ## Show backend logs (dev)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f backend

# Frontend specific commands
frontend-shell: ## Open frontend shell (dev)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend sh

frontend-logs: ## Show frontend logs (dev)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f frontend

# Database commands
db-new-migration: ## Create a new Alembic migration (usage: make db-new-migration MESSAGE="desc")
	@if [ -z "$(MESSAGE)" ]; then \
		echo "$(RED)Error: MESSAGE parameter is required$(NC)"; \
		echo "Usage: make db-new-migration MESSAGE=\"Descrição da mudança\""; \
		exit 1; \
	fi
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic revision --autogenerate -m "$(MESSAGE)"

db-upgrade: ## Apply Alembic migrations (dev) (usage: make db-upgrade [REVISION=<rev>] [STEP=<n>])
	@bash -c 'if [ -n """$(REVISION)""" ]; then \
		docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic upgrade """$(REVISION)"""; \
	elif [ -n """$(STEP)""" ]; then \
		docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic upgrade +"""$(STEP)"""; \
	else \
		docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic upgrade head; \
	fi'

db-downgrade: ## Downgrade Alembic migrations (usage: make db-downgrade REVISION=<rev> | STEP=<n>)
	@bash -c 'if [ -z """$(REVISION)""" ] && [ -z """$(STEP)""" ]; then echo "$(RED)Error: REVISION or STEP required$(NC)"; exit 1; fi; '
	@bash -c 'if [ -n """$(STEP)""" ]; then \ 
		docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic downgrade -"""$(STEP)"""; \
	else \ 
		docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic downgrade """$(REVISION)"""; \ 
	fi'

db-shell: ## Open database shell (dev)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec db psql -U $${POSTGRES_USER:-postgres} -d $${POSTGRES_DB:-app}

db-backup: ## Backup database (dev, custom format)
	@echo "$(GREEN)Creating database backup...$(NC)"
	@mkdir -p ./backups
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T db pg_dump -U $${POSTGRES_USER:-postgres} -d $${POSTGRES_DB:-app} -Fc > ./backups/backup_$$(date +%Y%m%d_%H%M%S).dump
	@echo "$(GREEN)Backup created in ./backups/ (custom format)$(NC)"

db-restore: ## Restore database from backup (usage: make db-restore FILE=backup.dump)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)Error: FILE parameter required$(NC)"; \
		echo "Usage: make db-restore FILE=./backups/backup_20240101_120000.dump"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring database from $(FILE)...$(NC)"
	@echo "$(YELLOW)Step 1: Dropping all tables with CASCADE...$(NC)"
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T db psql -U $${POSTGRES_USER:-postgres} -d $${POSTGRES_DB:-app} -c \
		"DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO $${POSTGRES_USER:-postgres}; GRANT ALL ON SCHEMA public TO public;"
	@echo "$(YELLOW)Step 2: Restoring from backup...$(NC)"
	cat $(FILE) | docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T db pg_restore -U $${POSTGRES_USER:-postgres} -d $${POSTGRES_DB:-app} --no-owner --no-acl
	@echo "$(GREEN)Database restored successfully!$(NC)"

# Utility commands
pull: ## Pull latest images
	docker compose -f docker-compose.yml -f docker-compose.$(ENV).yml pull

rebuild: ## Rebuild and restart (usage: make rebuild ENV=dev)
	@echo "$(GREEN)Rebuilding $(ENV) environment...$(NC)"
	docker compose -f docker-compose.yml -f docker-compose.$(ENV).yml up -d --build

prune: ## Remove unused Docker resources
	@echo "$(YELLOW)Removing unused Docker resources...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)Prune completed!$(NC)"
