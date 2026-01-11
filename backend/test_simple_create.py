# backend/test_simple_create.py
import requests

print("Testando criação de usuário...")

user_data = {
    "email": "teste.postgres@exemplo.com",
    "full_name": "Usuário PostgreSQL",
    "is_active": True
}

try:
    response = requests.post(
        "http://localhost:8000/api/v1/users/",
        json=user_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 201:
        print("✅ SUCESSO! Usuário criado no PostgreSQL!")
        print(f"Resposta: {response.json()}")
    else:
        print(f"❌ Erro: {response.text}")
        
except Exception as e:
    print(f"💥 Exception: {type(e).__name__}: {e}")