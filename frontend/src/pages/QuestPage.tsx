import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestDetail from '../components/QuestDetail'
import { quests } from '../data/questsData'

const QuestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const quest = quests.find(q => q.id === id)

  if (!quest) {
    return (
      <div className="container error-container">
        <h2>Quest não encontrada!</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Voltar ao Mapa
        </button>
      </div>
    )
  }

  return (
    <div className="quest-page container">
      <QuestDetail quest={quest} onBack={() => navigate('/')} />
    </div>
  )
}

export default QuestPage
