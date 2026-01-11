# backend/app/core/db.py
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Configuração para PostgreSQL (SEM check_same_thread!)
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    echo=True
    # NÃO use connect_args para PostgreSQL!
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_session():
    with SessionLocal() as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)