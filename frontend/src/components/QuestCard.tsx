import React from 'react'
import { Quest, questContent } from '../data/questsData'
import { useQuest } from '../hooks/useQuestContext'

interface QuestCardProps {
  quest: Quest
  onClick: (quest: Quest) => void
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick }) => {
  const { getQuestProgress } = useQuest()
  
  const content = questContent[quest.id]
  const totalObjectives = content ? content.objectives.length : 0
  const progress = getQuestProgress(quest.id, totalObjectives)

  return (
    <div className="quest-card" onClick={() => onClick(quest)}>
      <div className="quest-card-header">
        <span className="quest-emoji">{quest.emoji}</span>
        <span className="quest-icon">{quest.icon}</span>
      </div>

      <h3 className="quest-title">{quest.title}</h3>
      
      <div className="quest-meta">
        <span className="quest-level">{quest.level}</span>
        <span className="quest-xp">{quest.xp}</span>
      </div>

      <div className="quest-progress-mini">
        <div className="quest-progress-label">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="quest-progress-track">
          <div 
            className="quest-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="quest-difficulty">{quest.difficulty}</div>
      <div className="quest-cta">Aceitar Quest →</div>
    </div>
  )
}

export default QuestCard
