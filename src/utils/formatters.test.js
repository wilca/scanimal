import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatWeight, formatAge, adoptionStatusColor } from './formatters'

describe('formatDate', () => {
  it('returns — for null', () => expect(formatDate(null)).toBe('—'))
  it('returns — for undefined', () => expect(formatDate(undefined)).toBe('—'))
  it('returns — for empty string', () => expect(formatDate('')).toBe('—'))
  it('formats a valid date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toMatch(/2024/)
    expect(result).not.toBe('—')
  })
})

describe('formatDateTime', () => {
  it('returns — for null', () => expect(formatDateTime(null)).toBe('—'))
  it('formats a valid datetime', () => {
    const result = formatDateTime('2024-06-01T10:30:00Z')
    expect(result).toMatch(/2024/)
  })
})

describe('formatWeight', () => {
  it('returns — for null', () => expect(formatWeight(null)).toBe('—'))
  it('returns — for undefined', () => expect(formatWeight(undefined)).toBe('—'))
  it('formats weight with 2 decimals', () => expect(formatWeight(5)).toBe('5.00 kg'))
  it('formats decimal weight', () => expect(formatWeight(3.5)).toBe('3.50 kg'))
})

describe('formatAge', () => {
  it('returns — for null', () => expect(formatAge(null)).toBe('—'))
  it('returns — for undefined', () => expect(formatAge(undefined)).toBe('—'))
  it('formats age with default unit', () => expect(formatAge(3)).toBe('3 años'))
  it('formats age with custom unit', () => expect(formatAge(6, 'meses')).toBe('6 meses'))
})

describe('adoptionStatusColor', () => {
  it('returns badge-pending for pendiente', () => expect(adoptionStatusColor('pendiente')).toBe('badge-pending'))
  it('returns badge-approved for aprobada', () => expect(adoptionStatusColor('aprobada')).toBe('badge-approved'))
  it('returns badge-rejected for rechazada', () => expect(adoptionStatusColor('rechazada')).toBe('badge-rejected'))
  it('returns badge-inactive for unknown', () => expect(adoptionStatusColor('unknown')).toBe('badge-inactive'))
})
