"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Board } from "@/components/board"
import { CardDetailModal } from "@/components/card-detail-modal"
import { ThemeProvider } from "@/components/theme-provider"
import { VeltAuth } from "@/components/velt-auth"
import { DynamicVeltComments, DynamicVeltCommentsSidebar } from "@/components/velt-comments-dynamic"
import { getOrCreateUser, switchUser } from "@/lib/user-manager"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { Card, CardContent } from "@/components/ui/card"

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "alice@example.com",
    online: true,
  },
  { id: "2", name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32", email: "bob@example.com", online: true },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "carol@example.com",
    online: false,
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "david@example.com",
    online: true,
  },
]

// Update the BoardCard type to include creator and timestamp
type BoardCard = {
  id: string
  title: string
  assignedUsers: string[]
  reactions: { emoji: string; count: number; users: string[] }[]
  commentCount: number
  createdBy: string
  createdAt: string
}

// Update the mock board data to include creator and timestamp information
const mockBoard = {
  id: "board-1",
  title: "Product Development Board",
  lists: [
    {
      id: "list-1",
      title: "To Do",
      cards: [
        {
          id: "card-1",
          title: "Design new landing page",
          assignedUsers: ["1", "2"],
          reactions: [
            { emoji: "👍", count: 3, users: ["1", "2", "3"] },
            { emoji: "❤️", count: 1, users: ["1"] },
          ],
          commentCount: 5,
          createdBy: "1",
          createdAt: "2024-01-14T10:30:00Z",
        },
        {
          id: "card-2",
          title: "Research user feedback",
          assignedUsers: ["3"],
          reactions: [{ emoji: "🎉", count: 2, users: ["2", "4"] }],
          commentCount: 2,
          createdBy: "3",
          createdAt: "2024-01-15T14:20:00Z",
        },
      ],
    },
    {
      id: "list-2",
      title: "In Progress",
      cards: [
        {
          id: "card-3",
          title: "Implement authentication system",
          assignedUsers: ["2", "4"],
          reactions: [
            { emoji: "👍", count: 1, users: ["1"] },
            { emoji: "🔥", count: 2, users: ["2", "3"] },
          ],
          commentCount: 8,
          createdBy: "2",
          createdAt: "2024-01-13T09:15:00Z",
        },
      ],
    },
    {
      id: "list-3",
      title: "Done",
      cards: [
        {
          id: "card-4",
          title: "Set up project repository",
          assignedUsers: ["1"],
          reactions: [{ emoji: "✅", count: 4, users: ["1", "2", "3", "4"] }],
          commentCount: 3,
          createdBy: "1",
          createdAt: "2024-01-12T16:45:00Z",
        },
      ],
    },
  ],
}

const mockComments = [
  {
    id: "comment-1",
    cardId: "card-1",
    userId: "1",
    text: "I think we should focus on mobile-first design for this landing page.",
    timestamp: "2024-01-15T10:30:00Z",
    reactions: [
      { emoji: "👍", count: 2, users: ["2", "3"] },
      { emoji: "💡", count: 1, users: ["2"] },
    ],
  },
  {
    id: "comment-2",
    cardId: "card-1",
    userId: "2",
    text: "Agreed! I'll start with the wireframes this week.",
    timestamp: "2024-01-15T11:15:00Z",
    reactions: [],
  },
  {
    id: "comment-3",
    cardId: "card-1",
    userId: "3",
    text: "Don't forget to include the new brand colors we discussed.",
    timestamp: "2024-01-15T14:20:00Z",
    reactions: [{ emoji: "🎨", count: 1, users: ["1"] }],
  },
]

export default function Home() {
  const [boardData, setBoardData] = useState(mockBoard)
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Initialize user on client side only
  useEffect(() => {
    const user = getOrCreateUser()
    setCurrentUser(user)
  }, [])

  const handleUserSwitch = async () => {
    const newUser = switchUser()
    if (newUser) {
      setCurrentUser(newUser)
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Trigger Velt user switch event
      window.dispatchEvent(new CustomEvent('velt-user-switch'))
    }
  }

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId)
  }

  const handleCloseCardDetail = () => {
    setSelectedCard(null)
  }

  const selectedCardData = selectedCard
    ? boardData.lists.flatMap((list) => list.cards).find((card) => card.id === selectedCard)
    : null

  const selectedCardComments = selectedCard ? mockComments.filter((comment) => comment.cardId === selectedCard) : []

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = boardData.lists.flatMap((list) => list.cards).find((card) => card.id === active.id)
    setActiveCard(card || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeCardId = active.id as string
    const overListId = over.id as string

    setBoardData((prev) => {
      const newBoard = { ...prev }
      let sourceListIndex = -1
      let sourceCardIndex = -1
      let sourceCard: BoardCard | null = null

      // Find source card and list
      for (let i = 0; i < newBoard.lists.length; i++) {
        const cardIndex = newBoard.lists[i].cards.findIndex((card) => card.id === activeCardId)
        if (cardIndex !== -1) {
          sourceListIndex = i
          sourceCardIndex = cardIndex
          sourceCard = newBoard.lists[i].cards[cardIndex]
          break
        }
      }

      if (!sourceCard || sourceListIndex === -1) return prev

      // Remove card from source list
      newBoard.lists[sourceListIndex].cards.splice(sourceCardIndex, 1)

      // Add card to target list
      const targetListIndex = newBoard.lists.findIndex((list) => list.id === overListId)
      if (targetListIndex !== -1) {
        newBoard.lists[targetListIndex].cards.push(sourceCard)
      }

      return newBoard
    })
  }

  // Update the handleAddCard function to include creator and timestamp
  const handleAddCard = (listId: string, title: string) => {
    const newCard: BoardCard = {
      id: `card-${Date.now()}`,
      title,
      assignedUsers: [currentUser?.userId || '1'],
      reactions: [],
      commentCount: 0,
      createdBy: currentUser?.userId || '1',
      createdAt: new Date().toISOString(),
    }

    setBoardData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => (list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list)),
    }))
  }

  const handleDeleteCard = (cardId: string) => {
    setBoardData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => ({
        ...list,
        cards: list.cards.filter((card) => card.id !== cardId),
      })),
    }))
  }

  // Add handleAddList function
  const handleAddList = (title: string) => {
    const newList = {
      id: `list-${Date.now()}`,
      title,
      cards: [],
    }

    setBoardData((prev) => ({
      ...prev,
      lists: [...prev.lists, newList],
    }))
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <VeltAuth />
        <Navbar
          currentUser={currentUser}
          onUserSwitch={handleUserSwitch}
          boardTitle={boardData.title}
        />
        <main className="p-3 sm:p-6">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Board
              board={boardData}
              users={mockUsers}
              onCardClick={handleCardClick}
              onAddCard={handleAddCard}
              onAddList={handleAddList}
              onDeleteCard={handleDeleteCard}
            />
            <DragOverlay>
              {activeCard ? (
                <div className="w-72 sm:w-80 opacity-50">
                  <Card className="cursor-grabbing shadow-lg bg-card">
                    <CardContent className="p-3">
                      <h4 className="text-sm font-medium text-foreground">{activeCard.title}</h4>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>

        {selectedCard && selectedCardData && (
          <CardDetailModal
            card={selectedCardData}
            comments={selectedCardComments}
            users={mockUsers}
            currentUser={currentUser}
            onClose={handleCloseCardDetail}
          />
        )}

        {/* Velt Comments Components */}
        <DynamicVeltComments popoverMode={true} />
        <DynamicVeltCommentsSidebar />
      </div>
    </ThemeProvider>
  )
}
