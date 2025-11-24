# Desafio Técnico Full-Stack: Módulo de Gestão de Equipes

## Visão Geral
Deverá ser demonstrada a habilidade de projetar e integrar uma nova funcionalidade em uma base de código existente. Você terá **1 semana** para completar o desafio.

**Nota importante:** O candidato parte do zero no que diz respeito ao novo módulo — **não existe schema, rota ou página de frontend pré-criada** para o módulo de Equipes. Espera-se que o participante projete a arquitetura (back-end e front-end), os modelos de dados e as rotas necessárias.

---

## 1. O Projeto Base
O stack tecnológico do projeto é:
- **Backend:** FastAPI com padrão de repositório e autenticação implementada.
- **Banco de Dados:** Postgres com migrações via Alembic.
- **Frontend:** React (Vite) com TypeScript.
- **Testes:** Estrutura de Pytest configurada para o backend.

---

## 2. O Desafio: "Módulo de Gestão de Equipes"
O objetivo é criar um sistema onde seja possível gerenciar **Equipes** e seus respectivos **Membros** (Usuários). Você deverá criar as tabelas, a API e as interfaces gráficas seguindo os padrões do projeto.

---

## 3. Requisitos Funcionais (O Quê)

### A. Modelagem de Dados (Postgres/Alembic)
A modelagem é parte crucial da avaliação.
- Projete os modelos para **Equipes** e a associação com **Usuários**.
- **Regras de Negócio (Constraints):**
    1.  Uma Equipe deve ter **obrigatoriamente um Líder** (que é um Usuário já existente).
    2.  **Unicidade de Membro:** Um Usuário só pode pertencer a **uma única equipe** por vez.
    3.  **Unicidade de Líder:** Um Usuário só pode liderar **uma única equipe** por vez.
- Garanta migrações que persistam o modelo no banco e assegurem integridade referencial (FKs e Constraints) para impedir estados inválidos (ex: usuário em duas equipes ao mesmo tempo).

### B. Backend (FastAPI)
- **API:**
    - Implemente endpoints para: Criar, Listar, Editar e Remover Usuários.
    - Implemente endpoints para: Criar, Listar, Editar e Remover Equipes.
    - Implemente endpoints para: Adicionar e Remover membros de uma equipe (respeitando a regra de que o usuário sai da equipe anterior se entrar em uma nova, ou o sistema bloqueia, conforme sua decisão de design).
- **Padrões:**
    - Utilize Padrão de Repositório e Schemas (Pydantic) legíveis.
    - Conecte o frontend aos serviços gerados (se houver script de `generate-client` ou similar, utilize-o para manter a tipagem forte entre Back e Front).

### C. Frontend (React)
O foco é uma UX coesa e funcional.
- **Navegação:** Adicione uma entrada no menu lateral para cada uma das páginas a seguir.
- **Página de Usuários:**
    - CRUD simples para cadastrar usuários no sistema (para que possam ser posteriormente alocados em equipes).
- **Página de Listagem de Equipes:**
    - Liste as equipes cadastradas exibindo cards ou tabela com: Nome da Equipe e Nome do Líder.
    - Botão para criar nova equipe.
- **Página de Detalhe da Equipe:**
    - Ao clicar em uma equipe, exiba os detalhes e a lista de membros atuais.
    - **Associação:** Permita adicionar um usuário a esta equipe.
        - *Atenção:* A interface deve lidar com a regra de negócio. Se o usuário já estiver em outra equipe, deixe claro o que está acontecendo (ex: aviso de transferência ou erro).

Ps: é recomendado o uso da ferramenta Lovable ou Figma AI para a criação da visualização base das telas (lembre-se que essas telas podem ser exportadas e integradas ao projeto).

### D. Testes (Pytest)
- **Backend (Obrigatório):**
    - Implemente testes de integração para as rotas principais (Criação de equipe, Movimentação de membros, CRUD de usuários).
    - Cubra cenários de sucesso e **cenários de erro** (ex: tentar violar a regra de um usuário em duas equipes).
    - Utilização de playwright para os testes.
