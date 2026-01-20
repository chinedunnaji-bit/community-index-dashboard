import type { ReactNode } from 'react'
import { Fraunces, Space_Grotesk } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
})

const body = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-stone-950 text-stone-100 antialiased">{children}</body>
    </html>
  )
}
