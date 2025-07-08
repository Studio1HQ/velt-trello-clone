"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface AddCardFormProps {
  listId: string
  onAddCard: (listId: string, title: string) => void
  onCancel: () => void
}

export function AddCardForm({ listId, onAddCard, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddCard(listId, title.trim())
      setTitle("")
      onCancel()
    }
  }

  return (
    <Card className="bg-card">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this card..."
            autoFocus
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>
              Add card
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
