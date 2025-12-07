"use client"

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { Heart, X, Star, RotateCcw, MapPin, Globe, ChevronDown, Filter, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { ProfileCardDetails } from "@/components/discover/profile-card-details"
import { FilterModal } from "@/components/discover/filter-modal"
import { PremiumModal } from "@/components/premium/premium-modal"
import { getDiscoveryProfiles, swipeProfile } from "@/lib/api"

interface Profile {
  id: number
  name: string
  age: number
  location: string
  distance: string
  origin: string
  languages: string[]
  profession: string
  education: string
  bio: string
  photos: string[]
  verified: boolean
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedCard, setExpandedCard] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showPremium, setShowPremium] = useState(false)
  const [isPremium] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const constraintsRef = useRef(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getDiscoveryProfiles({})
        setProfiles(response.data)
      } catch (err) {
        setError("Impossible de charger les profils")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  const currentProfile = profiles[currentIndex]

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentProfile) return
    try {
      await swipeProfile(currentProfile.id, { direction })
      setSwipeDirection(direction)
      setTimeout(() => {
        if (currentIndex < profiles.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setCurrentIndex(0) // Loop for now
        }
        setSwipeDirection(null)
        setExpandedCard(false)
      }, 300)
    } catch (err) {
      console.error("Erreur lors du swipe:", err)
    }
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x > 0 ? "right" : "left")
    }
  }

  const handleSuperLike = () => {
    if (!isPremium) {
      setShowPremium(true)
      return
    }
    handleSwipe("right")
  }

  const handleRewind = () => {
    if (!isPremium) {
      setShowPremium(true)
      return
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary animate-pulse" />
          <p className="mt-2 text-muted-foreground">Chargement des profils...</p>
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

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 border-2 border-border mx-auto flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Plus de profils pour le moment</h2>
          <p className="text-muted-foreground">Revenez plus tard ou élargissez vos critères de recherche</p>
          <Button onClick={() => setShowFilters(true)}>Modifier les filtres</Button>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6" strokeWidth={1.5} />
            <span className="font-bold text-lg">AfriLove</span>
          </div>
          <div className="flex items-center gap-2">
            {!isPremium && (
              <Button variant="outline" size="sm" onClick={() => setShowPremium(true)} className="gap-1">
                <Crown className="w-4 h-4" />
                Premium
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(true)}>
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 pb-24">
        <div ref={constraintsRef} className="relative w-full max-w-sm aspect-[3/4]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: swipeDirection === "left" ? -300 : swipeDirection === "right" ? 300 : 0,
                rotate: swipeDirection === "left" ? -15 : swipeDirection === "right" ? 15 : 0,
              }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={constraintsRef}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              className={`absolute inset-0 bg-card border border-border cursor-grab active:cursor-grabbing ${
                expandedCard ? "overflow-y-auto" : "overflow-hidden"
              }`}
              onClick={() => setExpandedCard(!expandedCard)}
            >
              {/* Main Photo */}
              <div className="relative h-full">
                <img
                  src={currentProfile.photos[0] || "/placeholder.svg"}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Verified Badge */}
                {currentProfile.verified && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-background text-foreground text-xs font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Vérifié
                  </div>
                )}

                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="space-y-2">
                    <div className="flex items-end gap-2">
                      <h2 className="text-2xl font-bold">
                        {currentProfile.name}, {currentProfile.age}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {currentProfile.location} • {currentProfile.distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Globe className="w-4 h-4" />
                      <span>Origine: {currentProfile.origin}</span>
                    </div>
                    <button
                      className="flex items-center gap-1 text-sm text-white/60 mt-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedCard(!expandedCard)
                      }}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedCard ? "rotate-180" : ""}`} />
                      {expandedCard ? "Moins" : "Plus"} d&apos;infos
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCard && <ProfileCardDetails profile={currentProfile} />}
            </motion.div>
          </AnimatePresence>

          {/* Swipe Indicators */}
          <AnimatePresence>
            {swipeDirection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-1/2 -translate-y-1/2 z-10 ${swipeDirection === "left" ? "right-4" : "left-4"}`}
              >
                <div
                  className={`w-16 h-16 border-4 flex items-center justify-center rotate-12 ${
                    swipeDirection === "left" ? "border-red-500 text-red-500" : "border-green-500 text-green-500"
                  }`}
                >
                  {swipeDirection === "left" ? <X className="w-8 h-8" /> : <Heart className="w-8 h-8" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="outline" size="icon" className="w-12 h-12 border-2 bg-transparent" onClick={handleRewind}>
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-14 h-14 border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent"
            onClick={() => handleSwipe("left")}
          >
            <X className="w-7 h-7" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-14 h-14 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 bg-transparent"
            onClick={handleSuperLike}
          >
            <Star className="w-7 h-7" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-14 h-14 border-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 bg-transparent"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="w-7 h-7" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 border-2 bg-transparent"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </main>

      <BottomNavigation />
      <FilterModal open={showFilters} onClose={() => setShowFilters(false)} />
      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  )
}
