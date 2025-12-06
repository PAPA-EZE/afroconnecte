"use client"

import { useState } from "react"
import { MapPin, Calendar, Users, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"

interface Event {
  id: number
  title: string
  description: string
  image: string
  date: string
  time: string
  location: string
  attendees: number
  category: string
}

const events: Event[] = [
  {
    id: 1,
    title: "AfroBeats Night Paris",
    description: "Une soirée dédiée aux meilleurs sons afrobeats avec DJ Spinall",
    image: "/placeholder.svg?height=200&width=400",
    date: "15 Déc 2025",
    time: "22:00",
    location: "Le Flow, Paris",
    attendees: 234,
    category: "Musique",
  },
  {
    id: 2,
    title: "Festival de la Gastronomie Africaine",
    description: "Découvrez les saveurs de tout le continent avec nos chefs",
    image: "/placeholder.svg?height=200&width=400",
    date: "20 Déc 2025",
    time: "12:00",
    location: "Parc de la Villette, Paris",
    attendees: 567,
    category: "Cuisine",
  },
  {
    id: 3,
    title: "Networking Diaspora Tech",
    description: "Rencontrez des professionnels tech de la diaspora africaine",
    image: "/placeholder.svg?height=200&width=400",
    date: "22 Déc 2025",
    time: "19:00",
    location: "Station F, Paris",
    attendees: 89,
    category: "Networking",
  },
  {
    id: 4,
    title: "Projection Film Africain",
    description: "Découvrez le nouveau cinéma africain avec 'Atlantique'",
    image: "/placeholder.svg?height=200&width=400",
    date: "28 Déc 2025",
    time: "20:00",
    location: "MK2 Bibliothèque, Paris",
    attendees: 156,
    category: "Culture",
  },
]

const categories = ["Tous", "Musique", "Cuisine", "Networking", "Culture", "Sport"]

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [interestedEvents, setInterestedEvents] = useState<number[]>([])

  const filteredEvents = selectedCategory === "Tous" ? events : events.filter((e) => e.category === selectedCategory)

  const toggleInterest = (eventId: number) => {
    setInterestedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">Culture Connect</h1>
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Événements culturels près de vous</p>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-sm whitespace-nowrap border transition-colors ${
                  selectedCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Events List */}
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="border border-border overflow-hidden group">
            {/* Image */}
            <div className="aspect-video relative">
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2 py-1 bg-background text-xs font-medium">{event.category}</div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h2 className="font-bold text-lg">{event.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {event.date} à {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} intéressés</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant={interestedEvents.includes(event.id) ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => toggleInterest(event.id)}
                >
                  {interestedEvents.includes(event.id) ? "Intéressé ✓" : "Je suis intéressé"}
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  )
}
