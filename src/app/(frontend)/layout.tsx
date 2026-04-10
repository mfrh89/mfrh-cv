import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/components/DraftBanner'
import '../globals.css'

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Portfolio',
    template: '%s | MFRH',
  },
  description: 'Portfolio mit CV, Projekten und individualisierten Anschreiben.',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()

  return (
    <html lang="de" className={`${jetbrainsMono.variable} antialiased`}>
      <body>
        {children}
        {draft && <DraftBanner />}
      </body>
    </html>
  )
}
