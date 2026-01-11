from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.api.deps import get_db
from app.models import UserCreate, UserUpdate, UserRead, UserWithTeam
from app import crud

router = APIRouter()

@router.get("/", response_model=List[UserWithTeam])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return crud.get_users_with_team_info(db, skip=skip, limit=limit)

@router.post("/", response_model=UserRead)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
):
    return crud.create_user(db, user_in)

@router.put("/{user_id}", response_model=UserRead)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: UserUpdate
):
    user = crud.update_user(db, user_id, user_in)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    return user

@router.delete("/{user_id}")
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: int
):
    try:
        user = crud.delete_user(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        return {"message": "Usuário excluído com sucesso"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao excluir usuário: {str(e)}"
        )