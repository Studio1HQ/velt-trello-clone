"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSetLiveStateData, useLiveStateData } from '@veltdev/react'

export type BoardCard = {
  id: string
  title: string
  description?: string
  assignedUsers: string[]
  reactions: { emoji: string; count: number; users: string[] }[]
  commentCount: number
  createdBy: string
  createdAt: string
  labels?: { color: string; name: string }[]
}

export type List = {
  id: string
  title: string
  cards: BoardCard[]
}

export type BoardData = {
  id: string
  title: string
  lists: List[]
}

const BOARD_SYNC_ID = 'trello-board-data'

const initialBoardData: BoardData = {
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
          description: "Create a modern, responsive landing page that showcases our product features and converts visitors into users.",
          assignedUsers: ["user_bob_smith"],
          reactions: [
            { emoji: "👍", count: 3, users: ["user_alice_johnson", "user_bob_smith"] },
            { emoji: "❤️", count: 1, users: ["user_alice_johnson"] },
          ],
          commentCount: 0,
          createdBy: "user_alice_johnson",
          createdAt: "2024-01-14T10:30:00Z",
          labels: [
            { color: "bg-green-500", name: "Design" },
            { color: "bg-blue-500", name: "Frontend" }
          ]
        },
        {
          id: "card-2",
          title: "Research user feedback",
          description: "Analyze customer surveys and interviews to identify pain points and improvement opportunities.",
          assignedUsers: ["user_alice_johnson"],
          reactions: [{ emoji: "🎉", count: 2, users: ["user_bob_smith"] }],
          commentCount: 0,
          createdBy: "user_bob_smith",
          createdAt: "2024-01-15T14:20:00Z",
          labels: [
            { color: "bg-purple-500", name: "Research" }
          ]
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
          description: "Build secure user authentication with JWT tokens, password reset functionality, and social login options.",
          assignedUsers: ["user_alice_johnson"],
          reactions: [
            { emoji: "👍", count: 1, users: ["user_alice_johnson"] },
            { emoji: "🔥", count: 2, users: ["user_bob_smith"] },
          ],
          commentCount: 0,
          createdBy: "user_bob_smith",
          createdAt: "2024-01-13T09:15:00Z",
          labels: [
            { color: "bg-red-500", name: "Backend" },
            { color: "bg-yellow-500", name: "Security" }
          ]
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
          description: "Initialize Git repository, set up CI/CD pipeline, configure development environment and documentation.",
          assignedUsers: ["user_bob_smith"],
          reactions: [{ emoji: "✅", count: 4, users: ["user_alice_johnson", "user_bob_smith"] }],
          commentCount: 0,
          createdBy: "user_alice_johnson",
          createdAt: "2024-01-12T16:45:00Z",
          labels: [
            { color: "bg-gray-500", name: "DevOps" }
          ]
        },
      ],
    },
  ],
}

