# backend/app/api/deps.py
from typing import Generator
from sqlmodel import Session
from app.core.db import SessionLocal

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()