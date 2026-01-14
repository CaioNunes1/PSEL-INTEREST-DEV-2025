# Backend — Gerenciamento de Usuários e Equipes

**Sistema backend** com REST API para gerenciamento de usuários e equipes, desenvolvido com FastAPI, testes automatizados e containerização com Docker.

---

## 🚀 Tecnologias

* **Backend:** FastAPI, SQLModel
* **Banco de dados:** PostgreSQL (+ Alembic para migrações)
* **Testes:** Pytest (33 testes — 100% passando)
* **Containerização:** Docker, Docker Compose
* **Frontend (opcional):** React + Vite

---

## 📌 Funcionalidades

* CRUD de usuários
* CRUD de equipes
* Associação de usuários a equipes
* Validações de negócio (ex.: 1 usuário por equipe, líder único)
* Testes automatizados completos com padrão **Arrange‑Act‑Assert**
* Fixtures para setup limpo nos testes
---

## Índice

1. [Instalação e execução](#instala%C3%A7%C3%A3o-e-execu%C3%A7%C3%A3o)
2. [Executando testes](#executando-testes)
3. [Endpoints principais](#endpoints-principais)
4. [Exemplos com cURL](#exemplos-com-curl)
5. [Configuração Docker](#configura%C3%A7%C3%A3o-docker)
6. [Estrutura do projeto](#estrutura-do-projeto)
7. [Solução de problemas](#solu%C3%A7%C3%A3o-de-problemas)
8. [Regras de negócio](#regras-de-neg%C3%B3cio)
9. [Suporte](#suporte)

---

## :wrench: Instalação e execução

### Método 1 — Usando Docker (recomendado)

**Desenvolvimento (com hot reload)**

```bash
# Na raiz do projeto (onde está docker-compose.dev.yml)
docker-compose -f docker-compose.dev.yml up --build
```

> ⚠️ A API backend estará disponível em `http://localhost:8001` quando executada via Docker.

**Produção / Staging**

```bash
docker-compose up --build
```

### Método 2 — Execução local (sem Docker)

**Pré-requisitos**

* Python 3.10+
* PostgreSQL (padrão: porta do host 5433 — ajuste se necessário)

**Passos**

```bash
git clone <seu-repositorio>
cd backend

# Crie e ative o venv
python -m venv venv
# Windows
venv\Scripts\activate
# Linux / Mac
source venv/bin/activate

# Instale dependências
pip install -r requirements.txt
```

* Configure o PostgreSQL (crie o banco `app` e ajuste credenciais em `app/core/config.py`).
* Execute as migrações:

```bash
alembic upgrade head
```

* Inicie o servidor (usar porta **8001** para compatibilidade com o frontend Docker):

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

A API estará disponível em `http://localhost:8001`.

### Método 3 — Docker (build do backend isolado)

```bash
# Dentro da pasta backend/
docker build -t backend-app .

docker run -p 8001:8000 -e POSTGRES_SERVER=localhost backend-app
```

---

## :test_tube: Executando testes

**Com Docker (recomendado):**

```bash
docker-compose -f docker-compose.dev.yml exec backend pytest tests/ -v
```

**Localmente (venv ativado):**

```bash
cd backend
pytest tests/ -v
# Com cobertura
pytest --cov=app --cov-report=html --cov-report=term-missing
```

**Resultado esperado:**

```
33 tests passed in 0.71s
100% coverage de funcionalidades principais
```

---

## :computer: Frontend

O frontend (React + Vite) está configurado para rodar na porta **5174**.

* URL padrão: `http://localhost:5174`
* A API backend deve estar acessível em `http://localhost:8001`

> 💡 Caso utilize variáveis de ambiente no frontend, configure a base URL da API corretamente.

---

## :satellite: Endpoints principais

**Documentação interativa**

* Swagger UI: `http://localhost:8001/docs`
* ReDoc: `http://localhost:8001/redoc`

### Usuários

* `GET  /api/v1/users/` — Lista usuários (com informação de equipe)
* `POST /api/v1/users/` — Cria usuário
* `GET  /api/v1/users/{id}` — Busca usuário
* `PUT  /api/v1/users/{id}` — Atualiza usuário
* `DELETE /api/v1/users/{id}` — Remove usuário (não permite remover líder)

### Equipes

* `GET  /api/v1/teams/` — Lista equipes (com membros)
* `POST /api/v1/teams/` — Cria equipe (o líder é adicionado como membro)
* `GET  /api/v1/teams/{id}` — Busca equipe com membros
* `PUT  /api/v1/teams/{id}` — Atualiza equipe
* `DELETE /api/v1/teams/{id}` — Remove equipe (cascade delete)
* `POST   /api/v1/teams/{id}/members` — Adiciona membro
* `DELETE /api/v1/teams/{id}/members/{user_id}` — Remove membro

---

## :page_facing_up: Exemplos de uso (cURL)

**Criar usuário**

```bash
curl -X POST "http://localhost:8001/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "full_name": "João Silva", "is_active": true}'
```

**Criar equipe (usuário 1 como líder)**

```bash
curl -X POST "http://localhost:8001/api/v1/teams/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Dev Team", "description": "Equipe de desenvolvimento", "leader_id": 1}'
```

**Adicionar membro à equipe**

```bash
curl -X POST "http://localhost:8001/api/v1/teams/1/members" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2, "team_id": 1}'
```

**Listar equipes com membros**

```bash
curl "http://localhost:8001/api/v1/teams/"
```

---

## :whale: Configuração Docker

**Portas mapeadas (host:container)**

* Backend: `8001:8000`
* PostgreSQL: `5433:5432`
* Adminer: `8080:8080`
* Frontend (se aplicável): `5174:5174`

**Arquivos principais**

* `docker-compose.yml` — Configuração principal (produção/staging)
* `docker-compose.dev.yml` — Config para desenvolvimento (hot reload)

**Variáveis de ambiente (.env)**

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changethis
POSTGRES_DB=app
POSTGRES_SERVER=db
POSTGRES_PORT=5432
```

---

## :file_folder: Estrutura do projeto

```
backend/
├── app/
│   ├── models.py          # Modelos SQLModel (User, Team, UserTeam)
│   ├── crud.py            # Lógica de negócio com validações
│   ├── api/
│   │   ├── routes/        # Endpoints FastAPI
│   │   └── deps.py        # Dependências (sessão DB)
│   ├── core/              # Configurações
│   ├── alembic/           # Migrações de banco
│   └── main.py            # Aplicação principal
├── tests/                 # 🧪 Suíte completa de testes
│   ├── conftest.py        # Fixtures e configuração
│   ├── test_users.py      # Testes de usuários
│   ├── test_teams.py      # Testes de equipes
│   └── test_crud.py       # Testes de CRUD
└── requirements.txt       # Dependências Python
```

---

## :bug: Solução de problemas

**Port already in use**

```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/Mac
sudo lsof -i :8001
kill -9 <PID>
```

**Erro de conexão com o banco**

* Verifique se o PostgreSQL está rodando
* Confira credenciais em `app/core/config.py`
* Em Docker: verifique se o container `db` está `up`

**Erros nos testes**

```bash
pytest tests/ -xvs
pytest --cache-clear
```

---

## :dart: Regras de negócio implementadas

* Um usuário só pode estar em uma equipe por vez (transferência automática)
* Email único por usuário
* Nome único por equipe
* Um líder só pode liderar uma equipe
* Não é possível excluir usuário que é líder de equipe
* Não é possível remover o líder da própria equipe

---

## :telephone_receiver: Suporte

* API: consulte `/docs` ou `/redoc`
* Banco: Adminer em `http://localhost:8080`
* Testes: `pytest tests/ -v`

---

> Se quiser, eu posso: 1) gerar uma versão em inglês; 2) adicionar badges (build, coverage); 3) transformar em `README.md` com seções de contribuição e deploy — diga qual opção prefere.
