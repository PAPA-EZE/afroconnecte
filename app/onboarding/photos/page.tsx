"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Plus, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"

export default function OnboardingPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<string[]>([])

  const addPhoto = () => {
    // Simulate adding a photo
    const placeholders = [
      "/smiling-african-man-portrait.png",
      "/african-woman-portrait-elegant.jpg",
      "/person-travel-photo-africa.jpg",
      "/person-casual-photo-outdoor.jpg",
      "/professional-headshot.png",
      "/person-lifestyle-photo.jpg",
    ]
    if (photos.length < 6) {
      setPhotos([...photos, placeholders[photos.length]])
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const canContinue = photos.length >= 2

  return (
    <OnboardingLayout
      step={4}
      totalSteps={4}
      title="Vos photos"
      subtitle="Ajoutez au moins 2 photos pour compléter votre profil"
    >
      <div className="space-y-6">
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`aspect-[3/4] border-2 border-dashed relative ${index === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              {photos[index] ? (
                <>
                  <img
                    src={photos[index] || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-background border border-border flex items-center justify-center hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-foreground text-background text-xs">
                      Photo principale
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={addPhoto}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  {index === 0 && <span className="text-xs">Photo principale</span>}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="p-4 border border-border space-y-2">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            <span className="font-medium text-sm">Conseils photos</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Montrez clairement votre visage</li>
            <li>• Évitez les photos de groupe</li>
            <li>• Variez les types de photos (portrait, voyage, loisirs)</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <Button variant="outline" className="h-12 bg-transparent" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button className="flex-1 h-12" disabled={!canContinue} onClick={() => router.push("/discover")}>
          Terminer
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </OnboardingLayout>
  )
}
