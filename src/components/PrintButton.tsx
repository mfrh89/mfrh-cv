'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print-hidden fixed right-6 bottom-20 md:bottom-6 z-50 flex items-center gap-2 rounded-full bg-[var(--color-text)] px-5 py-3 text-xs font-bold tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      PDF
    </button>
  )
}
