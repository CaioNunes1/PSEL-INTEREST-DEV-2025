import React from 'react'

const InfoPanel: React.FC = () => {
  return (
    <div className="info-section">
      <div className="info-card">
        <h3>🎮 Como Funciona</h3>
        <ol>
          <li>Escolha uma quest acima</li>
          <li>Leia os objetivos e requisitos</li>
          <li>Implemente sua solução</li>
          <li>Teste completamente</li>
          <li>Documente escolhas e decisões (o processo de construção é avaliado)</li>
          <li>Envie seu código</li>
        </ol>
      </div>

      <div className="info-card">
        <h3>⚖️ Critérios de Avaliação</h3>
        <ul>
          <li>🗄️ Banco de Dados (Integridade)</li>
          <li>⚙️ Backend (Robustez)</li>
          <li>🖥️ Frontend (UX & Estado)</li>
          <li>🧪 QA (Testes Automatizados)</li>
          <li>⭐ Bônus (Processo & Docs)</li>
        </ul>
        <p>⚠️ Importante: Os critérios técnicos detalhados e as perguntas de autoavaliação estão no arquivo README.md do repositório.</p>
      </div>
    </div>
  )
}

export default InfoPanel
