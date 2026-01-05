# FastAPI Project - Development

> Nota do recrutador (para o estagiário): este documento descreve o fluxo de desenvolvimento local e os comandos essenciais. Leia atentamente antes de começar o desafio; qualquer dúvida sobre o escopo deve ser comunicada ao avaliador.

## Iniciar o Ambiente de Desenvolvimento

Inicie a stack local com o Makefile:

```bash
make dev-up
```

Em seguida, abra o navegador e acesse as URLs abaixo:

- **Frontend** (servido com Docker, hot-reload): http://localhost:5173

- **Documentação interativa** (Swagger UI): http://localhost:8000/docs

- **Adminer** (administração do banco): http://localhost:8080

**Observação**: Na primeira vez que iniciar a stack pode demorar alguns instantes para ficar pronta — o backend aguarda o banco e executa configurações iniciais. Consulte os logs para acompanhar o progresso.

Para ver os logs, execute (em outro terminal):

```bash
make dev-logs
```

Para ver os logs de um serviço específico:

```bash
make backend-logs  # Logs do backend
make frontend-logs # Logs do frontend
```


## Comandos Úteis do Makefile

O projeto usa um Makefile para simplificar os comandos. Para ver todos os comandos disponíveis:

```bash
make help
```

### Comandos principais:

| Comando | Descrição |
|---------|-----------|
| `make dev-up` | Inicia o ambiente de desenvolvimento |
| `make dev-down` | Para o ambiente de desenvolvimento |
| `make dev-restart` | Reinicia o ambiente de desenvolvimento |
| `make dev-logs` | Mostra os logs de todos os serviços |
| `make dev-ps` | Lista os containers em execução |
| `make dev-build` | Reconstrói as imagens Docker |

### Comandos específicos do Backend:

| Comando | Descrição |
|---------|-----------|
| `make backend-shell` | Abre shell no container do backend |
| `make backend-logs` | Mostra logs do backend |

### Comandos específicos do Frontend:

| Comando | Descrição |
|---------|-----------|
| `make frontend-shell` | Abre shell no container do frontend |
| `make frontend-logs` | Mostra logs do frontend |

### Comandos do Banco de Dados:

| Comando | Descrição |
|---------|-----------|
| `make db-shell` | Abre shell PostgreSQL |
| `make db-backup` | Cria backup do banco |
| `make db-restore FILE=arquivo.dump` | Restaura backup |

## Desenvolvimento Local Híbrido

Os serviços expõem portas no `localhost`, permitindo rodar parte da stack no Docker e parte localmente.

Por exemplo, para desenvolver o frontend localmente (fora do Docker):

1. Pare o serviço frontend:
```bash
make dev-down
```

2. Inicie apenas os serviços necessários (banco, backend):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db backend adminer
```

3. Execute o frontend localmente:
```bash
cd frontend
npm install
npm run dev
```

O mesmo pode ser feito com o backend, mantendo frontend e banco no Docker.


## Arquivos do Docker Compose e Variáveis de Ambiente

O projeto usa múltiplos arquivos Docker Compose organizados por ambiente:

- **`docker-compose.yml`** - Configuração base compartilhada
- **`docker-compose.dev.yml`** - Overrides para desenvolvimento (volumes, hot-reload, portas expostas)

O Makefile combina automaticamente os arquivos corretos para cada ambiente.

### O arquivo `.env`

O arquivo `.env` contém as configurações, chaves geradas, senhas, etc.

**Importante**: Se o repositório for público, mantenha o `.env` fora do Git e forneça as variáveis via CI/CD. Para isso, adicione cada variável no provedor de CI e ajuste os arquivos Docker Compose quando necessário.

Após alterar variáveis de ambiente, reinicie a stack:

```bash
make dev-restart
```

## Verificar Configuração

Para visualizar a configuração final do Docker Compose (com todos os overrides aplicados):

```bash
make config      # Configuração de desenvolvimento
```

## Limpeza e Manutenção

### Limpar containers e volumes:
```bash
make clean
```

### Remover recursos Docker não utilizados:
```bash
make prune
```

### Reconstruir imagens:
```bash
make dev-build
```


## URLs de Desenvolvimento

Após executar `make dev-up`, os seguintes serviços estarão disponíveis:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface React com Vite (hot-reload) |
| **Backend** | http://localhost:8000 | API FastAPI |
| **Swagger UI** | http://localhost:8000/docs | Documentação interativa da API |
| **ReDoc** | http://localhost:8000/redoc | Documentação alternativa da API |
| **Adminer** | http://localhost:8080 | Interface web para PostgreSQL |
| **PostgreSQL** | localhost:5432 | Banco de dados (acesso direto) |

## Fluxo de Trabalho Recomendado

1. **Iniciar ambiente**: `make dev-up`
2. **Verificar status**: `make dev-ps`
3. **Acompanhar logs**: `make dev-logs` (Ctrl+C para sair)
4. **Desenvolver**: Edite os arquivos (hot-reload ativo)
5. **Ao terminar**: `make dev-down`

## Troubleshooting

### Containers não iniciam
```bash
make dev-down
make clean
make dev-up
```

### Rebuild completo
```bash
make dev-down
make dev-build
make dev-up
```

### Ver status dos containers
```bash
make dev-ps
```

### Acessar logs específicos
```bash
make backend-logs   # Backend
make frontend-logs  # Frontend
```

### Resetar banco de dados
```bash
make dev-db-backup  # Backup antes de resetar
make clean          # Remove volumes
make dev-up         # Recria tudo
```