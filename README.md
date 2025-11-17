
## Desafio Técnico Full-Stack: Módulo de Gestão de Equipes

O candidato (estagiário) deverá demonstrar habilidade de integrar uma nova funcionalidade em uma base existente. Ele terá 72 horas para completar o desafio.

1. O Projeto Base

- Backend: FastAPI com padrão de repositório e autenticação.
- Banco de Dados: Postgres com migrações via Alembic.
- Frontend: React (Vite) com TypeScript e `shadcn/ui`.
- Testes: Estrutura de Pytest para o backend.
- Tooling: `biome.json` e `padrao_commits.md`.

O módulo de `Usuarios` já está implementado e deve servir como referência.

2. O Desafio: "Módulo de Gestão de Equipes"

O candidato deverá criar Equipes, associar Usuários e construir as rotas e páginas necessárias seguindo os padrões do projeto.

3. Requisitos Funcionais (O Quê)

A. Backend (FastAPI, Postgres & Alembic)

- Modelagem de Dados (Postgres/Alembic):
    - Tabela `equipes`: Crie uma nova tabela em `models.py` com, no mínimo, `id` e `nome`.
    - Relação Many-to-Many: Modele a relação N:N entre `usuarios` e `equipes` usando uma tabela de associação (por exemplo `associacao_usuario_equipe`) que contenha `usuario_id` e `equipe_id` como chaves estrangeiras.
    - Migração: Gere e submeta a migração do Alembic (`alembic revision ...`) que cria as novas tabelas e relações.

- API (FastAPI):
    - Utilize o padrão de Repositório e os Schemas (Pydantic) já existentes no módulo `usuarios`.
    - CRUD de Equipes:
        - `POST /equipes`: Cria uma nova equipe.
        - `GET /equipes`: Lista todas as equipes.
        - `DELETE /equipes/{equipe_id}`: Remove uma equipe.

    - Gestão de Membros (Lógica de Associação):
        - `GET /equipes/{equipe_id}/membros`: Lista membros de uma equipe.
        - `POST /equipes/{equipe_id}/membros`: Adiciona um usuário (enviando `usuario_id` no body) a uma equipe.
        - `DELETE /equipes/{equipe_id}/membros/{usuario_id}`: Remove um usuário de uma equipe.

B. Frontend (React & shadcn/ui)

- Navegação: Adicione um item na navegação de Admin que leve à página de gestão de equipes (por exemplo `TabsNav.tsx`).

- Página `/admin/equipes`:
    - Use uma `<Table>` (de `shadcn/ui`) para listar equipes (`GET /equipes`).
    - Adicione um botão "Nova Equipe" que abra um `<Dialog>`/`<Modal>` para criar uma equipe (`POST /equipes`).

- Página de Detalhe `/admin/equipes/{equipe_id}`:
    - Mostrar o nome da equipe.
    - Mostrar uma tabela de membros (`GET /equipes/{equipe_id}/membros`) com botão "Remover" por linha (`DELETE`).
    - Fornecer um formulário para adicionar novo membro (sugestão: `Combobox` do `shadcn/ui` ou um `SingleSelectSearch` que consuma `GET /usuarios`).

C. Testes (Pytest)

- Obrigatório: adicione testes no backend.
- Foco: teste a lógica de associação. Exemplos que queremos ver:
    - A listagem de membros de uma equipe.
    - A falha ao tentar adicionar um usuário inexistente.
    - A falha ou a idempotência ao tentar adicionar o mesmo usuário duas vezes.

4. Critérios de Avaliação (resumo)

- Funcionalidade ponta a ponta.
- Modelagem de dados e migrações corretas.
- Aderência ao padrão de repositório e schemas.
- Reuso de componentes `shadcn/ui`.
- Qualidade e abrangência dos testes.
- Código limpo e commits seguindo `padrao_commits.md`.
- Uso consciente de IA (diferencial).

5. Entregáveis

- Um PR para `main` com as alterações.
- Um arquivo `IA_LOG.md` descrevendo 3-5 interações com IA e a ação consciente tomada.

Boa sorte ao candidato! (mensagem registrada pelo recrutador)

## Frontend Development

Frontend docs: [frontend/README.md](./frontend/README.md).

## Deployment

Deployment docs: [deployment.md](./deployment.md).

## Development

General development docs: [development.md](./development.md).

Isso inclui o uso de Docker Compose, domínios locais configurados (localhost.tiangolo.com), variáveis em `.env` e outros pontos do fluxo de desenvolvimento.

## Release Notes

Check the file [release-notes.md](./release-notes.md).

## License

The Full Stack FastAPI Template is licensed under the terms of the MIT license.
