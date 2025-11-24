import React from 'react'
import { Quest } from '../data/questsData'
import QuestCard from './QuestCard'

interface QuestGridProps {
  quests: Quest[]
  onQuestClick: (quest: Quest) => void
}

const QuestGrid: React.FC<QuestGridProps> = ({ quests, onQuestClick }) => {
  return (
    <div className="quests-grid">
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} onClick={onQuestClick} />
      ))}
    </div>
  )
}

export default QuestGrid
