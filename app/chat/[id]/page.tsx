"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, MoreVertical, Send, Mic, ImageIcon, Smile, Check, CheckCheck, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  text: string
  sender: "me" | "them"
  timestamp: string
  read?: boolean
}

const mockMessages: Message[] = [
  { id: 1, text: "Salut ! J'ai vu que tu viens aussi du Sénégal 🇸🇳", sender: "them", timestamp: "14:20" },
  { id: 2, text: "Oui ! De Dakar, et toi ?", sender: "me", timestamp: "14:22", read: true },
  { id: 3, text: "Saint-Louis ! Tu y es allée ?", sender: "them", timestamp: "14:25" },
  {
    id: 4,
    text: "Oui, c'est magnifique ! J'adore l'île et le pont Faidherbe",
    sender: "me",
    timestamp: "14:28",
    read: true,
  },
  { id: 5, text: "C'est ma ville natale 😊 Tu aimes le thiéboudienne ?", sender: "them", timestamp: "14:30" },
]

const iceBreakers = [
  "Quel est ton plat africain préféré ?",
  "Tu es de quelle ethnie/tribu ?",
  "Quelle musique africaine écoutes-tu ?",
]

export default function ChatPage() {
  const params = useParams()
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [showIceBreakers, setShowIceBreakers] = useState(messages.length === 0)
  const [isPremium] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const matchProfile = {
    id: params.id,
    name: "Aisha",
    photo: "/placeholder.svg?height=100&width=100",
    online: true,
    origin: "Sénégal",
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const newMsg: Message = {
      id: messages.length + 1,
      text: text.trim(),
      sender: "me",
      timestamp: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    }
    setMessages([...messages, newMsg])
    setNewMessage("")
    setShowIceBreakers(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(newMessage)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/matches">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Link href={`/profile/${matchProfile.id}`} className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 border border-border overflow-hidden">
                <img
                  src={matchProfile.photo || "/placeholder.svg"}
                  alt={matchProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {matchProfile.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background" />
              )}
            </div>
            <div>
              <h1 className="font-medium">{matchProfile.name}</h1>
              <p className="text-xs text-muted-foreground">
                {matchProfile.online ? "En ligne" : "Hors ligne"} • {matchProfile.origin}
              </p>
            </div>
          </Link>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Match Info */}
        <div className="text-center py-4">
          <div className="w-20 h-20 border border-border mx-auto overflow-hidden mb-3">
            <img
              src={matchProfile.photo || "/placeholder.svg"}
              alt={matchProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-muted-foreground">Vous avez matché avec {matchProfile.name}</p>
        </div>

        {/* Ice Breakers */}
        {showIceBreakers && (
          <div className="space-y-2">
            <p className="text-xs text-center text-muted-foreground">Briseurs de glace</p>
            {iceBreakers.map((breaker, index) => (
              <button
                key={index}
                onClick={() => sendMessage(breaker)}
                className="w-full p-3 text-left text-sm border border-border hover:bg-muted transition-colors"
              >
                {breaker}
              </button>
            ))}
          </div>
        )}

        {/* Messages List */}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 ${
                message.sender === "me" ? "bg-foreground text-background" : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${message.sender === "me" ? "justify-end" : ""}`}>
                <span className={`text-xs ${message.sender === "me" ? "text-background/60" : "text-muted-foreground"}`}>
                  {message.timestamp}
                </span>
                {message.sender === "me" &&
                  (isPremium ? (
                    message.read ? (
                      <CheckCheck className="w-3 h-3 text-background/60" />
                    ) : (
                      <Check className="w-3 h-3 text-background/60" />
                    )
                  ) : null)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg mx-auto">
          <Button type="button" variant="ghost" size="icon">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Écrivez un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          {newMessage ? (
            <Button type="submit" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="icon">
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>

        {/* Premium Read Status Hint */}
        {!isPremium && (
          <button className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2 w-full hover:text-foreground">
            <Crown className="w-3 h-3" />
            Passez Premium pour voir le statut de lecture
          </button>
        )}
      </div>
    </div>
  )
}