- **Frontend (Opcional/Diferencial):**
    - Testes E2E ou unitários de componentes são bem-vindos, mas não eliminatórios.

---

## 4. Critérios de Avaliação

Estas perguntas guiam a correção do desafio e ajudam a garantir que todos os requisitos foram atendidos:

**1. Modelagem de Dados & Banco (Postgres)**
- **Integridade dos Relacionamentos:**
    - A modelagem reflete corretamente as entidades (Equipes e Usuários) e seus relacionamentos de participação e liderança?
- **Garantia das Regras de Negócio:**
    - **Participação na Equipe:** A regra de que "1 Usuário só pode pertencer a 1 Equipe" está garantida de forma que seja impossível violá-la no banco de dados, independentemente do código da aplicação? (A preferência é por garantia no banco).
    - **Liderança:** A regra de que "1 Usuário só pode ser líder de 1 Equipe" está garantida?
- **Requisito de Líder:**
    - O design garante que não é possível criar uma equipe sem um Líder associado?
- **Migrações:**
    - As migrações do Alembic foram geradas corretamente, são reversíveis (contêm o passo de downgrade) e não causam perda de dados?
- **Performance:**
    - O design de dados permite consultas rápidas (listagem de todos os membros de uma equipe, busca por líder) sem a necessidade de varrer tabelas inteiras (como vai ser feita a paginação desses dados)?

**2. Backend (FastAPI & Arquitetura)**
- **API:**
    - Os endpoints seguem boas práticas REST (verbos corretos, status codes 201/200/404/400/422)?
    - A API trata erros de forma graciosa? (Ex: tentar adicionar membro que já tem equipe retorna um erro claro 400/409 e não um 500 genérico).
- **Código:**
    - O padrão de Repositório foi respeitado? A lógica de banco está isolada das rotas?
    - Os Schemas (Pydantic) validam corretamente as entradas e saídas?
    - O código está limpo, organizado e tipado (Type Hints)?

**3. Frontend (React & UX)**
- **Funcionalidade:**
    - É possível realizar todo o fluxo (Criar Usuário -> Adicionar Usuários -> Remover Usuários) sem erros?
    - É possível realizar todo o fluxo (Criar Equipe -> Adicionar Membros -> Remover Membros) sem erros?
    - A listagem de equipes mostra corretamente o líder (a exibição é intuitiva)?
- **UX/UI:**
    - O sistema fornece feedback visual para ações do usuário (Loadings durante requisições, Toasts de sucesso/erro)?
    - A interface lida bem com casos de borda (ex: lista vazia, erros de validação)?
    - A navegação entre as páginas é fluida e intuitiva?
- **Código:**
    - A integração com o backend utiliza os tipos gerados/definidos corretamente?
    - O código do frontend está organizado em componentes reutilizáveis?

**4. Testes (Backend)**
- Os testes de integração cobrem os fluxos principais (Criação, Edição, Remoção)?
- Existem testes para os **cenários de erro** e violação de regras de negócio (ex: tentar inserir usuário em duas equipes)?
- Os testes utilizam fixtures adequadas e limpam o banco após a execução?
- *Nota:* A qualidade e cobertura dos testes no backend são fatores decisivos na avaliação.

**5. Processo & Documentação (IA_LOG)**
- O arquivo `IA_LOG.md` existe e descreve as interações com clareza?
- **Pensamento Crítico:** O candidato identificou e corrigiu sugestões ruins da IA? (Este é um ponto eliminatório/classificatório importante).
- O README contém instruções claras se houver passos extras para rodar o projeto?

---

## 5. Entregáveis

1.  Uma **branch** com `seu-nome-sobrenome`.
2.  Código fonte completo com a implementação.
3.  Arquivo **`IA_LOG.md`** na raiz do projeto contendo:
    - Breve descrição dos prompts utilizados.
    - **Item Obrigatório:** Cite pelo menos um exemplo onde a IA sugeriu código incorreto, inseguro ou que violava uma regra de negócio, e descreva como você identificou e corrigiu o problema. Queremos avaliar seu senso crítico.

## Development & License
Consulte `development.md` para instruções de setup local.
License: MIT.