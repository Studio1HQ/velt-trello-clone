"use client"

import { VeltProvider } from '@veltdev/react'
import React from 'react'
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

  return (
    <VeltProvider 
      apiKey={apiKey}
    >
      {children}
    </VeltProvider>
  )
}