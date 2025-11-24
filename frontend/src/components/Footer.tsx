import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>📚 Documentação</h3>
          <p>Consulte o README.md para detalhes completos</p>
        </div>
        <div className="footer-section">
          <h3>💡 Dica Final</h3>
          <p>Use IA com sabedoria — explique suas escolhas!</p>
        </div>
        <div className="footer-section">
          <h3>🚀 Boa Sorte!</h3>
          <p>Que a força do código esteja com você</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>✨ Criado por Interest Engenharia • Seu futuro começa aqui</p>
      </div>
    </footer>
  )
}

export default Footer
