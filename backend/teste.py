# backend/test_direct.py
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("="*60)
print("TESTANDO API DIRETAMENTE (sem Postman)")
print("="*60)

# Teste 1: Rota raiz
print("\n1. Testando rota raiz...")
response = client.get("/")
print(f"   Status: {response.status_code}")
print(f"   Resposta: {response.json()}")

# Teste 2: Health check
print("\n2. Testando health check...")
response = client.get("/health")
print(f"   Status: {response.status_code}")
print(f"   Resposta: {response.json()}")

# Teste 3: Criar usuário
print("\n3. Testando criar usuário...")
try:
    user_data = {
        "email": "teste_direct@exemplo.com",
        "full_name": "Teste Direct",
        "is_active": True
    }
    
    response = client.post("/api/v1/users/", json=user_data)
    print(f"   Status: {response.status_code}")
    
    if response.status_code in [200, 201]:
        print(f"   ✅ Sucesso! ID: {response.json().get('id')}")
    else:
        print(f"   ❌ Erro: {response.text}")
        
except Exception as e:
    print(f"   💥 EXCEÇÃO: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)