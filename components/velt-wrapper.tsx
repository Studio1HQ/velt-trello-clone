"use client"

import { VeltProvider } from '@veltdev/react'
import React, { useEffect } from 'react'
import { useTheme } from '@/components/theme-provider'

interface VeltWrapperProps {
  children: React.ReactNode
}

export function VeltWrapper({ children }: VeltWrapperProps) {
  const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY
  const { theme } = useTheme()
  
  if (!apiKey) {
    console.error('NEXT_PUBLIC_VELT_API_KEY is not set')
    return <>{children}</>
  }

  // Apply theme-based CSS variables for Velt components
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.style.setProperty('--velt-comment-background', '#1f2937')
      root.style.setProperty('--velt-comment-text', '#f9fafb')
      root.style.setProperty('--velt-comment-border', '#374151')
    } else {
      root.style.setProperty('--velt-comment-background', '#ffffff')
      root.style.setProperty('--velt-comment-text', '#1f2937')
      root.style.setProperty('--velt-comment-border', '#e5e7eb')
    }
  }, [theme])

  return (
    <VeltProvider 
      apiKey={apiKey}
    >
      {children}
    </VeltProvider>
  )
}