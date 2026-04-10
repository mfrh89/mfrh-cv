import React from 'react'
import Link from 'next/link'

export const DraftBanner: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-4 rounded-full bg-[var(--color-primary)] px-6 py-3 text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-2 w-2 animate-pulse rounded-full bg-white" />
      <span className="text-sm font-medium tracking-wide">DRAFT MODE ACTIVE</span>
      <div className="h-4 w-px bg-white/20" />
      <Link
        href="/api/draft?disable=true"
        prefetch={false}
        className="text-xs font-bold uppercase tracking-widest opacity-80 transition-opacity hover:opacity-100"
      >
        Exit
      </Link>
    </div>
  )
}
