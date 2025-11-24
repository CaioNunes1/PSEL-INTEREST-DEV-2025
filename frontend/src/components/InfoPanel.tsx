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
          <li>✅ Funcionalidade completa</li>
          <li>🏛️ Arquitetura e padrões</li>
          <li>🧪 Cobertura de testes</li>
          <li>📝 Qualidade do código</li>
          <li>🎨 UI/UX (frontend)</li>
          <li>🤖 Uso consciente de IA</li>
        </ul>
      </div>
    </div>
  )
}

export default InfoPanel
