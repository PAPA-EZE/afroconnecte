import type React from "react"
import Link from "next/link"
import { Heart, Users, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-foreground">
              <Heart className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">AfriLove</h1>
            <p className="text-muted-foreground text-lg">Connectez-vous avec la diaspora africaine</p>
          </div>

          {/* Features */}
          <div className="space-y-4 py-8">
            <FeatureItem
              icon={<Globe className="w-5 h-5" />}
              title="Culture Partagée"
              description="Trouvez des personnes qui partagent vos valeurs et traditions"
            />
            <FeatureItem
              icon={<Users className="w-5 h-5" />}
              title="Communauté Authentique"
              description="Des profils vérifiés pour des rencontres en toute confiance"
            />
            <FeatureItem
              icon={<Sparkles className="w-5 h-5" />}
              title="Matching Intelligent"
              description="Algorithme basé sur vos préférences culturelles"
            />
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full h-12 text-base">
              <Link href="/auth/register">Créer un compte</Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12 text-base bg-transparent">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground">
            En continuant, vous acceptez nos{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 border border-border flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
