import React from 'react'
import { useNavigate } from 'react-router-dom'
import QuestGrid from '../components/QuestGrid'
import InfoPanel from '../components/InfoPanel'
import { quests, Quest } from '../data/questsData'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleQuestClick = (quest: Quest) => {
    navigate(`/quest/${quest.id}`)
  }

  return (
    <div className="landing-page container">
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="glitch" data-text="Sua Jornada Começa Aqui">
            Sua Jornada Começa Aqui
          </span>
        </h1>
        <p className="hero-subtitle">
          Complete as quests abaixo para provar seu valor e conquistar sua vaga na Interest Engenharia.
        </p>
      </div>

      <QuestGrid quests={quests} onQuestClick={handleQuestClick} />
      <InfoPanel />
    </div>
  )
}

export default LandingPage
