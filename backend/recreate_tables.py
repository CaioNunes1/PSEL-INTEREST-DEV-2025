# backend/recreate_tables.py
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.db import engine
from sqlmodel import SQLModel
from app.models import User, Team, UserTeam

print("="*60)
print("RECRIANDO TABELAS NO BANCO DE DADOS")
print("="*60)

# Lista todas as tabelas atuais
print("Tabelas existentes:")
try:
    with engine.connect() as conn:
        result = conn.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = result.fetchall()
        for table in tables:
            print(f"  - {table[0]}")
except Exception as e:
    print(f"Erro ao listar tabelas: {e}")

# Dropa todas as tabelas
print("\nRemovendo tabelas existentes...")
try:
    SQLModel.metadata.drop_all(engine)
    print("✅ Tabelas removidas")
except Exception as e:
    print(f"⚠️  Erro ao remover tabelas: {e}")

# Cria todas as tabelas novamente
print("\nCriando tabelas novamente...")
try:
    SQLModel.metadata.create_all(engine)
    print("✅ Tabelas criadas com sucesso!")
    
    # Verifica as colunas da tabela users
    with engine.connect() as conn:
        result = conn.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """)
        print("\nColunas da tabela 'users':")
        for col in result.fetchall():
            print(f"  - {col[0]} ({col[1]})")
            
except Exception as e:
    print(f"❌ Erro ao criar tabelas: {e}")

print("\n" + "="*60)
print("PROCESSO CONCLUÍDO!")