# backend/app/main.py
from fastapi import FastAPI
from app.api.main import api_router
from app.core.config import settings
from app.core.db import create_db_and_tables

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CRIAR TABELAS NO INÍCIO
@app.on_event("startup")
def startup_event():
    create_db_and_tables()
    print("✅ Banco de dados SQLite configurado!")

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "API de Gestão de Equipes"}

@app.get("/health")  # ADICIONE ESTE ENDPOINT
def health_check():
    return {"status": "healthy", "database": "sqlite"}