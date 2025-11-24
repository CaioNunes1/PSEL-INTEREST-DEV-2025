import React from 'react'
import { Quest, questContent } from '../data/questsData'
import { useQuest } from '../context/QuestContext'

interface QuestDetailProps {
  quest: Quest
  onBack: () => void
}

const QuestDetail: React.FC<QuestDetailProps> = ({ quest, onBack }) => {
  const content = questContent[quest.id]
  const { progress, toggleObjective, getQuestProgress } = useQuest()
  
  const questProgress = getQuestProgress(quest.id, content.objectives.length)
  const currentProgress = progress[quest.id] || {}

  return (
    <div className="quest-detail">
      <button className="back-button" onClick={onBack}>
        ← Voltar às Quests
      </button>

      <div className="quest-detail-header">
        <h2 className="quest-detail-title">{content.title}</h2>
        <p className="quest-detail-description">{content.description}</p>
        
        <div className="progress-container">
          <div className="progress-label">
            <span>Progresso da Quest</span>
            <span>{questProgress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${questProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="quest-sections">
        <section className="quest-section">
          <h3 className="section-title">⚔️ Habilidades Necessárias</h3>
          <ul className="skills-list">
            {content.skills.map((skill, index) => (
              <li key={index} className="skill-item">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="quest-section">
          <h3 className="section-title">🎯 Objetivos da Quest</h3>
          <ul className="objectives-list">
            {content.objectives.map((obj, index) => (
              <li 
                key={index} 
                className={`objective-item ${currentProgress[index] ? 'completed' : ''}`}
                onClick={() => toggleObjective(quest.id, index)}
              >
                <div className="checkbox">
                  {currentProgress[index] && <span>✓</span>}
                </div>
                <span className="objective-text">{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="quest-section">
          <h3 className="section-title">🏆 Recompensas</h3>
          <ul className="rewards-list">
            {content.rewards.map((reward, index) => (
              <li key={index} className="reward-item">
                {reward}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="motivation-box">
        <h4>💪 Dica do Mestre</h4>
        <p>
          Esta quest testará suas habilidades e criatividade. Lembre-se: não
          existe uma única solução correta. Mostre sua forma única de resolver
          problemas!
        </p>
      </div>
    </div>
  )
}

export default QuestDetail
