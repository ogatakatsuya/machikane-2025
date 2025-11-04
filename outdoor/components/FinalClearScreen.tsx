import React from 'react'

interface FinalClearScreenProps {
  onRestart: () => void
}

export default function FinalClearScreen({ onRestart }: FinalClearScreenProps) {
  return (
    <div className="p-6 flex flex-col justify-center items-center min-h-screen-ios text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-4xl font-bold text-amber-500 mb-4">完全クリア！</h2>
        <p className="text-xl font-semibold text-gray-800 mb-6">おめでとうございます！</p>
        <p className="text-lg text-gray-700 mb-10">すべての謎を解き明かしました！</p>
      </div>
      
      {/* はんナビ広告枠 */}
      <div className="w-full max-w-sm border border-gray-300 rounded-lg p-4 mb-6 shadow-lg mx-auto">
        <p className="text-xs text-gray-500 text-left mb-2">SPONSORED</p>
        <a 
          href="https://www.i-maker.org/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block group touch-manipulation"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md p-4 mb-2">
            <p className="text-sm font-bold group-hover:underline">阪大生の「やりたい」が見つかる！</p>
            <p className="text-lg font-black">【はんナビ】</p>
          </div>
          <p className="text-xs text-gray-600">イベント情報やサークル探しはこちらから</p>
        </a>
      </div>

      {/* SNS共有ボタン */}
      <div className="w-full max-w-sm mx-auto mt-8">
        <p className="text-sm text-gray-600 mb-4">クリアをシェアしよう！</p>
        <div className="flex justify-center space-x-5">
          {/* X (Twitter) */}
          <a 
            href="https://twitter.com/intent/tweet?text=大学探索謎解きゲームをクリアしました！%0A&hashtags=大学探索謎解き" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-3xl shadow-md hover:opacity-80 transition-opacity touch-manipulation" 
            aria-label="Xでシェア"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
            </svg>
          </a>
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl shadow-md hover:opacity-80 transition-opacity touch-manipulation" 
            aria-label="Instagramでシェア"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.227-1.669 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.669-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.142 0-3.504.012-4.726.068-2.759.126-3.951 1.319-4.077 4.077-.056 1.222-.068 1.583-.068 4.726s.012 3.504.068 4.726c.126 2.759 1.318 3.951 4.077 4.077 1.222.056 1.584.068 4.726.068s3.504-.012 4.726-.068c2.759-.126 3.951-1.318 4.077-4.077.056-1.222.068-1.584.068-4.726s-.012-3.504-.068-4.726c-.126-2.758-1.318-3.951-4.077-4.077-1.222-.056-1.584-.068-4.726-.068zM12 6.873c-2.825 0-5.127 2.302-5.127 5.127s2.302 5.127 5.127 5.127 5.127-2.302 5.127-5.127-2.302-5.127-5.127-5.127zm0 8.812c-2.031 0-3.685-1.654-3.685-3.685s1.654-3.685 3.685-3.685 3.685 1.654 3.685 3.685-1.654 3.685-3.685 3.685zm6.406-9.15c-.71 0-1.284.574-1.284 1.284s.574 1.284 1.284 1.284 1.284-.574 1.284-1.284-.574-1.284-1.284-1.284z"/>
            </svg>
          </a>
        </div>
      </div>

      <button 
        className="w-full max-w-sm bg-gray-500 text-white font-bold py-3 px-5 rounded-lg shadow-lg hover:bg-gray-600 transition-all text-md mt-12 mx-auto touch-manipulation"
        onClick={onRestart}
      >
        🔄 最初からやり直す
      </button>
    </div>
  )
}