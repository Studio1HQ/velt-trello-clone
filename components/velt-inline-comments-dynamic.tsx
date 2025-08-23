"use client"

import dynamic from 'next/dynamic'

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
  return (
    <VeltInlineCommentsSection
      targetElementId={targetElementId}
      darkMode={darkMode}
    />
  )
}

export { VeltInlineCommentsSectionWrapper as DynamicVeltInlineCommentsSection }