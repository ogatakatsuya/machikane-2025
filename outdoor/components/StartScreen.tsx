import React from 'react'

interface StartScreenProps {
  teamName: string
  setTeamName: (name: string) => void
  teamSize: number
  setTeamSize: (size: number) => void
  teamNameError: string
  startLoading: boolean
  overallProgress: any
  onStartGame: () => void
  onTeamNameChange: (name: string) => void
}

export default function StartScreen({
  teamName,
  setTeamName,
  teamSize,
  setTeamSize,
  teamNameError,
  startLoading,
  overallProgress,
  onStartGame,
  onTeamNameChange
}: StartScreenProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onStartGame()
    }
  }

  return (
    <div className="p-8 flex flex-col justify-center min-h-screen-ios fade-in">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">大学探索謎解きゲーム</h1>
      <p className="text-center text-gray-600 mb-6">4つのエリアを巡る謎解きに挑戦しよう！</p>
      
      {/* 全体進捗表示 */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-200">
        <h3 className="text-lg font-bold text-center text-gray-800 mb-4">📊 現在の挑戦状況</h3>
        <div className="text-center">
          {overallProgress ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overallProgress.totalTeams}</div>
                <div className="text-sm text-gray-600">組が挑戦中</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {overallProgress.chapters.map((chapter: any) => (
                  <div key={chapter.chapterId} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">第{chapter.chapterId}章</div>
                    <div className="text-lg font-bold text-blue-600">{chapter.completionRate}%</div>
                    <div className="text-xs text-gray-500">{chapter.completedTeams}/{chapter.totalTeams}組</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 text-blue-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium">読み込み中...</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-2">チーム名</label>
          <input
            type="text"
            id="team-name"
            className="input-field"
            placeholder="例：謎解き探偵団"
            maxLength={20}
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={startLoading}
          />
          {teamNameError && (
            <div className="mt-1 text-sm text-red-600">{teamNameError}</div>
          )}
        </div>
        <div>
          <label htmlFor="team-size" className="block text-sm font-medium text-gray-700 mb-2">人数</label>
          <select
            id="team-size"
            className="input-field"
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value))}
            disabled={startLoading}
          >
            <option value="1">1人</option>
            <option value="2">2人</option>
            <option value="3">3人</option>
            <option value="4">4人</option>
            <option value="5">5人以上</option>
          </select>
        </div>
      </div>
      
      <button
        className={`btn-primary w-full mt-12 text-xl touch-manipulation ${
          startLoading || !teamName.trim() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onStartGame}
        disabled={startLoading || !teamName.trim()}
      >
        🚀 ゲームスタート
      </button>
      
      {/* ローディング表示 */}
      {startLoading && (
        <div className="text-center mt-4">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin h-5 w-5 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-sm font-semibold">チームを登録しています...</span>
          </div>
        </div>
      )}
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>💡 ヒントは基本なし！分からない時はA101のスタッフへ</p>
        <p>📱 スマホ1台あればOK・制限時間なし</p>
      </div>
    </div>
  )
}