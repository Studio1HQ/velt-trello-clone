"use client"

import dynamic from 'next/dynamic'
import { useTheme } from '@/components/theme-provider'

const VeltNotificationsTool = dynamic(
  () => import('@veltdev/react').then(mod => ({ default: mod.VeltNotificationsTool })),
  {
    ssr: false,
    loading: () => null
  }
)

function VeltNotificationsToolWrapper() {
  const { theme } = useTheme()
  return <VeltNotificationsTool darkMode={theme === 'dark'} />
}

export { VeltNotificationsToolWrapper as DynamicVeltNotificationsTool }