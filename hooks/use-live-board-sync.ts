"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSetLiveStateData, useLiveStateData } from '@veltdev/react'

export type BoardCard = {
  id: string
  title: string
  assignedUsers: string[]
  reactions: { emoji: string; count: number; users: string[] }[]
  commentCount: number
  createdBy: string
  createdAt: string
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

  // Card operations
  const addCard = useCallback((listId: string, title: string, currentUser: any) => {
    const newCard: BoardCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      assignedUsers: [currentUser?.userId || '1'],
      reactions: [],
      commentCount: 0,
      createdBy: currentUser?.userId || '1',
      createdAt: new Date().toISOString(),
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
      id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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