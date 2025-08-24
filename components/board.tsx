"use client"

import type React from "react"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"
import { Plus, MoreHorizontal, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddCardForm } from "@/components/add-card-form"
import { AddListForm } from "@/components/add-list-form"
import { BoardCard } from "@/hooks/use-live-board-sync"

interface BoardUser {
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

interface List {
  id: string
  title: string
  cards: BoardCard[]
}

interface BoardData {
  id: string
  title: string
  lists: List[]
}

// Update the BoardProps interface to include onDeleteCard
interface BoardProps {
  board: BoardData
  users: BoardUser[]
  onCardClick: (cardId: string) => void
  onAddCard: (listId: string, title: string) => void
  onAddList: (title: string) => void
  onDeleteCard: (cardId: string) => void
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

// Update the DraggableCard component to include delete functionality
function DraggableCard({
  card,
  users,
  onCardClick,
  onDeleteCard,
}: {
  card: BoardCard
  users: BoardUser[]
  onCardClick: (cardId: string) => void
  onDeleteCard: (cardId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  })

  const getUserById = (id: string) => users.find((user) => user.id === id)
  const creator = getUserById(card.createdBy)

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on dropdown menu
    if ((e.target as HTMLElement).closest("[data-dropdown-trigger]")) {
      return
    }
    onCardClick(card.id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
      onDeleteCard(card.id)
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow bg-card group relative ${isDragging ? "opacity-50" : ""}`}
      onClick={handleCardClick}
      data-velt-target={`card-${card.id}`}
      {...listeners}
      {...attributes}
    >
      <CardContent className="p-3">
        {/* Card Options Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-accent"
                data-dropdown-trigger
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onCardClick(card.id)}>Open card</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCardClick(card.id)}>Edit card</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive focus:text-destructive">
                Delete card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h4 className="text-sm font-medium mb-3 text-foreground leading-relaxed pr-6">{card.title}</h4>

        {/* Card Metadata */}
        <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {creator && (
              <div className="flex items-center gap-1">
                <span className="truncate max-w-[80px]">{creator.name.split(" ")[0]}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(card.createdAt)}</span>
          </div>
        </div>

        {/* Assigned Users */}
        {card.assignedUsers.length > 0 && (
          <div className="flex -space-x-2 mb-3">
            {card.assignedUsers.slice(0, 4).map((userId) => {
              const user = getUserById(userId)
              return user ? (
                <Avatar key={userId} className="h-6 w-6 border-2 border-background">
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
            {card.assignedUsers.length > 4 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border-2 border-background text-xs font-medium">
                +{card.assignedUsers.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Reactions and Comments */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Reactions */}
          {card.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1" data-velt-reactions={`card-${card.id}`}>
              {card.reactions.map((reaction, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 cursor-pointer hover:bg-accent"
                  data-velt-reaction={reaction.emoji}
                >
                  {reaction.emoji} {reaction.count}
                </Badge>
              ))}
            </div>
          )}

          {/* Comment Count */}
          {card.commentCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs ml-auto flex-shrink-0"
              data-velt-comment-count={`card-${card.id}`}
            >
              💬 {card.commentCount}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Update the DroppableList component to pass onDeleteCard
function DroppableList({
  list,
  users,
  onCardClick,
  onAddCard,
  onDeleteCard,
}: {
  list: List
  users: BoardUser[]
  onCardClick: (cardId: string) => void
  onAddCard: (listId: string, title: string) => void
  onDeleteCard: (cardId: string) => void
}) {
  const [showAddCard, setShowAddCard] = useState(false)
  const { setNodeRef } = useDroppable({
    id: list.id,
  })

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72 sm:w-80" data-velt-target={`list-${list.id}`}>
      <Card className="bg-muted/50">
        <CardContent className="p-3 sm:p-4">
          {/* List Header */}
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-semibold text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded -mx-2 text-sm sm:text-base truncate flex-1 mr-2"
              data-velt-target={`list-title-${list.id}`}
              contentEditable
              suppressContentEditableWarning
            >
              {list.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowAddCard(true)}>Add card</DropdownMenuItem>
                <DropdownMenuItem>Copy list</DropdownMenuItem>
                <DropdownMenuItem>Move list</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete list</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cards */}
          <div className="space-y-3 mb-4 min-h-[100px]">
            {list.cards.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                users={users}
                onCardClick={onCardClick}
                onDeleteCard={onDeleteCard}
              />
            ))}
          </div>

          {/* Add Card Form or Button */}
          {showAddCard ? (
            <AddCardForm listId={list.id} onAddCard={onAddCard} onCancel={() => setShowAddCard(false)} />
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground text-sm"
              onClick={() => setShowAddCard(true)}
              data-velt-target={`add-card-${list.id}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add a card
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Update the main Board component to pass onDeleteCard
export function Board({ board, users, onCardClick, onAddCard, onAddList, onDeleteCard }: BoardProps) {
  const [showAddList, setShowAddList] = useState(false)

  return (
    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 px-1" data-velt-target="board-container">
      {board.lists.map((list) => (
        <DroppableList
          key={list.id}
          list={list}
          users={users}
          onCardClick={onCardClick}
          onAddCard={onAddCard}
          onDeleteCard={onDeleteCard}
        />
      ))}

      {/* Add List Form or Button */}
      {showAddList ? (
        <AddListForm onAddList={onAddList} onCancel={() => setShowAddList(false)} />
      ) : (
        <div className="flex-shrink-0 w-72 sm:w-80">
          <Button
            variant="ghost"
            className="w-full h-12 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground text-sm"
            onClick={() => setShowAddList(true)}
            data-velt-target="add-list"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add another list</span>
            <span className="sm:hidden">Add list</span>
          </Button>
        </div>
      )}
    </div>
  )
}
