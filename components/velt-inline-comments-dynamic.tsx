"use client"

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useVeltClient } from '@veltdev/react'

const VeltInlineCommentsSection = dynamic(
  () => import('@veltdev/react').then(mod => ({ default: mod.VeltInlineCommentsSection })),
  {
    ssr: false,
    loading: () => null
  }
)

interface VeltInlineCommentsSectionProps {
  targetElementId: string
  darkMode?: boolean
}

function VeltInlineCommentsSectionWrapper({ targetElementId, darkMode }: VeltInlineCommentsSectionProps) {
  const { client } = useVeltClient()
  const prevDarkMode = useRef<boolean | undefined>(darkMode)

  useEffect(() => {
    if (!client) return

    if (prevDarkMode.current !== darkMode && darkMode !== undefined) {
      client.setDarkMode(darkMode)
      prevDarkMode.current = darkMode
    }
  }, [client, darkMode])

  return (
    <VeltInlineCommentsSection
      key={`${targetElementId}-${darkMode}`}
      targetElementId={targetElementId}
      darkMode={darkMode}
    />
  )
}

export { VeltInlineCommentsSectionWrapper as DynamicVeltInlineCommentsSection }