from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.api.deps import get_db
from app.models import TeamCreate, TeamUpdate, TeamRead, TeamWithMembers, UserTeamCreate, UserTeamRead
from app import crud

router = APIRouter()

@router.get("/", response_model=List[TeamWithMembers])
def read_teams(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    teams = crud.get_teams(db, skip=skip, limit=limit)
    result = []
    for team in teams:
        team_data = crud.get_team_with_members(db, team_id=team.id)
        if team_data:
            result.append(team_data)
    return result

@router.post("/", response_model=TeamRead)
def create_team(
    *,
    db: Session = Depends(get_db),
    team_in: TeamCreate
):
    return crud.create_team_with_leader(db, team_in)

@router.get("/{team_id}", response_model=TeamWithMembers)
def read_team(
    *,
    db: Session = Depends(get_db),
    team_id: int
):
    team_data = crud.get_team_with_members(db, team_id=team_id)
    if not team_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipe não encontrada"
        )
    return team_data

@router.put("/{team_id}", response_model=TeamRead)
def update_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    team_in: TeamUpdate
):
    team = crud.update_team(db, team_id, team_in)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipe não encontrada"
        )
    return team

@router.delete("/{team_id}")
def delete_team(
    *,
    db: Session = Depends(get_db),
    team_id: int
):
    team = crud.delete_team(db, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipe não encontrada"
        )
    return {"message": "Equipe excluída com sucesso"}

@router.post("/{team_id}/members", response_model=UserTeamRead)
def add_member_to_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    member_in: UserTeamCreate
):
    if member_in.team_id != team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID da equipe não corresponde"
        )
    return crud.add_member_to_team(db, team_id=team_id, user_id=member_in.user_id)

@router.delete("/{team_id}/members/{user_id}")
def remove_member_from_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    user_id: int
):
    return crud.remove_member_from_team(db, team_id=team_id, user_id=user_id)