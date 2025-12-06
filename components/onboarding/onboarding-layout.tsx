import type React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

interface OnboardingLayoutProps {
  children: React.ReactNode
  step: number
  totalSteps: number
  title: string
  subtitle: string
}

export function OnboardingLayout({ children, step, totalSteps, title, subtitle }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Link
              href="/welcome"
              className="inline-flex items-center justify-center w-12 h-12 border border-foreground"
            >
              <Heart className="w-6 h-6" strokeWidth={1.5} />
            </Link>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className={`w-8 h-1 ${i < step ? "bg-foreground" : "bg-border"}`} />
            ))}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  )
}
