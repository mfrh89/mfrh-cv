'use client'

import { useState } from 'react'

export function PrintButton() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    setDone(false)
    try {
      const res = await fetch('/api/cv-pdf')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Maximilian-Huber_CV.pdf'
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
      setTimeout(() => setDone(false), 2500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`@keyframes cv-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes cv-check{0%{stroke-dashoffset:20}100%{stroke-dashoffset:0}}@keyframes cv-pop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}`}</style>
      <button
        onClick={handleClick}
        disabled={loading}
        className="print-hidden fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+24px)] z-50 flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 text-xs font-bold tracking-wider text-[var(--on-primary)] shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
      >
        {loading && (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" style={{ animation: 'cv-spin 1s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
          </svg>
        )}
        {done && (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" style={{ animation: 'cv-pop 0.3s ease-out' }}>
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
            <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7" strokeDasharray="20" style={{ animation: 'cv-check 0.4s ease-out 0.1s both' }} />
          </svg>
        )}
        {!loading && !done && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        )}
        {loading ? 'PDF...' : done ? 'Fertig' : 'PDF'}
      </button>
    </>
  )
}
