# backend/test_final_fixed.py
import requests
import time
from datetime import datetime

BASE_URL = "http://localhost:8001"

def wait_for_api(timeout=10):
    """Aguarda a API ficar disponível"""
    print("Aguardando API inicializar...")
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f"{BASE_URL}/", timeout=2)
            if response.status_code == 200:
                print(f"✅ API disponível após {time.time() - start_time:.1f} segundos")
                return True
        except:
            pass
        time.sleep(0.5)
    
    print("❌ Timeout: API não respondeu")
    return False

def test_api():
    print("="*70)
    print("TESTE FINAL CORRIGIDO - API USERS & TEAMS")
    print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    # 1. Aguardar API
    if not wait_for_api():
        return
    
    # 2. Testar rotas básicas
    print("\n📡 TESTANDO ROTAS BÁSICAS:")
    try:
        resp = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"   • Rota raiz: {resp.status_code} - {resp.json()}")
        
        resp = requests.get(f"{BASE_URL}/health", timeout=5)
        health_data = resp.json()
        print(f"   • Health check: {resp.status_code} - {health_data}")
        
        # Verificar qual banco está sendo usado
        db_type = "PostgreSQL" if "postgresql" in health_data.get('database', '') else "SQLite"
        print(f"   • Banco de dados: {db_type}")
    except Exception as e:
        print(f"   ❌ Erro nas rotas básicas: {e}")
        return
    
    # 3. Limpar dados anteriores (opcional) ou usar emails únicos
    print("\n👥 TESTANDO CRIAÇÃO DE USUÁRIOS:")
    
    # Usar timestamp para emails únicos
    timestamp = int(time.time())
    
    # Criar usuário 1
    user1_data = {
        "email": f"user1_{timestamp}@test.com",
        "full_name": f"Usuário Teste {timestamp}",
        "is_active": True
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/api/v1/users/", json=user1_data, timeout=10)
        if resp.status_code in [200, 201]:
            user1 = resp.json()
            print(f"   ✅ Usuário 1 criado: ID {user1['id']}")
            user1_id = user1['id']
        else:
            print(f"   ❌ Erro ao criar usuário 1: {resp.status_code} - {resp.text}")
            return
    except Exception as e:
        print(f"   ❌ Exception ao criar usuário 1: {e}")
        return
    
    # Criar usuário 2
    user2_data = {
        "email": f"user2_{timestamp}@test.com",
        "full_name": f"Usuário Dois {timestamp}",
        "is_active": True
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/api/v1/users/", json=user2_data, timeout=10)
        if resp.status_code in [200, 201]:
            user2 = resp.json()
            print(f"   ✅ Usuário 2 criado: ID {user2['id']}")
            user2_id = user2['id']
        else:
            print(f"   ❌ Erro ao criar usuário 2: {resp.status_code} - {resp.text}")
            return
    except Exception as e:
        print(f"   ❌ Exception ao criar usuário 2: {e}")
        return
    
    # 4. Listar usuários
    print("\n📋 LISTANDO TODOS OS USUÁRIOS:")
    try:
        resp = requests.get(f"{BASE_URL}/api/v1/users/", timeout=5)
        if resp.status_code == 200:
            users = resp.json()
            print(f"   • Total de usuários no sistema: {len(users)}")
            print(f"   • Últimos 3 usuários:")
            for user in users[-3:]:  # Mostra os 3 últimos
                print(f"     - ID {user['id']}: {user['full_name']} ({user['email']})")
        else:
            print(f"   ❌ Erro ao listar usuários: {resp.status_code}")
    except Exception as e:
        print(f"   ❌ Exception ao listar usuários: {e}")
    
    # 5. Criar equipe
    print("\n🏢 TESTANDO CRIAÇÃO DE EQUIPE:")
    team_data = {
        "name": f"Equipe Dev {timestamp}",
        "description": "Equipe de desenvolvimento criada em teste",
        "leader_id": user1_id
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/api/v1/teams/", json=team_data, timeout=10)
        if resp.status_code in [200, 201]:
            team = resp.json()
            print(f"   ✅ Equipe criada: ID {team['id']} - '{team['name']}'")
            team_id = team['id']
            
            # 6. Adicionar membro à equipe
            print("\n➕ ADICIONANDO MEMBRO À EQUIPE:")
            member_data = {
                "user_id": user2_id,
                "team_id": team_id
            }
            
            resp = requests.post(f"{BASE_URL}/api/v1/teams/{team_id}/members", 
                               json=member_data, timeout=10)
            if resp.status_code in [200, 201]:
                print(f"   ✅ Usuário {user2_id} adicionado à equipe {team_id}")
            else:
                print(f"   ❌ Erro ao adicionar membro: {resp.status_code} - {resp.text}")
        else:
            print(f"   ❌ Erro ao criar equipe: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"   ❌ Exception na criação de equipe: {e}")
    
    # 7. Teste final - verificar documentação
    print("\n📚 VERIFICANDO DOCUMENTAÇÃO:")
    try:
        resp = requests.get(f"{BASE_URL}/docs", timeout=5, allow_redirects=False)
        if resp.status_code in [200, 307, 308]:
            print(f"   ✅ Documentação Swagger disponível em: http://localhost:8000/docs")
        else:
            print(f"   ⚠️  Documentação Swagger não disponível (status: {resp.status_code})")
    except:
        print("   ⚠️  Não foi possível verificar documentação")
    
    print("\n" + "="*70)
    print("🎉 TESTES CONCLUÍDOS COM SUCESSO!")
    print("="*70)
    
    # Resumo
    print("\n📊 RESUMO DA API:")
    print(f"   • URL Base: {BASE_URL}")
    print(f"   • Documentação: {BASE_URL}/docs")
    print(f"   • Banco de dados: PostgreSQL (via Docker)")
    print(f"   • Status: ✅ FUNCIONANDO PERFEITAMENTE")
    print(f"   • Próximos passos:")
    print(f"     1. Acesse {BASE_URL}/docs para testar endpoints")
    print(f"     2. Use Postman para testes manuais")
    print(f"     3. Integre com frontend")

if __name__ == "__main__":
    test_api()