# backend/test_complete.py
import requests
import time

BASE_URL = "http://localhost:8000"

def test_api():
    print("="*60)
    print("TESTE COMPLETO DA API")
    print("="*60)
    
    # 1. Teste rota raiz
    print("\n1. Testando rota raiz...")
    try:
        resp = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"   Status: {resp.status_code}")
        print(f"   Resposta: {resp.json()}")
    except requests.exceptions.ConnectionError:
        print("   ❌ API não está rodando! Execute:")
        print("   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        return
    
    # 2. Teste health
    print("\n2. Testando health check...")
    resp = requests.get(f"{BASE_URL}/health", timeout=5)
    print(f"   Status: {resp.status_code}")
    print(f"   Resposta: {resp.json()}")
    
    # 3. Criar usuário 1
    print("\n3. Criando primeiro usuário...")
    user1 = {
        "email": "usuario1@empresa.com",
        "full_name": "Usuário Um",
        "is_active": True
    }
    
    resp = requests.post(f"{BASE_URL}/api/v1/users/", json=user1, timeout=10)
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code in [200, 201]:
        user1_data = resp.json()
        print(f"   ✅ Usuário criado! ID: {user1_data.get('id')}")
        user1_id = user1_data.get('id')
    else:
        print(f"   ❌ Erro: {resp.text}")
        user1_id = None
    
    # 4. Criar usuário 2
    print("\n4. Criando segundo usuário...")
    user2 = {
        "email": "usuario2@empresa.com",
        "full_name": "Usuário Dois",
        "is_active": True
    }
    
    resp = requests.post(f"{BASE_URL}/api/v1/users/", json=user2, timeout=10)
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code in [200, 201]:
        user2_data = resp.json()
        print(f"   ✅ Usuário criado! ID: {user2_data.get('id')}")
        user2_id = user2_data.get('id')
    else:
        print(f"   ❌ Erro: {resp.text}")
        user2_id = None
    
    # 5. Listar todos os usuários
    print("\n5. Listando todos os usuários...")
    resp = requests.get(f"{BASE_URL}/api/v1/users/", timeout=5)
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code == 200:
        users = resp.json()
        print(f"   Total de usuários: {len(users)}")
        for user in users:
            print(f"   - ID {user.get('id')}: {user.get('full_name')} ({user.get('email')})")
    
    # 6. Criar equipe
    if user1_id:
        print("\n6. Criando equipe...")
        team = {
            "name": "Equipe de Desenvolvimento",
            "description": "Time responsável pelo desenvolvimento",
            "leader_id": user1_id
        }
        
        resp = requests.post(f"{BASE_URL}/api/v1/teams/", json=team, timeout=10)
        print(f"   Status: {resp.status_code}")
        
        if resp.status_code in [200, 201]:
            team_data = resp.json()
            print(f"   ✅ Equipe criada! ID: {team_data.get('id')}")
            team_id = team_data.get('id')
            
            # 7. Adicionar segundo usuário à equipe
            print("\n7. Adicionando segundo usuário à equipe...")
            member_data = {
                "user_id": user2_id,
                "team_id": team_id
            }
            
            resp = requests.post(f"{BASE_URL}/api/v1/teams/{team_id}/members", 
                                json=member_data, timeout=10)
            print(f"   Status: {resp.status_code}")
            
            if resp.status_code in [200, 201]:
                print("   ✅ Membro adicionado à equipe!")
            else:
                print(f"   ❌ Erro: {resp.text}")
        else:
            print(f"   ❌ Erro ao criar equipe: {resp.text}")
    
    print("\n" + "="*60)
    print("TESTE CONCLUÍDO!")
    print("="*60)

if __name__ == "__main__":
    test_api()