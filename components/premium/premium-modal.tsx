"use client"

import { X, Crown, Heart, Eye, RotateCcw, Filter, Zap, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PremiumModalProps {
  open: boolean
  onClose: () => void
}

const features = [
  { icon: Eye, title: "Voir qui vous a liké", description: "Accédez à la liste complète" },
  { icon: Heart, title: "Likes illimités", description: "Plus de limite quotidienne" },
  { icon: RotateCcw, title: "Rewind", description: "Annulez votre dernier swipe" },
  { icon: Filter, title: "Filtres avancés", description: "Par origine, ethnie, intention" },
  { icon: Zap, title: "5 Super Likes/jour", description: "Montrez votre intérêt" },
]

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-md max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-border">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <div className="w-16 h-16 border-2 border-foreground mx-auto flex items-center justify-center mb-4">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">AfriLove Premium</h2>
          <p className="text-muted-foreground mt-2">Débloquez toutes les fonctionnalités</p>
        </div>

        {/* Features */}
        <div className="p-6 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="p-6 border-t border-border space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border-2 border-border text-center hover:border-foreground transition-colors">
              <div className="text-2xl font-bold">9,99€</div>
              <div className="text-sm text-muted-foreground">par mois</div>
            </button>
            <button className="p-4 border-2 border-foreground bg-foreground text-background text-center relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-foreground text-background text-xs">
                Populaire
              </div>
              <div className="text-2xl font-bold">49,99€</div>
              <div className="text-sm opacity-80">6 mois (8,33€/mois)</div>
            </button>
          </div>

          <Button className="w-full h-12">
            <Check className="w-5 h-5 mr-2" />
            Passer à Premium
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Annulez à tout moment. Conditions générales applicables.
          </p>
        </div>
      </div>
    </div>
  )
}
