'use client'

import React, { useEffect, useRef, useState } from 'react'
import { GameManager } from '@/lib/utils/gameManager'
import { ScreenType, ModalType, Question } from '@/lib/types/game'
import { APIClient } from '@/lib/utils/api'
import StartScreen from './StartScreen'
import ChapterScreen from './ChapterScreen'
import FinalClearScreen from './FinalClearScreen'
import { ModalOverlay, LocationModal, ChapterClearModal, ReviewModal } from './Modals'
import { LoadingScreen, ResumeLoadingScreen, Toast } from './LoadingAndToast'

export default function OutdoorPuzzleGame() {
  const gameManagerRef = useRef<GameManager | null>(null)
  const apiClientRef = useRef<APIClient | null>(null)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('start')
  const [isLoading, setIsLoading] = useState(true)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [startLoading, setStartLoading] = useState(false)
  const [currentModal, setCurrentModal] = useState<ModalType>(null)
  const [teamName, setTeamName] = useState('')
  const [teamSize, setTeamSize] = useState(1)
  const [teamNameError, setTeamNameError] = useState('')
  const [gameData, setGameData] = useState<any>(null)
  const [chapterProgress, setChapterProgress] = useState<any>(null)
  const [overallProgress, setOverallProgress] = useState<any>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    gameManagerRef.current = new GameManager()
    apiClientRef.current = new APIClient()
    initializeGame()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const initializeGame = async () => {
    if (!gameManagerRef.current) return

    const resumed = await gameManagerRef.current.resumeGame()
    
    if (resumed) {
      setResumeLoading(true)
      const gameState = gameManagerRef.current.getGameState()
      await loadChapter(gameState.currentChapter)
      setResumeLoading(false)
      setCurrentScreen('chapter')
      showToastMessage(`「${gameState.teamName}」の進捗を復元しました！`)
    } else {
      setCurrentScreen('start')
      await loadOverallProgress()
    }
    setIsLoading(false)
  }

  const loadChapter = async (chapterNum: number) => {
    if (!gameManagerRef.current) return

    const chapter = gameManagerRef.current.getChapter(chapterNum)
    if (!chapter) return

    await showChapterStartProgress(chapterNum)
    const questions = Array.from(chapter.questions.values())
    setGameData({ chapter, questions })
  }

  const showChapterStartProgress = async (chapterNum: number) => {
    if (!gameManagerRef.current) return
    const progress = await gameManagerRef.current.getChapterProgress(chapterNum)
    setChapterProgress(progress)
  }

  const loadOverallProgress = async () => {
    if (!apiClientRef.current) return
    
    try {
      const progress = await apiClientRef.current.getOverallProgress()
      setOverallProgress(progress)
    } catch (error) {
      console.error('Failed to load overall progress:', error)
    }
  }

  const validateTeamName = (name: string) => {
    if (!name.trim()) {
      setTeamNameError('チーム名を入力してください')
      return false
    }
    setTeamNameError('')
    return true
  }

  const startGame = async () => {
    if (!gameManagerRef.current || !validateTeamName(teamName)) return

    setStartLoading(true)
    
    try {
      const result = await gameManagerRef.current.startGame(teamName, teamSize)
      
      if (!result.success) {
        alert(result.error || 'チームの登録に失敗しました')
        setStartLoading(false)
        return
      }

      await loadChapter(1)
      
      const chapterMessages = gameManagerRef.current.getCurrentChapterMessages()
      if (chapterMessages) {
        setCurrentModal('location')
      }
      setCurrentScreen('chapter')
    } catch (error) {
      console.error('Failed to start game:', error)
      alert('ゲームの開始に失敗しました。もう一度お試しください。')
    }
    setStartLoading(false)
  }

  const handleAnswerSubmit = async (questionId: string, answer: string) => {
    if (!gameManagerRef.current) return

    const result = await gameManagerRef.current.checkAnswer(questionId, answer)
    
    if (result.correct) {
      setTimeout(async () => {
        if (result.nextAction === 'unlock') {
          await refreshCurrentChapter()
        } else if (result.nextAction === 'chapter-clear') {
          await showChapterClearModal()
        } else if (result.nextAction === 'game-complete') {
          setCurrentScreen('final-clear')
        }
      }, 500)
    }
    
    return result
  }

  const refreshCurrentChapter = async () => {
    if (!gameManagerRef.current) return
    const currentChapterNum = gameManagerRef.current.getGameState().currentChapter
    await loadChapter(currentChapterNum)
  }

  const showChapterClearModal = async () => {
    if (!gameManagerRef.current) return
    const currentChapter = gameManagerRef.current.getCurrentChapter()
    if (currentChapter) {
      const progress = await gameManagerRef.current.getChapterProgress(currentChapter.id)
      setChapterProgress(progress)
      setCurrentModal('chapter-clear')
    }
  }

  const moveToNextChapter = async () => {
    if (!gameManagerRef.current) return
    
    setCurrentModal(null)
    
    if (await gameManagerRef.current.moveToNextChapter()) {
      const currentChapterNum = gameManagerRef.current.getGameState().currentChapter
      await loadChapter(currentChapterNum)
      
      const chapterMessages = gameManagerRef.current.getCurrentChapterMessages()
      if (chapterMessages) {
        setCurrentModal('location')
      }
    }
  }

  const showMapModal = () => {
    setCurrentModal('location')
  }

  const showReviewModal = () => {
    setCurrentModal('review')
  }

  const restartGame = () => {
    if (!gameManagerRef.current) return
    gameManagerRef.current.resetGame()
    setTeamName('')
    setTeamSize(1)
    setCurrentScreen('start')
  }

  const closeModal = () => {
    setCurrentModal(null)
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      {resumeLoading && <ResumeLoadingScreen />}
      
      <Toast message={toastMessage} show={showToast} />
      
      <div className="max-w-lg mx-auto bg-gray-50 min-h-screen-ios shadow-lg relative overflow-hidden">
        {currentScreen === 'start' && (
          <StartScreen
            teamName={teamName}
            setTeamName={setTeamName}
            teamSize={teamSize}
            setTeamSize={setTeamSize}
            teamNameError={teamNameError}
            startLoading={startLoading}
            overallProgress={overallProgress}
            onStartGame={startGame}
            onTeamNameChange={(name: string) => {
              setTeamName(name)
              validateTeamName(name)
            }}
          />
        )}
        
        {currentScreen === 'chapter' && gameData && gameManagerRef.current && (
          <ChapterScreen
            gameData={gameData}
            chapterProgress={chapterProgress}
            onAnswerSubmit={handleAnswerSubmit}
            onShowMap={showMapModal}
            onShowReview={showReviewModal}
            gameManager={gameManagerRef.current}
          />
        )}
        
        {currentScreen === 'final-clear' && (
          <FinalClearScreen onRestart={restartGame} />
        )}
      </div>

      {currentModal && (
        <ModalOverlay onClose={closeModal}>
          {currentModal === 'location' && gameManagerRef.current && (
            <LocationModal
              chapterMessages={gameManagerRef.current.getCurrentChapterMessages()}
              onClose={closeModal}
            />
          )}
          {currentModal === 'chapter-clear' && gameData && (
            <ChapterClearModal
              chapter={gameData.chapter}
              chapterProgress={chapterProgress}
              onNextChapter={moveToNextChapter}
            />
          )}
          {currentModal === 'review' && gameManagerRef.current && (
            <ReviewModal
              gameManager={gameManagerRef.current}
              onClose={closeModal}
            />
          )}
        </ModalOverlay>
      )}
    </>
  )
}