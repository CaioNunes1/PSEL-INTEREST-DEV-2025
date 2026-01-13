# backend/tests/conftest.py
import sys
import os
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from typing import Generator, Dict, Any

# Adiciona o diretório app ao path do Python
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    # Primeiro, tentamos importar get_session (que é o nome correto no seu db.py)
    from app.core.db import get_session
    from app.main import app
    from app.models import User, Team, UserTeam
    
    # Vamos verificar se a aplicação está configurada com get_session ou get_db
    # Precisamos ver qual dependência as rotas estão usando
    # Vamos criar uma função get_db que é apenas um alias para get_session
    # para manter compatibilidade
    
    print("✅ Importando get_session do app.core.db")
    
except ImportError as e:
    print(f"❌ Erro de importação: {e}")
    raise

# Configuração do banco de dados em memória para testes
@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    # Primeiro, precisamos descobrir qual dependência as rotas estão usando
    # Vamos verificar se temos get_db no deps.py ou se as rotas usam get_session diretamente
    
    try:
        from app.api.deps import get_db as deps_get_db
        # Se existe get_db em deps.py, sobrescrevemos ele
        def get_db_override():
            yield session
        
        app.dependency_overrides[deps_get_db] = get_db_override
        print("✅ Sobrescrevendo get_db do app.api.deps")
        
    except ImportError:
        # Se não existe get_db em deps.py, talvez as rotas importem get_session diretamente
        try:
            # Verifica se get_session é usado como dependência
            app.dependency_overrides[get_session] = lambda: session
            print("✅ Sobrescrevendo get_session diretamente")
        except Exception as e:
            print(f"⚠️  Não foi possível sobrescrever dependência: {e}")
    
    client = TestClient(app)
    yield client
    
    # Limpa as sobrescritas
    app.dependency_overrides.clear()


# Fixtures para dados de teste
@pytest.fixture
def test_user_data() -> Dict[str, Any]:
    return {
        "email": "testuser@example.com",
        "full_name": "Test User",
        "is_active": True
    }


@pytest.fixture
def test_team_data() -> Dict[str, Any]:
    return {
        "name": "Test Team",
        "description": "A test team",
        "leader_id": 1  # Será substituído nos testes
    }


# Fixtures para criar objetos no banco
@pytest.fixture
def create_user(session: Session):
    def _create_user(**kwargs):
        user_data = {
            "email": kwargs.get("email", f"user{kwargs.get('id', 1)}@example.com"),
            "full_name": kwargs.get("full_name", f"User {kwargs.get('id', 1)}"),
            "is_active": kwargs.get("is_active", True)
        }
        user = User(**user_data)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    return _create_user


@pytest.fixture
def create_team(session: Session):
    def _create_team(leader_id: int, **kwargs):
        team_data = {
            "name": kwargs.get("name", f"Team {kwargs.get('id', 1)}"),
            "description": kwargs.get("description", f"Description {kwargs.get('id', 1)}"),
            "leader_id": leader_id
        }
        team = Team(**team_data)
        session.add(team)
        session.commit()
        session.refresh(team)
        
        # Adiciona o líder como membro
        user_team = UserTeam(user_id=leader_id, team_id=team.id)
        session.add(user_team)
        session.commit()
        
        return team
    return _create_team


@pytest.fixture
def create_user_team_association(session: Session):
    def _create_association(user_id: int, team_id: int):
        association = UserTeam(user_id=user_id, team_id=team_id)
        session.add(association)
        session.commit()
        session.refresh(association)
        return association
    return _create_association