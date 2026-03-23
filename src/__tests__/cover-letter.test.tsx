import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock useLivePreview to return initialData directly
vi.mock('@payloadcms/live-preview-react', () => ({
  useLivePreview: ({ initialData }: { initialData: any }) => ({
    data: initialData,
    isLoading: false,
  }),
}))

// Mock Header component
vi.mock('@/components/Header', () => ({
  Header: ({ name, title }: { name: string; title: string }) => (
    <header data-testid="header">
      <span>{name}</span>
      <span>{title}</span>
    </header>
  ),
}))

import { LiveCoverLetter } from '@/components/live/LiveCoverLetter'

const defaultCVData = {
  name: 'Max Mustermann',
  title: 'Projektmanager',
  email: 'test@example.com',
  phone: '+49 123 456',
  linkedin: 'linkedin.com/in/test',
  profileImage: null,
  logo: null,
}

describe('LiveCoverLetter', () => {
  it('renders all cover letter fields', () => {
    render(
      <LiveCoverLetter
        initialData={{
          id: 1,
          recipientSalutation: 'Sehr geehrtes Team',
          body: 'Erster Absatz\n\nZweiter Absatz',
          closing: 'Mit freundlichen Grüßen',
          senderName: 'Max Mustermann',
        }}
        cvData={defaultCVData}
        serverURL="http://localhost:3000"
      />,
    )

    expect(screen.getByText('Sehr geehrtes Team')).toBeInTheDocument()
    expect(screen.getByText('Erster Absatz')).toBeInTheDocument()
    expect(screen.getByText('Zweiter Absatz')).toBeInTheDocument()
    expect(screen.getByText('Mit freundlichen Grüßen')).toBeInTheDocument()
    expect(screen.getByText('Max Mustermann', { selector: 'p' })).toBeInTheDocument()
  })

  it('renders empty state without crashing', () => {
    render(
      <LiveCoverLetter
        initialData={{
          id: 2,
          recipientSalutation: '',
          body: '',
          closing: '',
          senderName: '',
        }}
        cvData={defaultCVData}
        serverURL="http://localhost:3000"
      />,
    )

    expect(screen.getByText('Anschreiben')).toBeInTheDocument()
  })

  it('has overflow-hidden on main to prevent horizontal scroll', () => {
    const { container } = render(
      <LiveCoverLetter
        initialData={{
          id: 3,
          recipientSalutation: 'Test',
          body: 'A'.repeat(1000),
          closing: 'Grüße',
          senderName: 'Test',
        }}
        cvData={defaultCVData}
        serverURL="http://localhost:3000"
      />,
    )

    const main = container.querySelector('main')
    expect(main?.className).toContain('overflow-hidden')
  })

  it('has break-words on container to wrap long text', () => {
    const { container } = render(
      <LiveCoverLetter
        initialData={{
          id: 4,
          recipientSalutation: 'Test',
          body: 'LongWordWithoutSpaces'.repeat(50),
          closing: 'Grüße',
          senderName: 'Test',
        }}
        cvData={defaultCVData}
        serverURL="http://localhost:3000"
      />,
    )

    const page = container.querySelector('.cover-letter-page')
    expect(page?.className).toContain('break-words')
  })

  it('splits body into paragraphs on double newlines', () => {
    render(
      <LiveCoverLetter
        initialData={{
          id: 5,
          recipientSalutation: 'Hallo',
          body: 'Absatz eins\n\nAbsatz zwei\n\nAbsatz drei',
          closing: 'Grüße',
          senderName: 'Test',
        }}
        cvData={defaultCVData}
        serverURL="http://localhost:3000"
      />,
    )

    expect(screen.getByText('Absatz eins')).toBeInTheDocument()
    expect(screen.getByText('Absatz zwei')).toBeInTheDocument()
    expect(screen.getByText('Absatz drei')).toBeInTheDocument()
  })

  it('renders header with CV data', () => {
    render(
      <LiveCoverLetter
        initialData={{
          id: 6,
          recipientSalutation: 'Test',
          body: 'Test body',
          closing: 'Grüße',
          senderName: 'Test',
        }}
        cvData={defaultCVData}
        serverURL="http://localhost:3000"
      />,
    )

    const header = screen.getByTestId('header')
    expect(header).toBeInTheDocument()
    // Header receives CV data (name from cvData, not from cover letter)
    expect(header).toHaveTextContent('Max Mustermann')
    expect(header).toHaveTextContent('Projektmanager')
  })
})
