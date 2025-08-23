"use client"

import dynamic from 'next/dynamic'
import { useTheme } from '@/components/theme-provider'

const VeltPresence = dynamic(
  () => import('@veltdev/react').then(mod => ({ default: mod.VeltPresence })),
  {
    ssr: false,
    loading: () => <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
  }
)

function VeltPresenceWrapper() {
  const { theme } = useTheme()
  return (
    <div className="flex items-center">
      <VeltPresence darkMode={theme === 'dark'} />
    </div>
  )
}

export { VeltPresenceWrapper as DynamicVeltPresence }