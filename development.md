# FastAPI Project - Development

> Nota do recrutador (para o estagiário): este documento descreve o fluxo de desenvolvimento local e os comandos essenciais. Leia atentamente antes de começar o desafio; qualquer dúvida sobre o escopo deve ser comunicada ao avaliador.

## Docker Compose

- Inicie a stack local com Docker Compose:

```bash
docker compose watch
```

*- Em seguida, abra o navegador e acesse as URLs abaixo:


Frontend (servido com Docker, roteado por path): http://localhost:5173

Backend (API JSON via OpenAPI): http://localhost:8000

Documentação interativa (Swagger UI): http://localhost:8000/docs

Adminer (administração do banco): http://localhost:8080


**Observação**: Na primeira vez que iniciar a stack pode demorar alguns instantes para ficar pronta — o backend aguarda o banco e executa configurações iniciais. Consulte os logs para acompanhar o progresso.

Para ver os logs, execute (em outro terminal):

```bash
docker compose logs
```

To check the logs of a specific service, add the name of the service, e.g.:

```bash
docker compose logs backend
```


## Desenvolvimento Local

Os arquivos do Docker Compose expõem cada serviço em portas diferentes no `localhost`.

Para backend e frontend, usamos as mesmas portas que os servidores locais de desenvolvimento (backend em `http://localhost:8000`, frontend em `http://localhost:5173`).

Dessa forma é possível parar um serviço no Docker e rodar sua versão local (com hot-reload) sem afetar o restante.

Por exemplo, para parar o serviço `frontend` no Docker Compose execute:

```bash
docker compose stop frontend
```


E então inicie o servidor de desenvolvimento local do frontend:

```bash
cd frontend
npm run dev
```


Ou pare o serviço `backend` do Docker Compose:

```bash
docker compose stop backend
```


E rode o servidor local do backend:

```bash
cd backend
fastapi dev app/main.py
```


## Arquivos do Docker Compose e variáveis de ambiente

O arquivo principal `docker-compose.yml` contém as configurações usadas por todo o stack.

Também há `docker-compose.override.yml` com ajustes para desenvolvimento (por exemplo montar o código como volume). Esse override é aplicado automaticamente pelo `docker compose`.

Os arquivos usam o `.env` para carregar variáveis que serão injetadas nos containers. Alguns scripts também definem variáveis antes de executar `docker compose`.

Após alterar variáveis, reinicie a stack com:

```bash
docker compose watch
```


## O arquivo `.env`

O arquivo `.env` contém as configurações, chaves geradas, senhas e etc.

Se o repositório for público, recomenda-se manter o `.env` fora do Git e fornecer as variáveis via CI/CD. Para isso, adicione cada env var no provedor de CI e ajuste `docker-compose.yml` para ler essas variáveis quando necessário.




#### Rodar hooks do `pre-commit` manualmente

Também é possível executar os hooks manualmente:

```bash
❯ uv run pre-commit run --all-files
check for added large files..............................................Passed
check toml...............................................................Passed
check yaml...............................................................Passed
ruff.....................................................................Passed
ruff-format..............................................................Passed
eslint...................................................................Passed
prettier.................................................................Passed
```


## URLs



Frontend: http://localhost:5173

Backend: http://localhost:8000

Documentação (Swagger UI): http://localhost:8000/docs

Documentação alternativa (ReDoc): http://localhost:8000/redoc

Adminer: http://localhost:8080


MailCatcher: http://localhost:1080