import React, { createContext, useContext, useState, useEffect } from 'react'

interface QuestProgress {
  [questId: string]: {
    [objectiveIndex: number]: boolean
  }
}

interface QuestContextType {
  progress: QuestProgress
  toggleObjective: (questId: string, objectiveIndex: number) => void
  getQuestProgress: (questId: string, totalObjectives: number) => number
}

const QuestContext = createContext<QuestContextType | undefined>(undefined)

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<QuestProgress>(() => {
    const saved = localStorage.getItem('quest-progress')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('quest-progress', JSON.stringify(progress))
  }, [progress])

  const toggleObjective = (questId: string, objectiveIndex: number) => {
    setProgress(prev => {
      const questProgress = prev[questId] || {}
      return {
        ...prev,
        [questId]: {
          ...questProgress,
          [objectiveIndex]: !questProgress[objectiveIndex]
        }
      }
    })
  }

  const getQuestProgress = (questId: string, totalObjectives: number) => {
    const questProgress = progress[questId] || {}
    const completedCount = Object.values(questProgress).filter(Boolean).length
    return Math.round((completedCount / totalObjectives) * 100)
  }

  return (
    <QuestContext.Provider value={{ progress, toggleObjective, getQuestProgress }}>
      {children}
    </QuestContext.Provider>
  )
}

export const useQuest = () => {
  const context = useContext(QuestContext)
  if (context === undefined) {
    throw new Error('useQuest must be used within a QuestProvider')
  }
  return context
}
