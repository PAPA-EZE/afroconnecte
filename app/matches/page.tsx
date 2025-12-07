"use client"

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Crown, Heart, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { PremiumModal } from "@/components/premium/premium-modal"
import { getMatches } from "@/lib/api"

interface Match {
  id: number
  name: string
  photo: string
  lastMessage?: string
  timestamp?: string
  unread?: boolean
  online?: boolean
}

const likesPreview = [
  { id: 1, photo: "/blurred-portrait-1.jpg" },
  { id: 2, photo: "/blurred-portrait-2.jpg" },
  { id: 3, photo: "/blurred-portrait-3.jpg" },
]

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showPremium, setShowPremium] = useState(false)
  const [isPremium] = useState(false)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getMatches()
        setMatches(response.data)
      } catch (err) {
        setError("Impossible de charger les matchs")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMatches()
  }, [])

  const newMatches = matches.filter((m) => !m.lastMessage)
  const conversations = matches.filter((m) => m.lastMessage)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary animate-pulse" />
          <p className="mt-2 text-muted-foreground">Chargement des matchs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">Messages</h1>
            {!isPremium && (
              <button
                onClick={() => setShowPremium(true)}
                className="flex items-center gap-1 text-sm px-2 py-1 border border-border hover:border-foreground transition-colors"
              >
                <Crown className="w-4 h-4" />
                Premium
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Likes Preview - Premium Feature */}
        {!isPremium && (
          <button
            onClick={() => setShowPremium(true)}
            className="w-full p-4 border-b border-border flex items-center gap-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex -space-x-3">
              {likesPreview.map((like) => (
                <div key={like.id} className="w-12 h-12 border-2 border-background overflow-hidden">
                  <img src={like.photo || "/placeholder.svg"} alt="" className="w-full h-full object-cover blur-sm" />
                </div>
              ))}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium flex items-center gap-2">
                <Heart className="w-4 h-4" />
                12 personnes vous ont liké
              </div>
              <p className="text-sm text-muted-foreground">Passez Premium pour les voir</p>
            </div>
            <Crown className="w-5 h-5 text-muted-foreground" />
          </button>
        )}

        {/* New Matches */}
        {newMatches.length > 0 && (
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Nouveaux matchs</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {newMatches.map((match) => (
                <Link key={match.id} href={`/chat/${match.id}`} className="flex-shrink-0 text-center group">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-border overflow-hidden group-hover:border-foreground transition-colors">
                      <img
                        src={match.photo || "/placeholder.svg"}
                        alt={match.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {match.online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <span className="text-xs mt-1 block truncate w-16">{match.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Conversations */}
        <div className="divide-y divide-border">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 border-2 border-border mx-auto flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Pas encore de conversation</h3>
              <p className="text-sm text-muted-foreground">Commencez à swiper pour trouver des matchs !</p>
            </div>
          ) : (
            conversations.map((convo) => (
              <Link
                key={convo.id}
                href={`/chat/${convo.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 border border-border overflow-hidden">
                    <img
                      src={convo.photo || "/placeholder.svg"}
                      alt={convo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {convo.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${convo.unread ? "" : "text-muted-foreground"}`}>{convo.name}</h3>
                    <span className="text-xs text-muted-foreground">{convo.timestamp}</span>
                  </div>
                  <p className={`text-sm truncate ${convo.unread ? "font-medium" : "text-muted-foreground"}`}>
                    {convo.lastMessage}
                  </p>
                </div>
                {convo.unread && <div className="w-2 h-2 bg-foreground flex-shrink-0" />}
              </Link>
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  )
}
