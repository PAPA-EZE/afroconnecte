"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"

const countries = [
  { id: "senegal", name: "Sénégal", flag: "🇸🇳", region: "Afrique de l'Ouest" },
  { id: "nigeria", name: "Nigeria", flag: "🇳🇬", region: "Afrique de l'Ouest" },
  { id: "cameroun", name: "Cameroun", flag: "🇨🇲", region: "Afrique Centrale" },
  { id: "cote-ivoire", name: "Côte d'Ivoire", flag: "🇨🇮", region: "Afrique de l'Ouest" },
  { id: "congo", name: "RD Congo", flag: "🇨🇩", region: "Afrique Centrale" },
  { id: "mali", name: "Mali", flag: "🇲🇱", region: "Afrique de l'Ouest" },
  { id: "ghana", name: "Ghana", flag: "🇬🇭", region: "Afrique de l'Ouest" },
  { id: "maroc", name: "Maroc", flag: "🇲🇦", region: "Afrique du Nord" },
  { id: "algerie", name: "Algérie", flag: "🇩🇿", region: "Afrique du Nord" },
  { id: "ethiopie", name: "Éthiopie", flag: "🇪🇹", region: "Afrique de l'Est" },
  { id: "kenya", name: "Kenya", flag: "🇰🇪", region: "Afrique de l'Est" },
  { id: "afrique-sud", name: "Afrique du Sud", flag: "🇿🇦", region: "Afrique Australe" },
]

const languages = [
  "Français",
  "Anglais",
  "Wolof",
  "Bambara",
  "Lingala",
  "Swahili",
  "Haoussa",
  "Yoruba",
  "Igbo",
  "Arabe",
  "Amharique",
  "Portugais",
]

export default function OnboardingCulturePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    country: "",
    languages: [] as string[],
  })

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.region.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang) ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang],
    }))
  }

  const canContinue = formData.country && formData.languages.length > 0

  return (
    <OnboardingLayout step={3} totalSteps={4} title="Vos origines" subtitle="Partagez votre héritage culturel">
      <div className="space-y-6">
        {/* Country Selection */}
        <div className="space-y-3">
          <Label>Pays ou région d&apos;origine</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un pays..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.id}
                type="button"
                onClick={() => setFormData({ ...formData, country: country.id })}
                className={`flex items-center gap-2 p-3 border text-left text-sm transition-colors ${
                  formData.country === country.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="truncate">{country.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label>Langues parlées</Label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-4 py-2 border text-sm transition-colors ${
                  formData.languages.includes(lang)
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {lang}
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
        <Button className="flex-1 h-12" disabled={!canContinue} onClick={() => router.push("/onboarding/photos")}>
          Continuer
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </OnboardingLayout>
  )
}
