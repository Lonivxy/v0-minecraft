import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CGSBS - Minecraft 躲猫猫服务器',
  description: '欢迎来到 CGSBS Minecraft 服务器！体验最刺激的躲猫猫玩法，与全球玩家一起享受最有趣的捉迷藏游戏！',
  keywords: ['Minecraft', '我的世界', '躲猫猫', '服务器', 'CGSBS', '1.20.4', 'Hide and Seek'],
  generator: 'Lonivxy',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const enableVercelAnalytics = process.env.VERCEL === '1'

  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
