import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '屋外謎解きゲーム | 大学探索',
  description: '大阪大学の屋外エリアを巡るストーリー性のある謎解きゲーム',
  manifest: '/manifest.json',
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '屋外謎解き',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-gray-100 text-gray-800 select-none">
        {children}
      </body>
    </html>
  )
}