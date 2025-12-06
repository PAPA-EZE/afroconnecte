"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"

export default function OnboardingBasicsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    birthDate: "",
    gender: "",
    lookingFor: "",
  })

  const genders = [
    { id: "homme", label: "Homme" },
    { id: "femme", label: "Femme" },
    { id: "autre", label: "Autre" },
  ]

  const lookingForOptions = [
    { id: "femme", label: "Femmes" },
    { id: "homme", label: "Hommes" },
    { id: "tous", label: "Tout le monde" },
  ]

  const canContinue = formData.birthDate && formData.gender && formData.lookingFor

  return (
    <OnboardingLayout step={2} totalSteps={4} title="Informations de base" subtitle="Parlez-nous un peu de vous">
      <div className="space-y-6">
        {/* Birth Date */}
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="birthDate"
              type="date"
              className="pl-10 h-12"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">Vous devez avoir au moins 18 ans</p>
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <Label>Je suis</Label>
          <div className="grid grid-cols-3 gap-3">
            {genders.map((gender) => (
              <button
                key={gender.id}
                type="button"
                onClick={() => setFormData({ ...formData, gender: gender.id })}
                className={`h-12 border text-sm font-medium transition-colors ${
                  formData.gender === gender.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {gender.label}
              </button>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div className="space-y-3">
          <Label>Je recherche</Label>
          <div className="grid grid-cols-3 gap-3">
            {lookingForOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFormData({ ...formData, lookingFor: option.id })}
                className={`h-12 border text-sm font-medium transition-colors ${
                  formData.lookingFor === option.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <Button variant="outline" className="h-12 bg-transparent" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button className="flex-1 h-12" disabled={!canContinue} onClick={() => router.push("/onboarding/culture")}>
          Continuer
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </OnboardingLayout>
  )
}
