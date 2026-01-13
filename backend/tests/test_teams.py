# backend/tests/test_teams.py
import pytest
from fastapi import status
from sqlmodel import Session


class TestTeamEndpoints:
    """Testes para os endpoints de equipes"""
    
    # ---------- TESTES DE SUCESSO ----------
    
    def test_create_team_success(self, client, create_user):
        """Testa criação de equipe com sucesso"""
        # Arrange
        leader = create_user(email="leader@team.com")
        team_data = {
            "name": "Development Team",
            "description": "Team for developers",
            "leader_id": leader.id
        }
        
        # Act
        response = client.post("/api/v1/teams/", json=team_data)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == team_data["name"]
        assert data["description"] == team_data["description"]
        assert data["leader_id"] == leader.id
        assert "id" in data
        
        # Verifica se o líder foi adicionado como membro
        team_members_response = client.get(f"/api/v1/teams/{data['id']}")
        team_data = team_members_response.json()
        assert len(team_data["members"]) == 1
        assert team_data["members"][0]["id"] == leader.id
    
    def test_get_team_with_members(self, client, create_user, create_team):
        """Testa obtenção de equipe com membros"""
        # Arrange
        leader = create_user(email="leader@example.com")
        team = create_team(leader_id=leader.id, name="Team with Members")
        
        # Act
        response = client.get(f"/api/v1/teams/{team.id}")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == team.id
        assert data["name"] == team.name
        assert data["leader_id"] == leader.id
        assert len(data["members"]) == 1
        assert data["members"][0]["is_leader"] == True
    
    def test_update_team_success(self, client, create_user, create_team):
        """Testa atualização de equipe com sucesso"""
        # Arrange
        leader = create_user(email="original@leader.com")
        team = create_team(leader_id=leader.id, name="Old Name")
        new_leader = create_user(email="new@leader.com")
        
        update_data = {
            "name": "Updated Team Name",
            "description": "Updated description",
            "leader_id": new_leader.id
        }
        
        # Act
        response = client.put(f"/api/v1/teams/{team.id}", json=update_data)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["description"] == update_data["description"]
        assert data["leader_id"] == new_leader.id
    
    def test_add_member_to_team(self, client, create_user, create_team):
        """Testa adição de membro à equipe"""
        # Arrange
        leader = create_user(email="leader@add.com")
        member = create_user(email="member@add.com")
        team = create_team(leader_id=leader.id)
        
        member_data = {"user_id": member.id, "team_id": team.id}
        
        # Act
        response = client.post(f"/api/v1/teams/{team.id}/members", json=member_data)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["user_id"] == member.id
        assert data["team_id"] == team.id
        
        # Verifica se o membro aparece na lista
        team_response = client.get(f"/api/v1/teams/{team.id}")
        team_data = team_response.json()
        member_ids = [m["id"] for m in team_data["members"]]
        assert member.id in member_ids
        assert len(team_data["members"]) == 2  # Líder + novo membro
    
    def test_remove_member_from_team(self, client, create_user, create_team):
        """Testa remoção de membro da equipe"""
        # Arrange
        leader = create_user(email="leader@remove.com")
        member = create_user(email="member@remove.com")
        team = create_team(leader_id=leader.id)
        
        # Adiciona membro
        client.post(f"/api/v1/teams/{team.id}/members", 
                   json={"user_id": member.id, "team_id": team.id})
        
        # Act - Remove membro
        response = client.delete(f"/api/v1/teams/{team.id}/members/{member.id}")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert "removido" in response.json()["message"].lower()
        
        # Verifica se o membro foi removido
        team_response = client.get(f"/api/v1/teams/{team.id}")
        team_data = team_response.json()
        member_ids = [m["id"] for m in team_data["members"]]
        assert member.id not in member_ids
        assert len(team_data["members"]) == 1  # Apenas o líder
    
    def test_delete_team_success(self, client, create_user, create_team):
        """Testa exclusão de equipe"""
        # Arrange
        leader = create_user(email="leader@delete.com")
        team = create_team(leader_id=leader.id, name="Team to Delete")
        
        # Act
        response = client.delete(f"/api/v1/teams/{team.id}")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Equipe excluída com sucesso"
        
        # Verifica se a equipe foi realmente excluída
        get_response = client.get(f"/api/v1/teams/{team.id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    # ---------- TESTES DE FALHA ----------
    
    def test_create_team_duplicate_name(self, client, create_user):
        """Testa criação de equipe com nome duplicado"""
        # Arrange
        leader1 = create_user(email="leader1@duplicate.com")
        leader2 = create_user(email="leader2@duplicate.com")
        
        team_data1 = {
            "name": "Duplicate Team",
            "description": "First team",
            "leader_id": leader1.id
        }
        
        team_data2 = {
            "name": "Duplicate Team",  # Mesmo nome
            "description": "Second team",
            "leader_id": leader2.id
        }
        
        # Cria primeira equipe
        client.post("/api/v1/teams/", json=team_data1)
        
        # Act - Tenta criar segunda com mesmo nome
        response = client.post("/api/v1/teams/", json=team_data2)
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Nome da equipe já existe" in response.json()["detail"]
    
    def test_create_team_leader_already_leading(self, client, create_user, create_team):
        """Testa criação de equipe com líder que já lidera outra equipe"""
        # Arrange
        leader = create_user(email="busy@leader.com")
        team1 = create_team(leader_id=leader.id, name="Team 1")
        
        team_data = {
            "name": "Team 2",
            "description": "Another team",
            "leader_id": leader.id  # Mesmo líder
        }
        
        # Act
        response = client.post("/api/v1/teams/", json=team_data)
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "já é líder de outra equipe" in response.json()["detail"]
    
    def test_create_team_leader_not_found(self, client):
        """Testa criação de equipe com líder inexistente"""
        # Arrange
        team_data = {
            "name": "Team No Leader",
            "description": "Team without valid leader",
            "leader_id": 999  # ID inexistente
        }
        
        # Act
        response = client.post("/api/v1/teams/", json=team_data)
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Líder não encontrado" in response.json()["detail"]
    
    def test_add_member_already_in_team(self, client, create_user, create_team):
        """Testa adição de membro que já está na equipe"""
        # Arrange
        leader = create_user(email="leader@duplicate.com")
        team = create_team(leader_id=leader.id)
        
        member_data = {"user_id": leader.id, "team_id": team.id}  # Líder já é membro
        
        # Act
        response = client.post(f"/api/v1/teams/{team.id}/members", json=member_data)
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "já é membro desta equipe" in response.json()["detail"]
    
    def test_add_member_user_not_found(self, client, create_user, create_team):
        """Testa adição de membro inexistente"""
        # Arrange
        leader = create_user(email="leader@notfound.com")
        team = create_team(leader_id=leader.id)
        
        member_data = {"user_id": 999, "team_id": team.id}  # Usuário inexistente
        
        # Act
        response = client.post(f"/api/v1/teams/{team.id}/members", json=member_data)
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Usuário não encontrado" in response.json()["detail"]
    
    def test_remove_leader_from_team(self, client, create_user, create_team):
        """Testa remoção do líder da equipe"""
        # Arrange
        leader = create_user(email="leader@remove.com")
        team = create_team(leader_id=leader.id)
        
        # Act - Tenta remover o líder
        response = client.delete(f"/api/v1/teams/{team.id}/members/{leader.id}")
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Não é possível remover o líder" in response.json()["detail"]
    
    def test_remove_member_not_in_team(self, client, create_user, create_team):
        """Testa remoção de membro que não está na equipe"""
        # Arrange
        leader = create_user(email="leader@notmember.com")
        outsider = create_user(email="outsider@example.com")
        team = create_team(leader_id=leader.id)
        
        # Act
        response = client.delete(f"/api/v1/teams/{team.id}/members/{outsider.id}")
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "não é membro desta equipe" in response.json()["detail"]