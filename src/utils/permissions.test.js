import { describe, it, expect } from 'vitest'
import {
  canManageAnimals,
  canManageUsers,
  canViewAnimals,
  canRequestAdoption,
  canDeleteRecords,
  canGeneratePDF,
} from './permissions'

describe('canManageAnimals', () => {
  it('returns true for animalista', () => expect(canManageAnimals('animalista')).toBe(true))
  it('returns true for administrador', () => expect(canManageAnimals('administrador')).toBe(true))
  it('returns false for usuario', () => expect(canManageAnimals('usuario')).toBe(false))
  it('returns false for undefined', () => expect(canManageAnimals(undefined)).toBe(false))
})

describe('canManageUsers', () => {
  it('returns true for administrador', () => expect(canManageUsers('administrador')).toBe(true))
  it('returns false for animalista', () => expect(canManageUsers('animalista')).toBe(false))
  it('returns false for usuario', () => expect(canManageUsers('usuario')).toBe(false))
})

describe('canViewAnimals', () => {
  it('returns true for animalista', () => expect(canViewAnimals('animalista')).toBe(true))
  it('returns true for administrador', () => expect(canViewAnimals('administrador')).toBe(true))
  it('returns false for usuario', () => expect(canViewAnimals('usuario')).toBe(false))
})

describe('canRequestAdoption', () => {
  it('returns true for all roles', () => {
    expect(canRequestAdoption('usuario')).toBe(true)
    expect(canRequestAdoption('animalista')).toBe(true)
    expect(canRequestAdoption('administrador')).toBe(true)
  })
})

describe('canDeleteRecords', () => {
  it('returns true for animalista', () => expect(canDeleteRecords('animalista')).toBe(true))
  it('returns true for administrador', () => expect(canDeleteRecords('administrador')).toBe(true))
  it('returns false for usuario', () => expect(canDeleteRecords('usuario')).toBe(false))
})

describe('canGeneratePDF', () => {
  it('returns true for animalista', () => expect(canGeneratePDF('animalista')).toBe(true))
  it('returns true for administrador', () => expect(canGeneratePDF('administrador')).toBe(true))
  it('returns false for usuario', () => expect(canGeneratePDF('usuario')).toBe(false))
})
