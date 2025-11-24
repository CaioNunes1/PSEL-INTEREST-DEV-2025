export interface Quest {
  id: 'frontend' | 'backend' | 'database' | 'tests'
  title: string
  emoji: string
  icon: string
  level: string
  xp: string
  difficulty: string
}

export interface QuestContent {
  title: string
  description: string
  objectives: string[]
  skills: string[]
  rewards: string[]
}

export const quests: Quest[] = [
  {
    id: 'database',
    title: 'Templo dos Dados',
    emoji: '📜',
    icon: '🗄️',
    level: 'Nível 1',
    xp: '+200 XP',
    difficulty: 'Médio'
  },
  {
    id: 'backend',
    title: 'Forja da API',
    emoji: '🛡️',
    icon: '⚡',
    level: 'Nível 2',
    xp: '+350 XP',
    difficulty: 'Difícil'
  },
  {
    id: 'frontend',
    title: 'Interface Mágica',
    emoji: '⚔️',
    icon: '🎨',
    level: 'Nível 3',
    xp: '+350 XP',
    difficulty: 'Médio'
  },
  {
    id: 'tests',
    title: 'Torre dos Testes',
    emoji: '🔮',
    icon: '🧪',
    level: 'Nível 4',
    xp: '+100 XP',
    difficulty: 'Épico'
  }
]

export const questContent: Record<string, QuestContent> = {
  frontend: {
    title: '🎨 Quest: Interface de Gestão',
    description: 'Crie páginas intuitivas para gerenciar usuários e equipes usando React e TypeScript',
    objectives: [
      '📄 Criar página de CRUD para usuários (listar, criar, editar, remover)',
      '📋 Criar página de listagem de equipes (mostrar nome e líder)',
      '👥 Criar página de detalhe da equipe (membros atuais e adicionar/remover usuários)',
      '🧭 Adicionar navegação no menu lateral para essas páginas',
      '⚠️ Lidar com regras de negócio na interface (ex: usuário já em equipe)'
    ],
    skills: [
      '🗺️ Estrutura: Componentes reutilizáveis, páginas organizadas',
      '🔧 Ferramentas: React, TypeScript, Vite',
      '🎭 Padrões: Componentização, feedback visual (loadings, erros)'
    ],
    rewards: [
      '✨ Badge: UI Master',
      '📜 Achievement: First CRUD Page',
      '🏆 +350 XP na sua jornada'
    ]
  },
  backend: {
    title: '⚙️ Quest: API de Equipes',
    description: 'Desenvolva endpoints robustos para gerenciar usuários e equipes com FastAPI',
    objectives: [
      '👤 Criar endpoints para CRUD de usuários',
      '🏢 Criar endpoints para CRUD de equipes',
      '➕ Criar endpoints para adicionar/remover membros de equipes',
      '🔒 Respeitar regras: usuário em apenas uma equipe, líder único',
      '📋 Usar padrão Repository e validação com Pydantic',
      '📄 Documentar API com OpenAPI/Swagger'
    ],
    skills: [
      '🗺️ Estrutura: /models, /crud, /api/routes',
      '🔧 Stack: FastAPI, Pydantic, PostgreSQL',
      '🎭 Padrões: RESTful, Dependency Injection'
    ],
    rewards: [
      '✨ Badge: API Builder',
      '📜 Achievement: First Endpoint',
      '🏆 +350 XP na sua jornada'
    ]
  },
  database: {
    title: '🗄️ Quest: Modelo de Dados',
    description: 'Projete tabelas e regras para equipes e usuários no PostgreSQL',
    objectives: [
      '📊 Criar tabelas para equipes e associação com usuários',
      '🔑 Garantir que equipe tenha líder obrigatório',
      '🚫 Impedir usuário em múltiplas equipes (constraint única)',
      '🚫 Impedir líder em múltiplas equipes (constraint única)',
      '🔄 Criar migrações reversíveis com Alembic'
    ],
    skills: [
      '🗺️ Tabelas: teams, users_teams',
      '🔧 Tools: Alembic, PostgreSQL',
      '🎭 Concepts: Foreign Keys, Unique Constraints'
    ],
    rewards: [
      '✨ Badge: Data Modeler',
      '📜 Achievement: Perfect Schema',
      '🏆 +200 XP na sua jornada'
    ]
  },
  tests: {
    title: '🧪 Quest: Validação de Código',
    description: 'Crie testes para garantir que tudo funciona corretamente',
    objectives: [
      '✅ Testar criação e edição de usuários/equipes',
      '❌ Testar erros (ex: usuário em duas equipes)',
      '🔄 Testar adição/remoção de membros',
      '🛠️ Usar fixtures para setup limpo',
      '🎯 Cobrir cenários de sucesso e falha'
    ],
    skills: [
      '🗺️ Estrutura: /tests, conftest.py',
      '🔧 Tools: Pytest, Playwright',
      '🎭 Patterns: Arrange-Act-Assert'
    ],
    rewards: [
      '✨ Badge: Test Expert',
      '📜 Achievement: Bug-Free Code',
      '🏆 +100 XP na sua jornada'
    ]
  }
}
