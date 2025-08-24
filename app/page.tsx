"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Board } from "@/components/board"
import { CardDetailModal } from "@/components/card-detail-modal"
import { ThemeProvider } from "@/components/theme-provider"
import { VeltAuth } from "@/components/velt-auth"
import { DynamicVeltComments, DynamicVeltCommentsSidebar } from "@/components/velt-comments-dynamic"
import { getOrCreateUser, switchUser } from "@/lib/user-manager"
import { useLiveBoardSync, type BoardCard } from "@/hooks/use-live-board-sync"
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

// Mock data - matching Velt user system
const mockUsers = [
  {
    id: "user_alice_johnson",
    name: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user_alice_johnson",
    email: "alice@example.com",
    online: true,
  },
  { 
    id: "user_bob_smith", 
    name: "Bob Smith", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user_bob_smith", 
    email: "bob@example.com", 
    online: true 
  },
]



export default function Home() {
  const { boardData, isInitialized, addCard, deleteCard, moveCard, addList } = useLiveBoardSync()
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

    // Use the live sync move card function
    moveCard(activeCardId, overListId)
  }

  const handleAddCard = (listId: string, title: string) => {
    addCard(listId, title, currentUser)
  }

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId)
  }

  const handleAddList = (title: string) => {
    addList(title)
  }

  // Don't render until live sync is initialized
  if (!isInitialized) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </ThemeProvider>
    )
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
            users={mockUsers}
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
