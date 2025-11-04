import React from 'react'

export function LoadingScreen() {
  return (
    <div className="loading-screen fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center z-50 text-white">
      <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-5"></div>
      <div className="text-lg font-semibold">謎解きゲーム読み込み中...</div>
    </div>
  )
}

export function ResumeLoadingScreen() {
  return (
    <div className="loading-screen fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center z-50 text-white">
      <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-5"></div>
      <div className="text-lg font-semibold">ゲームを復帰中...</div>
    </div>
  )
}

interface ToastProps {
  message: string
  show: boolean
}

export function Toast({ message, show }: ToastProps) {
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
    }`}>
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  )
}