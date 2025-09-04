"use client"

import dynamic from 'next/dynamic'
import { useTheme } from '@/components/theme-provider'

const VeltPresence = dynamic(
  () => import('@veltdev/react').then(mod => ({ default: mod.VeltPresence })),
  {
    ssr: false,
    loading: () => <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
  }
)

function VeltPresenceWrapper() {
  const { resolvedTheme } = useTheme()
  return (
    <div className="flex items-center justify-center">
      <VeltPresence darkMode={resolvedTheme === 'dark'} />
    </div>
  )
}

export { VeltPresenceWrapper as DynamicVeltPresence }