export function useLiveBoardSync() {
  const [localBoardData, setLocalBoardData] = useState<BoardData>(initialBoardData)
  const [isInitialized, setIsInitialized] = useState(false)

  // Get live state data from Velt
  const syncedBoardData = useLiveStateData(BOARD_SYNC_ID, {
    listenToNewChangesOnly: false
  })

  // Set live state data to Velt
  useSetLiveStateData(BOARD_SYNC_ID, localBoardData, { merge: false })

  // Initialize with synced data if available
  useEffect(() => {
    if (!isInitialized && syncedBoardData && Object.keys(syncedBoardData).length > 0) {
      setLocalBoardData(syncedBoardData as BoardData)
      setIsInitialized(true)
    } else if (!isInitialized) {
      // If no synced data exists, use initial data and mark as initialized
      setIsInitialized(true)
    }
  }, [syncedBoardData, isInitialized])

  // Update local state when synced data changes
  useEffect(() => {
    if (isInitialized && syncedBoardData && Object.keys(syncedBoardData).length > 0) {
      const newData = syncedBoardData as BoardData
      // Only update if the data is actually different to prevent unnecessary re-renders
      if (JSON.stringify(newData) !== JSON.stringify(localBoardData)) {
        setLocalBoardData(newData)
      }
    }
  }, [syncedBoardData, isInitialized, localBoardData])

  // Helper function to update board data
  const updateBoardData = useCallback((updater: (prev: BoardData) => BoardData) => {
    setLocalBoardData(prev => {
      const newData = updater(prev)
      return newData
    })
  }, [])

  // Random descriptions with emojis
  const getRandomDescription = () => {
    const descriptions = [
      "🚀 Let's tackle this challenge with enthusiasm and creativity!",
      "💡 This task requires innovative thinking and careful planning.",
      "🎯 Focus on delivering high-quality results that exceed expectations.",
      "⚡ Time to bring our A-game and make this happen efficiently.",
      "🔥 This is going to be an exciting feature to work on!",
      "🌟 Another opportunity to showcase our amazing skills.",
      "🎨 Let's create something beautiful and functional.",
      "⚙️ Technical excellence is the goal for this implementation.",
      "🏆 Ready to deliver outstanding results on this task.",
      "💪 Challenging but definitely achievable with the right approach."
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  // Random labels
  const getRandomLabels = () => {
    const allLabels = [
      { color: "bg-green-500", name: "Feature" },
      { color: "bg-blue-500", name: "Frontend" },
      { color: "bg-red-500", name: "Backend" },
      { color: "bg-purple-500", name: "Research" },
      { color: "bg-yellow-500", name: "Bug Fix" },
      { color: "bg-pink-500", name: "UI/UX" },
      { color: "bg-indigo-500", name: "API" },
      { color: "bg-gray-500", name: "DevOps" },
      { color: "bg-orange-500", name: "Testing" },
      { color: "bg-teal-500", name: "Documentation" }
    ]
    
    // Return 1-2 random labels
    const numLabels = Math.floor(Math.random() * 2) + 1
    const shuffled = allLabels.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numLabels)
  }

  // Card operations
  const addCard = useCallback((listId: string, title: string, currentUser: any) => {
    // Assign to the other user (if current user is Alice, assign to Bob and vice versa)
    const otherUserId = currentUser?.userId === 'user_alice_johnson' ? 'user_bob_smith' : 'user_alice_johnson'
    
    const newCard: BoardCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title,
      description: getRandomDescription(),
      assignedUsers: [otherUserId],
      reactions: [],
      commentCount: 0,
      createdBy: currentUser?.userId || 'user_alice_johnson',
      createdAt: new Date().toISOString(),
      labels: getRandomLabels()
    }

    updateBoardData(prev => ({
      ...prev,
      lists: prev.lists.map(list => 
        list.id === listId 
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    }))
  }, [updateBoardData])

  const deleteCard = useCallback((cardId: string) => {
    updateBoardData(prev => ({
      ...prev,
      lists: prev.lists.map(list => ({
        ...list,
        cards: list.cards.filter(card => card.id !== cardId)
      }))
    }))
  }, [updateBoardData])

  const moveCard = useCallback((cardId: string, targetListId: string) => {
    updateBoardData(prev => {
      let sourceCard: BoardCard | null = null
      
      // Find and remove the card from its current list
      const listsWithoutCard = prev.lists.map(list => {
        const cardIndex = list.cards.findIndex(card => card.id === cardId)
        if (cardIndex !== -1) {
          sourceCard = list.cards[cardIndex]
          return {
            ...list,
            cards: list.cards.filter((_, index) => index !== cardIndex)
          }
        }
        return list
      })

      // Add the card to the target list
      if (sourceCard) {
        return {
          ...prev,
          lists: listsWithoutCard.map(list => 
            list.id === targetListId 
              ? { ...list, cards: [...list.cards, sourceCard!] }
              : list
          )
        }
      }

      return prev
    })
  }, [updateBoardData])

  const addList = useCallback((title: string) => {
    const newList: List = {
      id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title,
      cards: []
    }

    updateBoardData(prev => ({
      ...prev,
      lists: [...prev.lists, newList]
    }))
  }, [updateBoardData])

  return {
    boardData: localBoardData,
    isInitialized,
    addCard,
    deleteCard,
    moveCard,
    addList,
    updateBoardData
  }
}