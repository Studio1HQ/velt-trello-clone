"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface AddListFormProps {
  onAddList: (title: string) => void
  onCancel: () => void
}

export function AddListForm({ onAddList, onCancel }: AddListFormProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddList(title.trim())
      setTitle("")
      onCancel()
    }
  }

  return (
    <div className="flex-shrink-0 w-72 sm:w-80">
      <Card className="bg-muted/50">
        <CardContent className="p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter list title..."
              autoFocus
              className="text-sm font-semibold"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={!title.trim()} className="text-xs sm:text-sm">
                Add list
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-xs sm:text-sm">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
