"use client"

import dynamic from 'next/dynamic'

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
  return <VeltComments popoverMode={popoverMode} />
}

function VeltCommentsSidebarWrapper() {
  return <VeltCommentsSidebar />
}

function VeltSidebarButtonWrapper() {
  return <VeltSidebarButton />
}

export { 
  VeltCommentsWrapper as DynamicVeltComments,
  VeltCommentsSidebarWrapper as DynamicVeltCommentsSidebar,
  VeltSidebarButtonWrapper as DynamicVeltSidebarButton
}