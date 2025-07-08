"use client"

import { useState } from "react"
import { X, MessageCircle, Plus } from "lucide-react"
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

const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🔥", "💡", "✅"]

export function CardDetailModal({ card, comments, users, currentUser, onClose }: CardDetailModalProps) {
  const [newComment, setNewComment] = useState("")
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null)

  const getUserById = (id: string) => users.find((user) => user.id === id)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Placeholder for adding comment - will be handled by Velt SDK
      console.log("Add comment:", newComment)
      setNewComment("")
    }
  }

  const handleReactionClick = (commentId: string, emoji: string) => {
    // Placeholder for reaction toggle - will be handled by Velt SDK
    console.log("Toggle reaction:", commentId, emoji)
    setShowReactionPicker(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1">
            <h2
              className="text-lg font-semibold cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded -mx-2"
              contentEditable
              suppressContentEditableWarning
              data-velt-target={`card-title-${card.id}`}
            >
              {card.title}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <div className="space-y-6">
            {/* Assigned Users */}
            {card.assignedUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Assigned to</h3>
                <div className="flex gap-2">
                  {card.assignedUsers.map((userId) => {
                    const user = getUserById(userId)
                    return user ? (
                      <div key={userId} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.name}</span>
                      </div>
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
                      data-velt-reaction={reaction.emoji}
                    >
                      {reaction.emoji} {reaction.count}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="space-y-2" data-velt-comment-composer={`card-${card.id}`}>
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
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <ScrollArea className="max-h-96">
                <div className="space-y-4" data-velt-comment-stream={`card-${card.id}`}>
                  {comments.map((comment) => {
                    const user = getUserById(comment.userId)
                    return user ? (
                      <div key={comment.id} className="flex gap-3" data-velt-comment={comment.id}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
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
                                    onClick={() => handleReactionClick(comment.id, reaction.emoji)}
                                    data-velt-reaction={reaction.emoji}
                                  >
                                    {reaction.emoji} {reaction.count}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Reaction Picker */}
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() =>
                                  setShowReactionPicker(showReactionPicker === comment.id ? null : comment.id)
                                }
                              >
                                😊
                              </Button>

                              {showReactionPicker === comment.id && (
                                <div className="absolute top-8 left-0 bg-popover border rounded-lg p-2 shadow-lg z-10">
                                  <div className="grid grid-cols-5 gap-1">
                                    {reactionEmojis.map((emoji) => (
                                      <Button
                                        key={emoji}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleReactionClick(comment.id, emoji)}
                                      >
                                        {emoji}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
