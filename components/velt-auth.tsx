"use client"

import { useVeltClient } from '@veltdev/react'
import { useEffect, useState, useRef } from 'react'
import { getOrCreateUser } from '@/lib/user-manager'

export function VeltAuth() {
  const { client } = useVeltClient()
  const [userSwitchTrigger, setUserSwitchTrigger] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const initializationRef = useRef(false)

  useEffect(() => {
    if (!client) return

    const initializeUser = async () => {
      // Prevent multiple simultaneous initializations
      if (initializationRef.current) return
      initializationRef.current = true

      try {
        const user = getOrCreateUser()
        if (!user) return

        // Add a small delay to ensure clean state
        if (userSwitchTrigger > 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        // Identify the user with Velt with forceReset for user switching
        await client.identify(user, { forceReset: userSwitchTrigger > 0 })

        // Set document for this Trello board session
        await client.setDocument('trello-board', {
          documentName: 'Product Development Board'
        })

        setIsInitialized(true)
      } catch (error) {
        console.error('Velt initialization error:', error)
      } finally {
        initializationRef.current = false
      }
    }

    setIsInitialized(false)
    initializeUser()
  }, [client, userSwitchTrigger])

  // Listen for user switch events
  useEffect(() => {
    const handleUserSwitch = () => {
      setUserSwitchTrigger(prev => prev + 1)
    }

    window.addEventListener('velt-user-switch', handleUserSwitch)
    return () => window.removeEventListener('velt-user-switch', handleUserSwitch)
  }, [])

  // Only render after successful initialization
  if (!isInitialized) {
    return null
  }

  return null
}