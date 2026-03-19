'use client'

const sections = [
  { id: 'about', label: 'Über Mich' },
  { id: 'experience', label: 'Erfahrung' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Ausbildung' },
]

export function MobileNav() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="print-hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-300 bg-[#e3e3e3] py-3 md:hidden">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="text-[11px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] active:text-[var(--color-text)]"
        >
          {s.label}
        </button>
      ))}
    </nav>
  )
}
