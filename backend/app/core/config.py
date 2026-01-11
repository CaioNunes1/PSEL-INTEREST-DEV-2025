# backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Gestão de Equipes"
    
    # Database - PostgreSQL Docker
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5433  # Sua porta do Docker
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "changethis"
    POSTGRES_DB: str = "app"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()