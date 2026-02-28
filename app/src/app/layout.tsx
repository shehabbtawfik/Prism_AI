import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Prism AI — Refracting Intelligence into Clarity',
    template: '%s | Prism AI',
  },
  description:
    'Prism AI is a next-generation, multi-faceted AI platform that transforms raw ideas into polished, publication-ready content through Research, Refinement, and Restyling — powered by a unified AI provider abstraction layer.',
  keywords: [
    'AI platform',
    'content creation',
    'AI research',
    'content refinement',
    'AI architecture',
    'multi-provider AI',
    'OpenAI',
    'Azure AI',
    'Ollama',
    'Next.js',
  ],
  authors: [{ name: 'Prism AI Team' }],
  creator: 'Prism AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Prism AI — Refracting Intelligence into Clarity',
    description:
      'A multi-faceted AI platform for research, content refinement, and intelligent restyling.',
    siteName: 'Prism AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prism AI — Refracting Intelligence into Clarity',
    description:
      'A multi-faceted AI platform for research, content refinement, and intelligent restyling.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
