# backend/app/models.py
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import UniqueConstraint
from datetime import datetime
from pydantic import field_validator,EmailStr

# ---------------------------------------------------
# User Model
# ---------------------------------------------------
class UserBase(SQLModel):
    email: str = Field(index=True, nullable=False)  # Mude EmailStr para str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if '@' not in v or '.' not in v.split('@')[-1]:
            raise ValueError('Email inválido')
        return v
    full_name: str = Field(nullable=False)
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relacionamentos
    led_team: Optional["Team"] = Relationship(back_populates="leader")
    team_associations: List["UserTeam"] = Relationship(back_populates="user")

class UserCreate(UserBase):
    pass

class UserUpdate(SQLModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserRead(UserBase):
    id: int

class UserWithTeam(UserRead):
    team_id: Optional[int] = None
    team_name: Optional[str] = None

# ---------------------------------------------------
# Team Models
# ---------------------------------------------------
class TeamBase(SQLModel):
    name: str = Field(nullable=False)
    description: Optional[str] = None

class Team(TeamBase, table=True):
    __tablename__ = "teams"
    __table_args__ = (
        UniqueConstraint("leader_id", name="uq_teams_leader_id"),
        UniqueConstraint("name", name="uq_teams_name"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    leader_id: int = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # Relacionamentos
    leader: Optional[User] = Relationship(back_populates="led_team")
    member_associations: List["UserTeam"] = Relationship(back_populates="team")

class TeamCreate(TeamBase):
    leader_id: int

class TeamUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    leader_id: Optional[int] = None

class TeamRead(TeamBase):
    id: int
    leader_id: int
    created_at: datetime

class TeamWithMembers(TeamRead):
    leader_name: Optional[str] = None
    member_count: int = 0
    members: List[dict] = []

# ---------------------------------------------------
# UserTeam Models (tabela de associação)
# ---------------------------------------------------
class UserTeamBase(SQLModel):
    user_id: int = Field(foreign_key="users.id", nullable=False)
    team_id: int = Field(foreign_key="teams.id", nullable=False)

class UserTeam(UserTeamBase, table=True):
    __tablename__ = "users_teams"
    __table_args__ = (
        UniqueConstraint("user_id", name="uq_users_teams_user_id"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relacionamentos
    user: Optional[User] = Relationship(back_populates="team_associations")
    team: Optional[Team] = Relationship(back_populates="member_associations")

class UserTeamCreate(UserTeamBase):
    pass

class UserTeamRead(UserTeamBase):
    id: int