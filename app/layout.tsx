import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Space_Grotesk, DM_Sans, Geist_Mono as V0_Font_Geist_Mono } from 'next/font/google'

// Initialize fonts
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })
const _dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AfriLove - Rencontres pour la Diaspora Africaine",
  description:
    "Connectez-vous avec des célibataires africains et de la diaspora. Trouvez l'amour en partageant vos valeurs culturelles.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
