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
  const { resolvedTheme } = useTheme()
  return <VeltComments popoverMode={popoverMode} darkMode={resolvedTheme === 'dark'} />
}

function VeltCommentsSidebarWrapper() {
  const { resolvedTheme } = useTheme()
  return <VeltCommentsSidebar darkMode={resolvedTheme === 'dark'} />
}

function VeltSidebarButtonWrapper() {
  const { resolvedTheme } = useTheme()
  return <VeltSidebarButton darkMode={resolvedTheme === 'dark'} />
}

export { 
  VeltCommentsWrapper as DynamicVeltComments,
  VeltCommentsSidebarWrapper as DynamicVeltCommentsSidebar,
  VeltSidebarButtonWrapper as DynamicVeltSidebarButton
}