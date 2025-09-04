"use client"
import { Moon, Sun, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { DynamicVeltPresence } from "./velt-presence-dynamic"
import { DynamicVeltSidebarButton } from "./velt-comments-dynamic"
import { DynamicVeltNotificationsTool } from "./velt-notifications-dynamic"
import { getAvailableUsers } from "@/lib/user-manager"
import { useEffect, useState } from "react"

interface NavbarProps {
  currentUser: any
  onUserSwitch: () => void
  boardTitle: string
}

export function Navbar({ currentUser, onUserSwitch, boardTitle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const [availableUsers, setAvailableUsers] = useState<any[]>([])

  useEffect(() => {
    const users = getAvailableUsers()
    setAvailableUsers(users)
  }, [currentUser])

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        {/* Left section - Board title and Add List */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <h1
            className="text-base sm:text-xl font-semibold text-foreground truncate max-w-[120px] sm:max-w-none"
            data-velt-target="board-title"
            title={boardTitle}
          >
            {boardTitle}
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 hidden xs:flex"
            data-velt-target="add-list-btn"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add List</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Right section - Presence, Theme, User */}
        <div className="flex items-center gap-4">
          {/* Velt Presence Component */}
          <div className="flex items-center justify-center h-9">
            <DynamicVeltPresence />
          </div>

          {/* Notifications */}
          <div className="hidden sm:flex items-center justify-center h-9 w-9">
            <DynamicVeltNotificationsTool />
          </div>

          {/* Comments Sidebar */}
          <div className="hidden sm:flex items-center justify-center h-9 w-9">
            <DynamicVeltSidebarButton />
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Switcher */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 px-2 flex items-center space-x-2"
                  data-velt-target="user-switcher"
                >
                  <Avatar className="h-7 w-7 relative">
                    <AvatarImage src={currentUser.photoUrl || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback className="text-xs">
                      {currentUser.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">User Switching</p>
                  <p className="text-xs text-muted-foreground">Switch between users</p>
                </div>
                <DropdownMenuSeparator />
                
                {/* Current User */}
                <div className="px-2 py-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Current User</p>
                </div>
                <DropdownMenuItem className="flex items-center space-x-3 p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.photoUrl || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback className="text-xs">
                      {currentUser.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground hidden sm:inline">Active</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                {/* Switch to Another User */}
                <div className="px-2 py-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Switch User</p>
                </div>
                {availableUsers.length > 1 && availableUsers
                  .filter(user => user.userId !== currentUser.userId)
                  .map(user => (
                    <DropdownMenuItem 
                      key={user.userId}
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-accent"
                      onClick={onUserSwitch}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="h-2 w-2 rounded-full bg-gray-400" />
                        <span className="text-xs text-muted-foreground hidden sm:inline">Switch</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}
