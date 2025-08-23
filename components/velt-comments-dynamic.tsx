"use client"

import dynamic from 'next/dynamic'
import { useTheme } from '@/components/theme-provider'

const VeltComments = dynamic(
  () => import('@veltdev/react').then(mod => ({ default: mod.VeltComments })),
  {
    ssr: false,
    loading: () => null
  }
)

const VeltCommentsSidebar = dynamic(
  () => import('@veltdev/react').then(mod => ({ default: mod.VeltCommentsSidebar })),
  {
    ssr: false,
    loading: () => null
  }
)

const VeltSidebarButton = dynamic(
  () => import('@veltdev/react').then(mod => ({ default: mod.VeltSidebarButton })),
  {
    ssr: false,
    loading: () => null
  }
)

function VeltCommentsWrapper({ popoverMode = false }: { popoverMode?: boolean }) {
  const { theme } = useTheme()
  return <VeltComments popoverMode={popoverMode} darkMode={theme === 'dark'} />
}

function VeltCommentsSidebarWrapper() {
  const { theme } = useTheme()
  return <VeltCommentsSidebar darkMode={theme === 'dark'} />
}

function VeltSidebarButtonWrapper() {
  const { theme } = useTheme()
  return <VeltSidebarButton darkMode={theme === 'dark'} />
}

export { 
  VeltCommentsWrapper as DynamicVeltComments,
  VeltCommentsSidebarWrapper as DynamicVeltCommentsSidebar,
  VeltSidebarButtonWrapper as DynamicVeltSidebarButton
}