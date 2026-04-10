export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div className="mb-3" id={id}>
      <h2 className="text-[14px] font-bold tracking-[-0.05em] uppercase text-[var(--color-text)]">
        {children}
      </h2>
      <div className="cv-section-rule mt-1 h-px w-full bg-[var(--color-rule)]" />
    </div>
  )
}

export function SubsectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-[13px] font-bold text-[var(--color-text)]">
      {children}
    </h3>
  )
}
