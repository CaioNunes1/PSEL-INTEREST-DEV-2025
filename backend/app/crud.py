# backend/app/crud.py
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from typing import List, Optional
from app.models import User, UserCreate, UserUpdate, Team, TeamCreate, TeamUpdate, UserTeam

# ========== Operações para Usuários ==========

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.get(User, user_id)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    # CORREÇÃO: Use execute() em vez de exec()
    result = db.execute(statement)
    return result.scalars().first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    statement = select(User).offset(skip).limit(limit)
    # CORREÇÃO: Use execute() em vez de exec()
    result = db.execute(statement)
    return result.scalars().all()

def create_user(db: Session, user_create: UserCreate) -> User:
    # Verifica se email já existe
    existing_user = get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    db_user = User.model_validate(user_create)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    # Atualiza apenas os campos fornecidos
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> Optional[User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    # Verifica se o usuário é líder de alguma equipe
    statement = select(Team).where(Team.leader_id == user_id)
    # CORREÇÃO: Use execute() em vez de exec()
    result = db.execute(statement)
    team_led = result.scalars().first()
    if team_led:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir um usuário que lidera uma equipe"
        )
    
    db.delete(db_user)
    db.commit()
    return db_user

def get_users_with_team_info(db: Session, skip: int = 0, limit: int = 100) -> List[dict]:
    users = get_users(db, skip=skip, limit=limit)
    result = []
    
    for user in users:
        user_data = {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "team_id": None,
            "team_name": None
        }
        
        # Verifica se o usuário está em alguma equipe
        if user.team_associations:
            user_team = user.team_associations[0]
            user_data["team_id"] = user_team.team_id
            # Precisamos buscar o nome da equipe
            team = db.get(Team, user_team.team_id)
            if team:
                user_data["team_name"] = team.name
        
        result.append(user_data)
    
    return result

# ========== Operações para Equipes ==========

def get_team(db: Session, team_id: int) -> Optional[Team]:
    return db.get(Team, team_id)

def get_teams(db: Session, skip: int = 0, limit: int = 100) -> List[Team]:
    statement = select(Team).offset(skip).limit(limit)
    # CORREÇÃO: Use execute() em vez de exec()
    result = db.execute(statement)
    return result.scalars().all()

def create_team_with_leader(db: Session, team_create: TeamCreate) -> Team:
    # Verifica se o líder existe
    leader = get_user(db, team_create.leader_id)
    if not leader:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Líder não encontrado"
        )
    
    # Verifica se o líder já lidera outra equipe
    statement = select(Team).where(Team.leader_id == team_create.leader_id)
    # CORREÇÃO: Use execute() em vez de exec()
    result = db.execute(statement)
    existing_lead = result.scalars().first()
    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este usuário já é líder de outra equipe"
        )
    
    # Cria a equipe
    db_team = Team.model_validate(team_create)
    
    try:
        db.add(db_team)
        db.commit()
        db.refresh(db_team)
        
        # Adiciona o líder como membro da equipe
        add_member_to_team(db, team_id=db_team.id, user_id=team_create.leader_id)
        
        return db_team
    except IntegrityError as e:
        db.rollback()
        # Verifica se é erro de nome duplicado
        if "unique constraint" in str(e).lower() and "name" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nome da equipe já existe"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao criar equipe: {str(e)}"
        )

def update_team(db: Session, team_id: int, team_update: TeamUpdate) -> Optional[Team]:
    db_team = get_team(db, team_id)
    if not db_team:
        return None
    
    update_data = team_update.model_dump(exclude_unset=True)
    
    # Se estiver tentando mudar o líder, verifica regras
    if 'leader_id' in update_data and update_data['leader_id'] != db_team.leader_id:
        # Verifica se o novo líder já lidera outra equipe
        statement = select(Team).where(
            Team.leader_id == update_data['leader_id'],
            Team.id != team_id
        )
        # CORREÇÃO: Use execute() em vez de exec()
        result = db.execute(statement)
        existing_lead = result.scalars().first()
        if existing_lead:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este usuário já é líder de outra equipe"
            )
    
    # Atualiza os campos
    for key, value in update_data.items():
        setattr(db_team, key, value)
    
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def delete_team(db: Session, team_id: int) -> Optional[Team]:
    db_team = get_team(db, team_id)
    if not db_team:
        return None
    
    db.delete(db_team)
    db.commit()
    return db_team

def add_member_to_team(db: Session, team_id: int, user_id: int) -> UserTeam:
    # Verifica se a equipe existe
    team = get_team(db, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipe não encontrada"
        )
    
    # Verifica se o usuário existe
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Verifica se o usuário já está em alguma equipe
    statement = select(UserTeam).where(UserTeam.user_id == user_id)
    # CORREÇÃO: Use execute() em vez de exec()
    result = db.execute(statement)
    existing_membership = result.scalars().first()
    
    if existing_membership:
        if existing_membership.team_id == team_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuário já é membro desta equipe"
            )
        
        # DECISÃO DE DESIGN: Transferir automaticamente
        db.delete(existing_membership)
        db.commit()
    
    # Adiciona à nova equipe
    user_team = UserTeam(user_id=user_id, team_id=team_id)
    db.add(user_team)
    db.commit()
    db.refresh(user_team)
    
    return user_team

def remove_member_from_team(db: Session, team_id: int, user_id: int) -> dict:
    # Verifica se o membro existe
    statement = select(UserTeam).where(
        UserTeam.team_id == team_id,
        UserTeam.user_id == user_id
    )
    # CORREÇÃO: Use execute() em vez de exec()
    result = db.execute(statement)
    user_team = result.scalars().first()
    
    if not user_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não é membro desta equipe"
        )
    
    # Verifica se não está tentando remover o líder
    team = get_team(db, team_id)
    if team.leader_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível remover o líder da equipe"
        )
    
    db.delete(user_team)
    db.commit()
    
    return {"message": "Membro removido com sucesso"}

def get_team_with_members(db: Session, team_id: int) -> Optional[dict]:
    team = get_team(db, team_id)
    if not team:
        return None
    
    # Obtém informações dos membros
    members_info = []
    for association in team.member_associations:
        user = association.user
        members_info.append({
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_leader": user.id == team.leader_id
        })
    
    # Obtém nome do líder
    leader = get_user(db, team.leader_id)
    leader_name = leader.full_name if leader else "Desconhecido"
    
    return {
        "id": team.id,
        "name": team.name,
        "description": team.description,
        "leader_id": team.leader_id,
        "leader_name": leader_name,
        "created_at": team.created_at,
        "member_count": len(members_info),
        "members": members_info
    }
# backend/app/crud.py - Adicione esta função no final
def delete_team(db: Session, team_id: int) -> Optional[Team]:
    db_team = get_team(db, team_id)
    if not db_team:
        return None
    
    # Primeiro deleta todas as associações de membros
    from app.models import UserTeam
    statement = select(UserTeam).where(UserTeam.team_id == team_id)
    result = db.execute(statement)
    associations = result.scalars().all()
    
    for association in associations:
        db.delete(association)
    
    db.commit()
    
    # Agora deleta a equipe
    db.delete(db_team)
    db.commit()
    return db_team