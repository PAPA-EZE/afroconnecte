"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Settings,
  Edit,
  Shield,
  Crown,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Heart,
  ChevronRight,
  LogOut,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { PremiumModal } from "@/components/premium/premium-modal"

export default function ProfilePage() {
  const [showPremium, setShowPremium] = useState(false)
  const [isPremium] = useState(false)

  const user = {
    name: "Mamadou",
    age: 28,
    location: "Paris, France",
    origin: "Sénégal",
    languages: ["Français", "Wolof", "Anglais"],
    profession: "Développeur",
    education: "Master Informatique",
    bio: "Passionné de tech et de culture africaine. J'aime la musique afrobeats, le bon thiéboudienne et les discussions profondes.",
    photos: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    verified: true,
    stats: {
      likes: 45,
      matches: 12,
      superLikes: 3,
    },
  }

  const menuItems = [
    { icon: Edit, label: "Modifier le profil", href: "/profile/edit" },
    { icon: Shield, label: "Vérification du profil", href: "/profile/verify" },
    { icon: Settings, label: "Paramètres", href: "/settings" },
    { icon: Heart, label: "Préférences de rencontre", href: "/settings/preferences" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold">Mon Profil</h1>
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Profile Header */}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Photo */}
            <div className="relative">
              <div className="w-24 h-24 border-2 border-border overflow-hidden">
                <img
                  src={user.photos[0] || "/placeholder.svg"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-foreground text-background flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </button>
              {user.verified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border border-border flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {user.name}, {user.age}
              </h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                {user.origin}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 border border-border">
              <div className="text-2xl font-bold">{user.stats.likes}</div>
              <div className="text-xs text-muted-foreground">Likes reçus</div>
            </div>
            <div className="text-center p-3 border border-border">
              <div className="text-2xl font-bold">{user.stats.matches}</div>
              <div className="text-xs text-muted-foreground">Matchs</div>
            </div>
            <div className="text-center p-3 border border-border">
              <div className="text-2xl font-bold">{user.stats.superLikes}</div>
              <div className="text-xs text-muted-foreground">Super Likes</div>
            </div>
          </div>

          {/* Premium CTA */}
          {!isPremium && (
            <button
              onClick={() => setShowPremium(true)}
              className="w-full mt-4 p-4 border-2 border-dashed border-border flex items-center justify-between hover:border-foreground transition-colors"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">Passer à Premium</div>
                  <div className="text-sm text-muted-foreground">Voir qui vous a liké et plus</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bio & Details */}
        <div className="p-4 border-t border-border space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">À propos</h3>
            <p className="text-sm">{user.bio}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span>{user.profession}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span>{user.education}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{user.languages.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Mes photos</h3>
          <div className="grid grid-cols-3 gap-2">
            {user.photos.map((photo, index) => (
              <div key={index} className="aspect-[3/4] border border-border overflow-hidden">
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {[...Array(6 - user.photos.length)].map((_, index) => (
              <button
                key={`empty-${index}`}
                className="aspect-[3/4] border-2 border-dashed border-border flex items-center justify-center hover:border-foreground transition-colors"
              >
                <Camera className="w-6 h-6 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="border-t border-border">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
          <button className="flex items-center gap-3 p-4 w-full text-red-500 hover:bg-muted/50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  )
}
