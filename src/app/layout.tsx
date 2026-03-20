import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Maximilian Huber - CV',
  description:
    'Project Manager, Product Owner & Scrum Master with 10+ years of experience.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-[#e3e3e3] font-mono">{children}</body>
    </html>
  )
}
