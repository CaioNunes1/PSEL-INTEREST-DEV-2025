# backend/tests/test_users.py
import pytest
from fastapi import status
from sqlmodel import Session


class TestUserEndpoints:
    """Testes para os endpoints de usuários"""
    
    # ---------- TESTES DE SUCESSO ----------
    
    def test_create_user_success(self, client, test_user_data):
        """Testa criação de usuário com sucesso"""
        # Arrange
        user_data = test_user_data.copy()
        
        # Act
        response = client.post("/api/v1/users/", json=user_data)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["full_name"] == user_data["full_name"]
        assert data["is_active"] == user_data["is_active"]
        assert "id" in data
    
    def test_get_user_success(self, client, create_user):
        """Testa obtenção de usuário existente"""
        # Arrange
        user = create_user(email="get@example.com")
        
        # Act
        response = client.get(f"/api/v1/users/{user.id}")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == user.id
        assert data["email"] == user.email
    
    def test_get_users_with_team_info(self, client, create_user, create_team, create_user_team_association):
        """Testa listagem de usuários com informações de equipe"""
        # Arrange
        user1 = create_user(email="user1@example.com")
        user2 = create_user(email="user2@example.com")
        team = create_team(leader_id=user1.id, name="Team Alpha")
        create_user_team_association(user_id=user2.id, team_id=team.id)
        
        # Act
        response = client.get("/api/v1/users/")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 2
        
        # Verifica se as informações de equipe estão presentes
        user1_data = next(u for u in data if u["id"] == user1.id)
        assert user1_data["team_name"] == "Team Alpha"
        
        user2_data = next(u for u in data if u["id"] == user2.id)
        assert user2_data["team_name"] == "Team Alpha"
    
    def test_update_user_success(self, client, create_user):
        """Testa atualização de usuário com sucesso"""
        # Arrange
        user = create_user(email="update@example.com")
        update_data = {"full_name": "Updated Name", "is_active": False}
        
        # Act
        response = client.put(f"/api/v1/users/{user.id}", json=update_data)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["full_name"] == "Updated Name"
        assert data["is_active"] == False
        assert data["email"] == user.email  # Email não deve mudar
    
    def test_delete_user_success(self, client, create_user):
        """Testa exclusão de usuário sem vínculos"""
        # Arrange
        user = create_user(email="delete@example.com")
        
        # Act
        response = client.delete(f"/api/v1/users/{user.id}")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Usuário excluído com sucesso"
        
        # Verifica se o usuário foi realmente excluído
        get_response = client.get(f"/api/v1/users/{user.id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    # ---------- TESTES DE FALHA ----------
    
    def test_create_user_duplicate_email(self, client, create_user):
        """Testa criação de usuário com email duplicado"""
        # Arrange
        user = create_user(email="duplicate@example.com")
        duplicate_data = {
            "email": user.email,
            "full_name": "Another User",
            "is_active": True
        }
        
        # Act
        response = client.post("/api/v1/users/", json=duplicate_data)
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Email já cadastrado" in response.json()["detail"]
    
    def test_create_user_invalid_email(self, client):
        """Testa criação de usuário com email inválido"""
        # Arrange
        invalid_data = {
            "email": "invalid-email",
            "full_name": "Test User",
            "is_active": True
        }
        
        # Act
        response = client.post("/api/v1/users/", json=invalid_data)
        
        # Assert
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        assert "Email inválido" in str(response.json())
    
    def test_get_user_not_found(self, client):
        """Testa obtenção de usuário inexistente"""
        # Act
        response = client.get("/api/v1/users/999")
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_user_not_found(self, client):
        """Testa atualização de usuário inexistente"""
        # Act
        response = client.put("/api/v1/users/999", json={"full_name": "Updated"})
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_user_team_leader(self, client, create_user, create_team):
        """Testa exclusão de usuário que é líder de equipe"""
        # Arrange
        user = create_user(email="leader@example.com")
        team = create_team(leader_id=user.id, name="Team Leader")
        
        # Act
        response = client.delete(f"/api/v1/users/{user.id}")
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "lidera" in response.json()["detail"].lower()