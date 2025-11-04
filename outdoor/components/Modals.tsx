import React from 'react'
import { GameManager } from '@/lib/utils/gameManager'

interface ModalOverlayProps {
  children: React.ReactNode
  onClose: () => void
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  return (
    <div 
      className="modal-overlay fixed inset-0 bg-black/60 z-40" 
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

interface LocationModalProps {
  chapterMessages: any
  onClose: () => void
}

export function LocationModal({ chapterMessages, onClose }: LocationModalProps) {
  if (!chapterMessages) return null

  return (
    <div className="modal fixed top-1/2 left-1/2 w-[calc(100%-2.5rem)] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 text-center transform -translate-x-1/2 -translate-y-1/2">
      <h3 className="text-2xl font-bold text-gray-900 mb-5">
        {chapterMessages.locationPopupText || '次は「◯◯」で謎を解こう'}
      </h3>
      <div className="w-full h-48 md:h-64 overflow-hidden rounded-lg border border-gray-200 mb-5 shadow-inner">
        <img 
          src={chapterMessages.mapImageUrl || 'https://placehold.co/400x300/3B82F6/FFFFFF?text=マップ画像'} 
          alt="マップ" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://placehold.co/400x300/cccccc/999999?text=Map+Image+Not+Found'
          }}
        />
      </div>
      <p className="text-gray-600 mb-6 text-sm">マップを参考に移動してください。</p>
      <button 
        className="btn-primary w-full touch-manipulation"
        onClick={onClose}
      >
        ✅ 閉じる
      </button>
    </div>
  )
}

interface ChapterClearModalProps {
  chapter: any
  chapterProgress: any
  onNextChapter: () => void
}

export function ChapterClearModal({ chapter, chapterProgress, onNextChapter }: ChapterClearModalProps) {
  return (
    <div className="modal fixed top-1/2 left-1/2 w-[calc(100%-2.5rem)] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 text-center transform -translate-x-1/2 -translate-y-1/2">
      <div className="text-4xl mb-4">🎊</div>
      <h3 className="text-3xl font-bold text-blue-600 mb-6">第{chapter.id}章クリア！</h3>
      <p className="text-lg text-gray-700 mb-2">おめでとうございます！</p>
      
      {/* 進捗情報 */}
      <div className="text-sm text-blue-600 font-semibold mb-6">
        {chapterProgress ? (
          `${chapterProgress.completedTeams.length}組がクリア済み（全${chapterProgress.totalTeams}組中）`
        ) : (
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>読み込み中...</span>
          </div>
        )}
      </div>

      {/* はんナビ広告枠 */}
      <div className="w-full border border-gray-300 rounded-lg p-4 mb-8 shadow-sm">
        <p className="text-xs text-gray-500 text-left mb-2">SPONSORED</p>
        <a 
          href="https://www.i-maker.org" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block touch-manipulation"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md p-3 mb-2">
            <p className="text-sm font-bold hover:underline">阪大生の「やりたい」が見つかる！</p>
            <p className="text-base font-black">【はんナビ】</p>
          </div>
          <p className="text-xs text-gray-600">イベント情報やサークル探しはこちらから</p>
        </a>
      </div>

      <button 
        className="btn-primary w-full text-lg touch-manipulation"
        onClick={onNextChapter}
      >
        🎯 新たな謎に挑戦
      </button>
    </div>
  )
}

interface ReviewModalProps {
  gameManager: GameManager
  onClose: () => void
}

export function ReviewModal({ gameManager, onClose }: ReviewModalProps) {
  const currentChapter = gameManager.getGameState().currentChapter

  const renderReviewContent = () => {
    const content = []
    
    for (let chapterId = 1; chapterId < currentChapter; chapterId++) {
      const chapter = gameManager.getChapter(chapterId)
      if (!chapter) continue

      content.push(
        <div key={chapterId} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="font-bold text-blue-600 mb-2">
            第{chapter.id}章：{chapter.title}
          </div>
          <div className="space-y-3">
            {Array.from(chapter.questions.values()).map((question) => (
              <div key={question.id} className="rounded-lg bg-white border border-gray-200 p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-1">{question.title}</div>
                <div className="text-sm text-gray-700 mb-2">{question.text}</div>
                <div className="text-sm font-bold text-green-700">答え：{question.answer[0]}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return content
  }

  return (
    <div className="modal fixed top-1/2 left-1/2 w-[calc(100%-2.5rem)] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">過去の問題と回答</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="modal-content space-y-4 text-left max-h-[60vh] overflow-y-auto">
        {renderReviewContent()}
      </div>
      <div className="mt-6">
        <button 
          className="btn-primary w-full touch-manipulation"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  )
}