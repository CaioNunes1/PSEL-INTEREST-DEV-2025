# app/api/main.py
from fastapi import APIRouter
from app.api.routes import users, teams

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(teams.router, prefix="/teams", tags=["teams"])

# Inclua outras rotas existentes aqui...