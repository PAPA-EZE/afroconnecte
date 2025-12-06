"use client"

import { useState } from "react"
import { X, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface FilterModalProps {
  open: boolean
  onClose: () => void
}

const origins = [
  "Tous",
  "Sénégal",
  "Nigeria",
  "Cameroun",
  "Côte d'Ivoire",
  "Mali",
  "Ghana",
  "RD Congo",
  "Maroc",
  "Algérie",
  "Éthiopie",
  "Kenya",
]

const intentions = [
  { id: "all", label: "Toutes" },
  { id: "serious", label: "Relation sérieuse" },
  { id: "casual", label: "Amicale" },
  { id: "networking", label: "Professionnelle" },
]

export function FilterModal({ open, onClose }: FilterModalProps) {
  const [isPremium] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: [20, 35],
    distance: 50,
    origin: "Tous",
    intention: "all",
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-background w-full max-w-md max-h-[90vh] overflow-y-auto sm:rounded-lg">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filtres</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Age Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tranche d&apos;âge</Label>
              <span className="text-sm text-muted-foreground">
                {filters.ageRange[0]} - {filters.ageRange[1]} ans
              </span>
            </div>
            <Slider
              value={filters.ageRange}
              onValueChange={(value) => setFilters({ ...filters, ageRange: value })}
              min={18}
              max={60}
              step={1}
            />
          </div>

          {/* Distance */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Distance maximale</Label>
              <span className="text-sm text-muted-foreground">{filters.distance} km</span>
            </div>
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => setFilters({ ...filters, distance: value[0] })}
              min={5}
              max={200}
              step={5}
            />
          </div>

          {/* Origin - Premium */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Pays d&apos;origine</Label>
              {!isPremium && (
                <span className="text-xs px-2 py-0.5 bg-muted flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {origins.slice(0, isPremium ? undefined : 4).map((origin) => (
                <button
                  key={origin}
                  onClick={() => setFilters({ ...filters, origin })}
                  disabled={!isPremium && origin !== "Tous"}
                  className={`px-3 py-1.5 text-sm border transition-colors ${
                    filters.origin === origin
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:border-foreground"
                  } ${!isPremium && origin !== "Tous" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {origin}
                </button>
              ))}
              {!isPremium && (
                <button className="px-3 py-1.5 text-sm border border-dashed border-border text-muted-foreground">
                  + {origins.length - 4} autres
                </button>
              )}
            </div>
          </div>

          {/* Intention - Premium */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Type de relation</Label>
              {!isPremium && (
                <span className="text-xs px-2 py-0.5 bg-muted flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <div className="space-y-2">
              {intentions.map((intention) => (
                <button
                  key={intention.id}
                  onClick={() => setFilters({ ...filters, intention: intention.id })}
                  disabled={!isPremium && intention.id !== "all"}
                  className={`w-full p-3 text-left text-sm border transition-colors ${
                    filters.intention === intention.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:border-foreground"
                  } ${!isPremium && intention.id !== "all" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {intention.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 space-y-3">
          <Button className="w-full h-12" onClick={onClose}>
            Appliquer les filtres
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() =>
              setFilters({
                ageRange: [20, 35],
                distance: 50,
                origin: "Tous",
                intention: "all",
              })
            }
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  )
}
