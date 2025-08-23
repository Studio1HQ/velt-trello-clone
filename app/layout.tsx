import type { Metadata } from 'next'
import './globals.css'
import { VeltWrapper } from '@/components/velt-wrapper'

export const metadata: Metadata = {
  title: 'Trello Clone',
  description: 'A collaborative Trello board with Velt integration',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <VeltWrapper>
          {children}
        </VeltWrapper>
      </body>
    </html>
  )
}
