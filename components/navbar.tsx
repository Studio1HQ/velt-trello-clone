"use client"
import { Moon, Sun, Plus, Users } from "lucide-react"
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

interface User {
  id: string
  name: string
  avatar: string
  email: string
  online: boolean
}

interface NavbarProps {
  currentUser: User
  users: User[]
  onUserSwitch: (userId: string) => void
  boardTitle: string
}

export function Navbar({ currentUser, users, onUserSwitch, boardTitle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const onlineUsers = users.filter((user) => user.online)

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground" data-velt-target="board-title">
            {boardTitle}
          </h1>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" data-velt-target="add-list-btn">
            <Plus className="h-4 w-4" />
            Add List
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Online Users Presence */}
          <div className="flex items-center gap-2" data-velt-presence="online-users">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 4).map((user) => (
                <div key={user.id} className="relative">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
              ))}
              {onlineUsers.length > 4 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border-2 border-background text-xs font-medium">
                  +{onlineUsers.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-velt-target="user-switcher">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {users
                .filter((user) => user.id !== currentUser.id)
                .map((user) => (
                  <DropdownMenuItem key={user.id} onClick={() => onUserSwitch(user.id)} className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    {user.online && <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
