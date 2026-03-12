import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner', () => {
  it('renders with role status', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has aria-label Cargando...', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Cargando...')).toBeInTheDocument()
  })

  it('renders small size', () => {
    const { container } = render(<Spinner size="sm" />)
    expect(container.querySelector('.w-4')).toBeInTheDocument()
  })

  it('renders large size', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.querySelector('.w-12')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Spinner className="py-20" />)
    expect(container.firstChild).toHaveClass('py-20')
  })
})
