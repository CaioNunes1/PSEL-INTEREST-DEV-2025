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

### 2. Criando Novos Modelos (Tabelas)
1. Abra `app/models.py`.
2. Crie uma classe herdando de `SQLModel` com `table=True`.
3. Defina os campos e relacionamentos.
4. **Importante**: Após criar ou modificar um modelo, você deve gerar uma migração.

### 3. Gerenciando o Banco de Dados (Migrações)
O Alembic gerencia as mudanças no esquema do banco.

**Gerar uma nova migração (após editar models.py):**
```bash
# Execute na raiz do projeto (com o docker rodando)
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic revision --autogenerate -m "Descrição da mudança"
```

**Aplicar as migrações (atualizar o banco):**
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend alembic upgrade head
```

### 4. Criando Novas Rotas
1. Crie um novo arquivo em `app/api/routes/` (ex: `teams.py`).
2. Defina o `APIRouter` e seus endpoints.
3. Vá em `app/api/main.py` e registre o novo router:
   ```python
   from app.api.routes import teams
   api_router.include_router(teams.router, prefix="/teams", tags=["teams"])
   ```

## 📝 Comandos Úteis (Makefile)

Para facilitar, use os comandos do Makefile na raiz do projeto:

| Ação | Comando | Descrição |
|------|---------|-----------|
| **Shell no Backend** | `make backend-shell` | Abre um terminal dentro do container do backend. |
| **Logs** | `make backend-logs` | Vê os logs da aplicação em tempo real. |
| **Testes** | `make backend-test` | Roda os testes automatizados (Pytest). |
| **Formatar** | `make backend-format` | Formata o código com Ruff e Black. |
| **Lint** | `make backend-lint` | Verifica erros de estilo e tipagem. |

---
*Dica: Mantenha o código sempre tipado (Type Hints) para aproveitar o máximo do FastAPI e Pydantic.*
