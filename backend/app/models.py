import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

# Arquivo base para criação de todos os modelos necessários
# Serve como base para User e Team models
# Através dele a exportação para o alembic deve ser executada

