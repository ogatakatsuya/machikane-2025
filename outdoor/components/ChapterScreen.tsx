import React, { useState, useEffect } from 'react'
import { Question } from '@/lib/types/game'
import { GameManager } from '@/lib/utils/gameManager'

interface ChapterScreenProps {
  gameData: {
    chapter: any
    questions: Question[]
  }
  chapterProgress: any
  onAnswerSubmit: (questionId: string, answer: string) => Promise<any>
  onShowMap: () => void
  onShowReview: () => void
  gameManager: GameManager
}

interface QuestionComponentProps {
  question: Question
  onAnswerSubmit: (questionId: string, answer: string) => Promise<any>
}

function QuestionComponent({ question, onAnswerSubmit }: QuestionComponentProps) {
  const [answer, setAnswer] = useState(question.isCompleted ? question.answer[0] : '')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (question.isCompleted) {
      setAnswer(question.answer[0])
    }
  }, [question.isCompleted, question.answer])

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return

    setIsSubmitting(true)
    const result = await onAnswerSubmit(question.id, answer.trim())
    
    if (result.correct) {
      setMessage('正解！')
      setAnswer(answer.trim())
    } else {
      setMessage('不正解...もう一度考えてみよう。')
    }
    setIsSubmitting(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !question.isCompleted) {
      handleSubmit()
    }
  }

  if (!question.isUnlocked) {
    return (
      <div className="question-block locked bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-4 relative">
        <div className="absolute inset-0 bg-gray-200/50 flex items-center justify-center z-10 backdrop-blur-[2px] rounded-xl">
          <svg className="w-8 h-8 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span className="font-semibold text-gray-700">上の問題を解くとアンロックされます</span>
        </div>
        <h3 className="text-lg font-bold text-gray-500 mb-3">{question.title}</h3>
        <p className="text-gray-500 mb-4">(問題はロックされています)</p>
      </div>
    )
  }

  const buttonText = question.isCompleted ? 'クリア！' : '回答する'
  const buttonClass = question.isCompleted ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'

  return (
    <div className={`question-block ${question.isCompleted ? 'cleared' : 'active'} bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-4`}>
      <h3 className="text-xl font-bold text-blue-600 mb-4">{question.title}</h3>
      <p className="text-gray-700 mb-5 leading-relaxed">{question.text}</p>
      
      {question.image && (
        <div className="my-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <img 
            src={question.image} 
            alt="謎の画像" 
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      <div className="space-y-3 pt-4">
        <input
          type="text"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm text-lg"
          placeholder="答えを入力"
          value={answer}
          onChange={(e) => !question.isCompleted && setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={question.isCompleted || isSubmitting}
        />
        <button
          className={`w-full ${buttonClass} text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all text-lg ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={question.isCompleted || isSubmitting}
        >
          {isSubmitting ? '送信中...' : buttonText}
        </button>
      </div>
      
      {message && (
        <div className={`mt-3 text-sm min-h-[1.25rem] font-bold ${
          message.includes('もう一度') ? 'text-red-600' : 'text-green-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default function ChapterScreen({
  gameData,
  chapterProgress,
  onAnswerSubmit,
  onShowMap,
  onShowReview,
  gameManager
}: ChapterScreenProps) {
  const { chapter, questions } = gameData
  const totalChapters = gameManager.getTotalChapters()
  const currentChapter = gameManager.getGameState().currentChapter

  return (
    <div className="min-h-screen-ios">
      {/* ヘッダー */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-500">
            第{chapter.id}章 / 全{totalChapters}章
          </span>
          <span className="text-xl font-bold text-blue-600">{chapter.title}</span>
        </div>
        
        {/* 章開始時のクリア済み人数 */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-center">
            {chapterProgress ? (
              <div className="inline-flex items-center justify-center space-x-2 bg-green-50 rounded-lg px-4 py-2">
                <span className="text-lg font-bold text-green-600">{chapterProgress.completedTeams.length}</span>
                <span className="text-sm text-green-700 font-medium">組がクリア済み</span>
                <span className="text-xs text-gray-500">（全{chapterProgress.totalTeams}組中）</span>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center space-x-2 bg-blue-50 rounded-lg px-4 py-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm text-blue-600 font-medium">読み込み中...</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* 問題コンテナ */}
      <main className="p-4 md:p-6 space-y-4 pb-40 safe-area-inset">
        {questions.map((question) => (
          <QuestionComponent
            key={question.id}
            question={question}
            onAnswerSubmit={onAnswerSubmit}
          />
        ))}
      </main>

      {/* マップ確認用フッター */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 z-10 safe-area-inset">
        <div className="grid grid-cols-2 gap-3">
          <button
            className="btn-secondary w-full touch-manipulation"
            onClick={onShowMap}
          >
            🗺️ マップを確認する
          </button>
          {currentChapter > 1 && (
            <button
              className="btn-secondary w-full touch-manipulation"
              onClick={onShowReview}
            >
              📚 過去の問題を見る
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}