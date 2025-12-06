"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, MessageCircle, Calendar, User } from "lucide-react"

const navItems = [
  { href: "/discover", icon: Heart, label: "Découvrir" },
  { href: "/matches", icon: MessageCircle, label: "Messages" },
  { href: "/events", icon: Calendar, label: "Événements" },
  { href: "/profile", icon: User, label: "Profil" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
