
## Desafio Técnico Full-Stack: Módulo de Gestão de Equipes

Deverá ser demonstrada a habilidade de projetar e integrar uma nova funcionalidade em uma base existente. Serão 72 horas para completar o desafio.

Nota importante: o candidato parte do zero no que diz respeito ao novo módulo — **não existe schema, rota ou página de frontend pré-criada** para o módulo de Equipes. Espera-se que o participante projete a arquitetura (back-end e front-end), os modelos de dados e as rotas necessárias, além da interface de usuário e dos testes, conforme os requisitos acima.

1. O Projeto Base

- Backend: FastAPI com padrão de repositório e autenticação.
- Banco de Dados: Postgres com migrações via Alembic.
- Frontend: React (Vite) com TypeScript e `shadcn/ui`.
- Testes: Estrutura de Pytest para o backend.


2. O Desafio: "Módulo de Gestão de Equipes"

O candidato deverá criar Equipes, associar Usuários e construir as rotas e páginas necessárias seguindo os padrões do projeto.

3. Requisitos Funcionais (O Quê)

    A. Backend (FastAPI, Postgres & Alembic)

    - Modelagem de Dados (Postgres/Alembic):
        - Projete os modelos necessários para representar equipes e a associação entre equipes e usuários.
        - Garanta migrações que persistam o modelo no banco e assegurem integridade referencial quando aplicável.
        - Ps: lembre que cada equipe deve ter um líder associado e cada líder compões uma área diferente na empresa.

    - API (FastAPI):
        - Escolha um padrão de Repositório e Schemas (Pydantic) legível e aplique.
        - Implemente a API necessária para suportar gestão de equipes e gestão de membros.
        - O foco é permitir operações comuns de criação, listagem e remoção de equipes e usuários, assim como operações para associar e desassociar usuários a equipes.

    B. Frontend (React & shadcn/ui)

    - Página de Usuários: Crie uma página que permita listar, inserir, editar e remover usuários.

    - Página de equipes: crie uma página que liste cada equipe e líder associado, como uma lista de opções clicáveis, para quando a opção for selecionada, todos os usuários da equipe devem aparecer listados de forma paginada na tela, com suporte à ordenação.

    - Navegação: adicione uma entrada na navegação de administração que leve a uma área dedicada à gestão de equipes.

    - Páginas de gestão:
        - Crie uma interface para listar as equipes e ativar a criação de novas equipes.
        - Crie uma visualização de detalhe de equipe que permita ver os membros associados e possibilitar a adição e remoção de membros.
        - Ofereça uma UX clara para gerenciar equipes e membros.

    C. Testes (Pytest)

    - Obrigatório: inclua testes automatizados no backend para as funcionalidades criadas.
    - Foco: cubra cenários de sucesso e de borda, com atenção especial às regras e integridade da associação entre usuários e equipes; a abordagem e a estratégia de testes ficam por conta do candidato.

4. Critérios de Avaliação (resumo)



    Estas perguntas ajudam o avaliador a aprofundar a análise de cada item.

- Funcionalidade / Comportamento
    - O fluxo principal (criar, listar, associar, remover) está totalmente implementado e testado? Quais dependências externas existem? Como foram tratadas?
    - O comportamento está definido para entradas inválidas (ex.: associação de um usuário inexistente, duplicidade)? São retornados erros claros e testáveis?
    - Como a aplicação se comporta em condições de concorrência (adição/remoção simultânea de membros)? Usou transações ou checks para evitar inconsistências?
    - A remoção de uma equipe remove associações corretamente? Há efeitos colaterais (cascade, soft delete)? O candidato documentou a escolha?

- Modelagem & Banco de Dados
    - A modelagem reflete as necessidades do domínio (one-to-many vs many-to-many)? O relacionamento entre usuários e equipes é explícito e bem nomeado?
    - Existem índices adequados para consultas frequentes (listagem por equipe, busca por nome, paginação)? Quais trade-offs o candidato considerou?
    - As constraints e chaves estrangeiras estão corretas (nullable, on delete/update)? Existem índices/unique constraints para evitar duplicidade?
    - As migrations são idempotentes e revertíveis; elas preservam dados? Foi considerado um plano de migração seguro para produção?

- API & Contratos
    - Os nomes de rotas e verbos (mesmo que o candidato defina) seguem padrões RESTful ou coerência do projeto? A API usa status codes adequados?
    - Existe paginação, ordenação e filtros para listagens grandes? Como a API lida com page size e limites?
    - O contrato está documentado via OpenAPI/Swagger? Os esquemas (Pydantic) têm descrições e exemplos?
    - Os erros têm formato uniforme (código, mensagem, detalhes)? Há logs que facilitem debugging em produção?

- Segurança e Autorização
    - Apenas usuários autorizados conseguem criar/editar/remover equipes e membros? Como foi implementada a autorização por função (roles ou policies)?
    - Inputs são validados e sanitizados; exposição de dados sensíveis foi evitada? (ex.: não retornar tokens/segredos)
    
- Testes
    - Cobertura: quais partes do fluxo estão cobertas por unit/integration tests? Há testes que realmente falham quando uma regra é quebrada?
    - Testes de borda: duplicação de associações, exclusão em cascata, e scenarios de falha na criação.
    - Testes de infraestrutura: migrações aplicam e regridem sem quebrar testes; fixtures limpas e fáceis de usar.
    - E2E (opcional/incentivado): flows principais testados no frontend (criar equipe, adicionar membro, remover membro).

- Frontend & UX
    - Fluxo claro para criar e gerenciar equipes (confirmações de operação, feedbacks visíveis, validações inline).
    - Padrões de acessibilidade: labels, ARIA attributes, keyboard navigation e foco após ações.
    - Erros e loading states bem tratados: spinners, mensagens de erro e retry quando aplicável.
    - Componentização e reuso: componentes pequenos, testáveis e stateless quando possível.

- Performance & Eficiência
    - Evitou-se N+1 nas consultas? Foram usadas joins otimizados quando necessário?
    - Existe paginação e limites de requisição para listagens; as queries são previsíveis e indexadas?
    
- Código & Manutenibilidade
    - Arquitetura coerente e explicada; nomes claros, responsabilidade única.
    - Tipagem: Pydantic/TypeScript bem usados e código formatado.

- Documentação & Entregáveis
    - README: passos claros para rodar localmente, executar migrations e rodar testes.
    - IA_LOG: registro com 3–5 interações e decisões tomadas (ex.: aceitou/alterou sugestão da IA?).
    - PR: descrição clara, screenshots (UI) e instruções de validação manual.

- Uso de IA (avaliação adicional)
    - O `IA_LOG.md` apresenta prompts, resultados e justificativas; o candidato demonstrou pensamento crítico sobre saídas geradas por IA?
    - A IA foi usada para inspiração ou geração de código que foi validado por testes manuais e automáticos?


5. Entregáveis

- Uma branch com primeiro e último nome do participante.
- Um arquivo `IA_LOG.md` descrevendo 3-5 interações com IA e a ação consciente tomada.

Boa sorte ao candidato! 

## Frontend Development

Frontend docs: [frontend/README.md](./frontend/README.md).

## Development

General development docs: [development.md](./development.md).



## License

The project is licensed under the terms of the MIT license.
