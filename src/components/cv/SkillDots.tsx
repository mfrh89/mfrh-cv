interface SkillDotsProps {
  level: number
  max?: number
}

export function SkillDots({ level, max = 5 }: SkillDotsProps) {
  return (
    <div className="flex gap-[4px]">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-[10px] w-[10px] rounded-full ${
            i < level
              ? 'bg-[var(--color-dot-filled)]'
              : 'bg-[var(--color-dot-empty)]'
          }`}
        />
      ))}
    </div>
  )
}
