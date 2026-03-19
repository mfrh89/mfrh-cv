import Link from 'next/link'

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="print-hidden flex items-center gap-4 bg-[#1c1c24] px-4 py-2 text-sm text-white/70">
        <Link href="/" className="hover:text-white">
          &larr; CV Preview
        </Link>
        <Link href="/cover-letter" className="hover:text-white">
          Anschreiben Preview
        </Link>
      </div>
      {children}
    </div>
  )
}
