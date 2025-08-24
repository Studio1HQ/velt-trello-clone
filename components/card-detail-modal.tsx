"use client"

import { useState } from "react"
import { X, Clock, MessageCircle, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DynamicVeltInlineCommentsSection } from "@/components/velt-inline-comments-dynamic"
import { useTheme } from "@/components/theme-provider"
import { BoardCard } from "@/hooks/use-live-board-sync"

interface User {
  id: string
  name: string
  avatar: string
  email: string
  online: boolean
}




interface CardDetailModalProps {
  card: BoardCard
  users: User[]
  onClose: () => void
}

// Utility function to format relative time
function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return diffInSeconds <= 5 ? "just now" : `${diffInSeconds}s ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths}mo ago`
}

const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🔥", "💡", "✅"]

export function CardDetailModal({ card, users, onClose }: CardDetailModalProps) {
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null)
  const { theme } = useTheme()

  const getUserById = (id: string) => users.find((user) => user.id === id)
  const creator = getUserById(card.createdBy)
  const cardContainerId = `card-detail-${card.id}`
  const cardTargetId = `card-${card.id}`


  const handleReactionClick = (emoji: string, targetId: string, targetType: "card" | "comment") => {
    // In a real app, this would make an API call
    console.log("Adding reaction:", emoji, "to", targetType, targetId)
    setShowReactionPicker(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] bg-card">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex-1 min-w-0">
            <section 
              id={cardContainerId}
              data-velt-target-inline-comment-element-id={cardTargetId}
            >
              <h2 className="text-lg font-semibold text-foreground mb-2 pr-8">{card.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {creator && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback className="text-xs">
                        {creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>Created by {creator.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRelativeTime(card.createdAt)}</span>
                </div>
              </div>
            </section>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Assigned Users */}
          {card.assignedUsers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Assigned to</h3>
              <div className="flex -space-x-2">
                {card.assignedUsers.map((userId) => {
                  const user = getUserById(userId)
                  return user ? (
                    <Avatar key={userId} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Card Reactions */}
          {card.reactions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Reactions</h3>
              <div className="flex flex-wrap gap-2" data-velt-reactions={`card-${card.id}`}>
                {card.reactions.map((reaction, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleReactionClick(reaction.emoji, card.id, "card")}
                    data-velt-reaction={reaction.emoji}
                  >
                    {reaction.emoji} {reaction.count}
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 bg-transparent"
                  onClick={() => setShowReactionPicker(showReactionPicker === card.id ? null : card.id)}
                >
                  <Smile className="h-3 w-3" />
                </Button>
              </div>
              {showReactionPicker === card.id && (
                <div className="flex flex-wrap gap-1 mt-2 p-2 border rounded-md bg-muted/50">
                  {reactionEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleReactionClick(emoji, card.id, "card")}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Velt Inline Comments Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-4 w-4" />
              <h3 className="text-sm font-medium">Comments</h3>
            </div>
            
            <DynamicVeltInlineCommentsSection
              targetElementId={cardTargetId}
              darkMode={theme === 'dark'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
