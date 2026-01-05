# Frontend - Seletiva Interest Dev 2025

Este é o frontend do projeto, construído com **Vite**, **React** e **TypeScript**. O projeto utiliza **React Router** para navegação e **Context API** para gerenciamento de estado global.

## 🚀 Tecnologias Utilizadas

- **[Vite](https://vitejs.dev/)**: Build tool e servidor de desenvolvimento rápido.
- **[React](https://reactjs.org/)**: Biblioteca para construção de interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset tipado de JavaScript.
- **[React Router DOM](https://reactrouter.com/)**: Gerenciamento de rotas.
- **Axios**: Cliente HTTP (configurado para comunicação com o backend).
- **CSS**: Estilização customizada com variáveis CSS e animações.

## 🛠️ Configuração e Execução

Certifique-se de ter o **Node.js** instalado.

1. **Acesse o diretório do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   O projeto estará rodando em `http://localhost:5173`.

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para facilitar a escalabilidade e manutenção:

- **`src/components`**: Componentes de UI reutilizáveis (ex: `QuestCard`, `Header`, `InfoPanel`).
- **`src/data`**: Arquivos de dados estáticos ou configurações (ex: `questsData.ts`).
- **`src/hooks`**: Hooks customizados e Context API (ex: `useQuestContext` para gerenciar o progresso das quests).
- **`src/layouts`**: Estruturas de layout que envolvem as páginas (ex: `MainLayout`).
- **`src/pages`**: Componentes que representam páginas completas (ex: `LandingPage`, `QuestPage`).

## 🧩 Funcionalidades Principais

- **Navegação**: Roteamento entre a listagem de quests e os detalhes de cada desafio.
- **Gerenciamento de Estado**: Persistência do progresso do usuário utilizando Context API e LocalStorage.
- **Design Responsivo**: Interface adaptável para diferentes tamanhos de tela com animações fluidas.

## 🔗 Integração com Backend

O frontend está configurado para se comunicar com a API backend. Certifique-se de que o backend esteja rodando (geralmente na porta `8000`) para que as funcionalidades que dependem de dados dinâmicos funcionem corretamente.

---
*Desenvolvido para o Desafio Técnico Full-Stack.*
