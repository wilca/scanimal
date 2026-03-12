import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from './DataTable'

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k }),
}))

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
]

const data = [
  { id: 1, name: 'Max', email: 'max@test.com' },
  { id: 2, name: 'Luna', email: 'luna@test.com' },
]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} loading={false} page={1} totalPages={1} onPageChange={() => {}} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Correo')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={data} loading={false} page={1} totalPages={1} onPageChange={() => {}} />)
    expect(screen.getByText('Max')).toBeInTheDocument()
    expect(screen.getByText('Luna')).toBeInTheDocument()
  })

  it('shows empty message when data is empty', () => {
    render(<DataTable columns={columns} data={[]} loading={false} page={1} totalPages={1} onPageChange={() => {}} emptyMessage="Sin registros" />)
    expect(screen.getByText('Sin registros')).toBeInTheDocument()
  })

  it('renders spinner when loading', () => {
    render(<DataTable columns={columns} data={[]} loading={true} page={1} totalPages={1} onPageChange={() => {}} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows pagination when totalPages > 1', () => {
    render(<DataTable columns={columns} data={data} loading={false} page={1} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByLabelText('Página siguiente')).toBeInTheDocument()
    expect(screen.getByLabelText('Página anterior')).toBeInTheDocument()
  })

  it('calls onPageChange when next page clicked', () => {
    const onPageChange = vi.fn()
    render(<DataTable columns={columns} data={data} loading={false} page={1} totalPages={3} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByLabelText('Página siguiente'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables prev button on first page', () => {
    render(<DataTable columns={columns} data={data} loading={false} page={1} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<DataTable columns={columns} data={data} loading={false} page={3} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByLabelText('Página siguiente')).toBeDisabled()
  })

  it('th elements have scope=col', () => {
    const { container } = render(<DataTable columns={columns} data={data} loading={false} page={1} totalPages={1} onPageChange={() => {}} />)
    const headers = container.querySelectorAll('th')
    headers.forEach(th => expect(th).toHaveAttribute('scope', 'col'))
  })
})
