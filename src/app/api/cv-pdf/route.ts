import { chromium } from 'playwright'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.SERVER_URL || 'http://localhost:3000'
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(`${baseUrl}/cv-print?t=${Date.now()}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  })

  await browser.close()

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Maximilian-Huber_CV.pdf"',
    },
  })
}
