# Backend - Seletiva Interest Dev 2025

Backend construído com **FastAPI**, focado em performance e facilidade de desenvolvimento. Utiliza **SQLModel** para interação com o banco de dados e **Alembic** para migrações.

## 🚀 Tecnologias

- **[FastAPI](https://fastapi.tiangolo.com/)**: Framework web moderno e rápido.
- **[SQLModel](https://sqlmodel.tiangolo.com/)**: ORM que combina SQLAlchemy e Pydantic.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional.
- **[Alembic](https://alembic.sqlalchemy.org/)**: Gerenciamento de migrações de banco de dados.
- **[Pydantic](https://docs.pydantic.dev/)**: Validação de dados.

## 📂 Estrutura do Projeto

A estrutura foi pensada para ser modular e escalável:

- **`app/main.py`**: Ponto de entrada da aplicação. Configura o FastAPI e middlewares.
- **`app/models.py`**: Definição das tabelas do banco e modelos de dados (ex: `User`, `Team`). **Toda alteração de banco começa aqui.**
- **`app/api/`**: Rotas da API.
    - **`main.py`**: Roteador principal que agrupa todas as rotas.
    - **`routes/`**: Onde você cria os endpoints (ex: `users.py`, `teams.py`).
- **`app/core/`**: Configurações centrais.
    - **`config.py`**: Variáveis de ambiente e configurações gerais (Settings).
    - **`db.py`**: Configuração da conexão com o banco de dados.
- **`app/alembic/`**: Scripts e configurações de migração de banco de dados.

## 🛠️ Guia de Desenvolvimento

### 1. Rodando o Projeto
A maneira recomendada é utilizar o Docker através do Makefile na raiz do projeto:

```bash
# Na raiz do projeto
make dev-up
```
- **API**: `http://localhost:8000`
- **Docs (Swagger)**: `http://localhost:8000/docs`
- **Redoc**: `http://localhost:8000/redoc`

### 2. Gerenciando o Banco de Dados (Migrações)
O Alembic gerencia as mudanças no esquema do banco.

**Gerar uma nova migração (após editar models.py):**
```bash
# Execute na raiz do projeto (com o docker rodando)
# Usando o Makefile (recomendado):
make db-new-migration MESSAGE="Descrição da mudança"

# Alternativa direta (docker compose):
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic revision --autogenerate -m "Descrição da mudança"
```

**Aplicar as migrações (atualizar o banco):**
```bash
# Usando o Makefile (recomendado):
# Aplicar até a versão mais recente
make db-upgrade

# Aplicar até uma revisão específica
make db-upgrade REVISION=<rev>

# Aplicar um passo relativo (ex.: subir 1 revisão)
make db-upgrade STEP=1

# Alternativa direta (docker compose):
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic upgrade head
```

**Reverter migrações:**
```bash
# Reverter até uma revisão específica
make db-downgrade REVISION=<rev>

# Reverter por passos (ex.: descer 1 revisão)
make db-downgrade STEP=1

# Alternativa direta (docker compose):
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic downgrade -1
```

## 📝 Comandos Úteis (Makefile)

Para facilitar, use os comandos do Makefile na raiz do projeto:

| Ação | Comando | Descrição |
|------|---------|-----------|
| **Shell no Backend** | `make backend-shell` | Abre um terminal dentro do container do backend. |
| **Logs** | `make backend-logs` | Vê os logs da aplicação em tempo real. |

---
*Dica: Mantenha o código sempre tipado (Type Hints) para aproveitar o máximo do FastAPI e Pydantic.*
