import { describe, it, expect, beforeEach } from 'vitest'
import { useUiStore } from './uiStore'

beforeEach(() => {
  useUiStore.setState({ darkMode: false, lang: 'es' })
  document.documentElement.classList.remove('dark')
})

describe('uiStore', () => {
  it('initial darkMode is false', () => {
    expect(useUiStore.getState().darkMode).toBe(false)
  })

  it('toggleDark switches darkMode to true', () => {
    useUiStore.getState().toggleDark()
    expect(useUiStore.getState().darkMode).toBe(true)
  })

  it('toggleDark adds dark class to documentElement', () => {
    useUiStore.getState().toggleDark()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleDark twice returns to false', () => {
    useUiStore.getState().toggleDark()
    useUiStore.getState().toggleDark()
    expect(useUiStore.getState().darkMode).toBe(false)
  })

  it('initial lang is es', () => {
    expect(useUiStore.getState().lang).toBe('es')
  })

  it('setLang updates lang', () => {
    useUiStore.getState().setLang('en')
    expect(useUiStore.getState().lang).toBe('en')
  })
})
