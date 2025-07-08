"use client"

import { useState } from "react"
import { X, Clock, MessageCircle, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface User {
  id: string
  name: string
  avatar: string
  email: string
  online: boolean
}

interface Reaction {
  emoji: string
  count: number
  users: string[]
}

interface BoardCard {
  id: string
  title: string
  assignedUsers: string[]
  reactions: Reaction[]
  commentCount: number
  createdBy: string
  createdAt: string
}

interface Comment {
  id: string
  cardId: string
  userId: string
  text: string
  timestamp: string
  reactions: Reaction[]
}

interface CardDetailModalProps {
  card: BoardCard
  comments: Comment[]
  users: User[]
  currentUser: User
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

export function CardDetailModal({ card, comments, users, currentUser, onClose }: CardDetailModalProps) {
  const [newComment, setNewComment] = useState("")
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null)

  const getUserById = (id: string) => users.find((user) => user.id === id)
  const creator = getUserById(card.createdBy)

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would make an API call
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

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
            <h2 className="text-lg font-semibold text-foreground mb-2 pr-8">{card.title}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {creator && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
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
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
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

          {/* Comments Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-4 w-4" />
              <h3 className="text-sm font-medium">Comments ({comments.length})</h3>
            </div>

            {/* Add Comment */}
            <div className="space-y-3 mb-6" data-velt-target="comment-composer">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback className="text-xs">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <ScrollArea className="max-h-60">
              <div className="space-y-4" data-velt-target="comments-list">
                {comments.map((comment) => {
                  const commentUser = getUserById(comment.userId)
                  return commentUser ? (
                    <div key={comment.id} className="flex gap-3" data-velt-comment={comment.id}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={commentUser.avatar || "/placeholder.svg"} alt={commentUser.name} />
                        <AvatarFallback className="text-xs">
                          {commentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{commentUser.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{comment.text}</p>
                        </div>
                        {/* Comment Reactions */}
                        <div className="flex items-center gap-2">
                          {comment.reactions.length > 0 && (
                            <div className="flex gap-1">
                              {comment.reactions.map((reaction, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs cursor-pointer hover:bg-accent"
                                  onClick={() => handleReactionClick(reaction.emoji, comment.id, "comment")}
                                >
                                  {reaction.emoji} {reaction.count}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setShowReactionPicker(showReactionPicker === comment.id ? null : comment.id)}
                          >
                            <Smile className="h-3 w-3 mr-1" />
                            React
                          </Button>
                        </div>
                        {showReactionPicker === comment.id && (
                          <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
                            {reactionEmojis.map((emoji) => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleReactionClick(emoji, comment.id, "comment")}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
