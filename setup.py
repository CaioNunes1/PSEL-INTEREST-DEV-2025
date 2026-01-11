# backend/setup.py
import os
import sys
from pathlib import Path

def setup_project():
    """Configuração automática do projeto"""
    
    print("=" * 60)
    print("CONFIGURANDO PROJETO FASTAPI")
    print("=" * 60)
    
    # 1. Criar/Atualizar .env
    env_content = """SQLALCHEMY_DATABASE_URI=sqlite:///./test.db
PROJECT_NAME=API Users & Teams
SECRET_KEY=dev-secret-key-change-in-production
"""
    
    with open(".env", "w") as f:
        f.write(env_content)
    print("✅ Arquivo .env criado/atualizado")
    
    # 2. Verificar estrutura de pastas
    folders = [
        "app",
        "app/core",
        "app/api",
        "app/api/routes"
    ]
    
    for folder in folders:
        Path(folder).mkdir(exist_ok=True)
    
    # 3. Criar __init__.py necessários
    init_files = [
        "app/__init__.py",
        "app/core/__init__.py",
        "app/api/__init__.py",
        "app/api/routes/__init__.py"
    ]
    
    for file in init_files:
        if not os.path.exists(file):
            Path(file).touch()
    
    print("✅ Estrutura de pastas verificada")
    
    # 4. Listar arquivos existentes
    print("\n📁 ESTRUTURA ATUAL DO PROJETO:")
    for root, dirs, files in os.walk("."):
        level = root.replace(".", "").count(os.sep)
        indent = " " * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = " " * 4 * (level + 1)
        for file in files:
            if file.endswith(".py"):
                print(f"{subindent}{file}")
    
    print("\n🎯 SETUP COMPLETO!")
    print("Execute: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")

if __name__ == "__main__":
    setup_project()