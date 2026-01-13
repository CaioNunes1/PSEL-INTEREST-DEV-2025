# backend/tests/test_crud.py
import pytest
from fastapi import HTTPException, status
from sqlmodel import Session,select

from app import crud
from app.models import UserCreate, UserUpdate, TeamCreate, TeamUpdate


class TestCRUDOperations:
    """Testes das operações CRUD diretas"""
    
    # ---------- TESTES DE USUÁRIOS ----------
    
    def test_create_user_crud(self, session: Session):
        """Testa criação de usuário via CRUD"""
        # Arrange
        user_data = UserCreate(
            email="crud@example.com",
            full_name="CRUD User",
            is_active=True
        )
        
        # Act
        user = crud.create_user(session, user_data)
        
        # Assert
        assert user.id is not None
        assert user.email == user_data.email
        assert user.full_name == user_data.full_name
        
        # Verifica se foi salvo no banco
        db_user = crud.get_user(session, user.id)
        assert db_user is not None
        assert db_user.email == user.email
    
    def test_get_user_by_email(self, session: Session):
        """Testa busca de usuário por email"""
        # Arrange
        user_data = UserCreate(
            email="find@email.com",
            full_name="Find Me",
            is_active=True
        )
        user = crud.create_user(session, user_data)
        
        # Act
        found_user = crud.get_user_by_email(session, user.email)
        
        # Assert
        assert found_user is not None
        assert found_user.id == user.id
        assert found_user.email == user.email
    
    def test_update_user_partial(self, session: Session):
        """Testa atualização parcial de usuário"""
        # Arrange
        user_data = UserCreate(
            email="partial@update.com",
            full_name="Original Name",
            is_active=True
        )
        user = crud.create_user(session, user_data)
        
        update_data = UserUpdate(full_name="Updated Name")
        
        # Act
        updated_user = crud.update_user(session, user.id, update_data)
        
        # Assert
        assert updated_user is not None
        assert updated_user.full_name == "Updated Name"
        assert updated_user.email == user.email  # Não mudou
    
    def test_get_users_with_team_info_crud(self, session: Session):
        """Testa obtenção de usuários com informações de equipe via CRUD"""
        # Arrange - Cria usuários e equipe
        from app.models import User, Team, UserTeam
        
        user1 = User(email="user1@team.com", full_name="User 1")
        user2 = User(email="user2@team.com", full_name="User 2")
        session.add_all([user1, user2])
        session.commit()
        session.refresh(user1)
        session.refresh(user2)
        
        team = Team(name="Test Team", leader_id=user1.id)
        session.add(team)
        session.commit()
        session.refresh(team)
        
        # Adiciona ambos como membros
        ut1 = UserTeam(user_id=user1.id, team_id=team.id)
        ut2 = UserTeam(user_id=user2.id, team_id=team.id)
        session.add_all([ut1, ut2])
        session.commit()
        
        # Act
        users_with_teams = crud.get_users_with_team_info(session)
        
        # Assert
        assert len(users_with_teams) >= 2
        
        # Verifica informações da equipe
        user1_data = next(u for u in users_with_teams if u["id"] == user1.id)
        assert user1_data["team_id"] == team.id
        assert user1_data["team_name"] == team.name
        
        user2_data = next(u for u in users_with_teams if u["id"] == user2.id)
        assert user2_data["team_id"] == team.id
    
    # ---------- TESTES DE EQUIPES ----------
    
    def test_create_team_with_leader_crud(self, session: Session):
        """Testa criação de equipe com líder via CRUD"""
        # Arrange
        from app.models import User
        
        leader = User(email="leader@team.com", full_name="Team Leader")
        session.add(leader)
        session.commit()
        session.refresh(leader)
        
        team_data = TeamCreate(
            name="CRUD Team",
            description="Team created via CRUD",
            leader_id=leader.id
        )
        
        # Act
        team = crud.create_team_with_leader(session, team_data)
        
        # Assert
        assert team.id is not None
        assert team.name == team_data.name
        assert team.leader_id == leader.id
        
        # Verifica se o líder foi adicionado como membro
        from sqlmodel import select
        from app.models import UserTeam
        
        statement = select(UserTeam).where(
            UserTeam.team_id == team.id,
            UserTeam.user_id == leader.id
        )
        result = session.execute(statement)
        user_team = result.scalars().first()
        assert user_team is not None
    
    def test_add_member_to_team_transfer(self, session: Session):
        """Testa transferência automática de usuário entre equipes"""
        # Arrange - Cria duas equipes e um usuário
        from app.models import User, Team, UserTeam
        
        # Cria líderes
        leader1 = User(email="leader1@transfer.com", full_name="Leader 1")
        leader2 = User(email="leader2@transfer.com", full_name="Leader 2")
        member = User(email="member@transfer.com", full_name="Member")
        session.add_all([leader1, leader2, member])
        session.commit()
        session.refresh(leader1)
        session.refresh(leader2)
        session.refresh(member)
        
        # Cria equipes
        team1 = Team(name="Team 1", leader_id=leader1.id)
        team2 = Team(name="Team 2", leader_id=leader2.id)
        session.add_all([team1, team2])
        session.commit()
        session.refresh(team1)
        session.refresh(team2)
        
        # Adiciona membro à primeira equipe
        crud.add_member_to_team(session, team_id=team1.id, user_id=member.id)
        
        # Verifica que está na primeira equipe
        statement = select(UserTeam).where(UserTeam.user_id == member.id)
        result = session.execute(statement)
        first_association = result.scalars().first()
        assert first_association.team_id == team1.id
        
        # Act - Adiciona à segunda equipe (deve transferir automaticamente)
        new_association = crud.add_member_to_team(session, team_id=team2.id, user_id=member.id)
        
        # Assert
        assert new_association.team_id == team2.id
        assert new_association.user_id == member.id
        
        # Verifica que não está mais na primeira equipe
        statement = select(UserTeam).where(
            UserTeam.user_id == member.id,
            UserTeam.team_id == team1.id
        )
        result = session.execute(statement)
        old_association = result.scalars().first()
        assert old_association is None
    
    def test_remove_member_from_team_crud(self, session: Session):
        """Testa remoção de membro via CRUD"""
        # Arrange
        from app.models import User, Team, UserTeam
        
        leader = User(email="leader@remove.com", full_name="Leader")
        member = User(email="member@remove.com", full_name="Member")
        session.add_all([leader, member])
        session.commit()
        session.refresh(leader)
        session.refresh(member)
        
        team = Team(name="Remove Team", leader_id=leader.id)
        session.add(team)
        session.commit()
        session.refresh(team)
        
        # Adiciona ambos como membros
        ut_leader = UserTeam(user_id=leader.id, team_id=team.id)
        ut_member = UserTeam(user_id=member.id, team_id=team.id)
        session.add_all([ut_leader, ut_member])
        session.commit()
        
        # Act - Remove o membro (não líder)
        result = crud.remove_member_from_team(session, team_id=team.id, user_id=member.id)
        
        # Assert
        assert "removido" in result["message"].lower()
        
        # Verifica que o membro foi removido
        statement = select(UserTeam).where(
            UserTeam.team_id == team.id,
            UserTeam.user_id == member.id
        )
        result = session.execute(statement)
        removed_association = result.scalars().first()
        assert removed_association is None
        
        # Verifica que o líder ainda está
        statement = select(UserTeam).where(
            UserTeam.team_id == team.id,
            UserTeam.user_id == leader.id
        )
        result = session.execute(statement)
        leader_association = result.scalars().first()
        assert leader_association is not None
    
    def test_remove_member_from_team_crud(self, session: Session):
        """Testa remoção de membro via CRUD"""
        # Arrange
        from app.models import User, Team, UserTeam
        
        leader = User(email="leader@remove.com", full_name="Leader")
        member = User(email="member@remove.com", full_name="Member")
        session.add_all([leader, member])
        session.commit()
        session.refresh(leader)
        session.refresh(member)
        
        team = Team(name="Remove Team", leader_id=leader.id)
        session.add(team)
        session.commit()
        session.refresh(team)
        
        # Adiciona ambos como membros
        ut_leader = UserTeam(user_id=leader.id, team_id=team.id)
        ut_member = UserTeam(user_id=member.id, team_id=team.id)
        session.add_all([ut_leader, ut_member])
        session.commit()
        
        # Act - Remove o membro (não líder)
        result = crud.remove_member_from_team(session, team_id=team.id, user_id=member.id)
        
        # Assert
        assert "removido" in result["message"].lower()
        
        # Verifica que o membro foi removido
        statement = select(UserTeam).where(
            UserTeam.team_id == team.id,
            UserTeam.user_id == member.id
        )
        result = session.execute(statement)
        removed_association = result.scalars().first()
        assert removed_association is None
        
        # Verifica que o líder ainda está
        statement = select(UserTeam).where(
            UserTeam.team_id == team.id,
            UserTeam.user_id == leader.id
        )
        result = session.execute(statement)
        leader_association = result.scalars().first()
        assert leader_association is not None
    
    # ---------- TESTES DE ERROS ----------
    
    def test_create_user_duplicate_email_error(self, session: Session):
        """Testa erro ao criar usuário com email duplicado"""
        # Arrange
        user_data1 = UserCreate(
            email="duplicate@error.com",
            full_name="First User",
            is_active=True
        )
        user_data2 = UserCreate(
            email="duplicate@error.com",  # Mesmo email
            full_name="Second User",
            is_active=True
        )
        
        crud.create_user(session, user_data1)
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            crud.create_user(session, user_data2)
        
        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "Email já cadastrado" in str(exc_info.value.detail)
    
    def test_add_member_user_not_found_error(self, session: Session):
        """Testa erro ao adicionar usuário inexistente à equipe"""
        # Arrange
        from app.models import User, Team
        
        leader = User(email="leader@error.com", full_name="Leader")
        session.add(leader)
        session.commit()
        session.refresh(leader)
        
        team = Team(name="Error Team", leader_id=leader.id)
        session.add(team)
        session.commit()
        session.refresh(team)
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            crud.add_member_to_team(session, team_id=team.id, user_id=999)
        
        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert "Usuário não encontrado" in str(exc_info.value.detail)
    
    def test_remove_leader_error(self, session: Session):
        """Testa erro ao tentar remover o líder da equipe"""
        # Arrange
        from app.models import User, Team, UserTeam
        
        leader = User(email="leader@removeerror.com", full_name="Leader")
        session.add(leader)
        session.commit()
        session.refresh(leader)
        
        team = Team(name="Leader Remove Team", leader_id=leader.id)
        session.add(team)
        session.commit()
        session.refresh(team)
        
        # Adiciona líder como membro
        ut = UserTeam(user_id=leader.id, team_id=team.id)
        session.add(ut)
        session.commit()
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            crud.remove_member_from_team(session, team_id=team.id, user_id=leader.id)
        
        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "Não é possível remover o líder" in str(exc_info.value.detail)