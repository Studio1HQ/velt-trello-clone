"use client"

import { useVeltClient } from '@veltdev/react'
import { useEffect, useState, useRef } from 'react'
import { getOrCreateUser, getAvailableUsers } from '@/lib/user-manager'
import { useTheme } from '@/components/theme-provider'

export function VeltAuth() {
  const { client } = useVeltClient()
  const { theme } = useTheme()
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

        // Set up user contacts for mentions - only our two hardcoded users
        const availableUsers = getAvailableUsers()
        const userContacts = availableUsers.map(u => ({
          userId: u.userId,
          name: u.name,
          email: u.email,
          photoUrl: u.photoUrl
        }))

        await client.setUserContacts(userContacts)

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

  // Handle theme changes
  useEffect(() => {
    if (!client || !isInitialized) return

    // Set dark mode on the Velt client
    client.setDarkMode(theme === 'dark')
  }, [client, theme, isInitialized])

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