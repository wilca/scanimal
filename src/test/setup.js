import '@testing-library/jest-dom'

// Mock localStorage para Zustand persist middleware
const localStorageMock = {
  store: {},
  getItem(key) { return this.store[key] ?? null },
  setItem(key, value) { this.store[key] = String(value) },
  removeItem(key) { delete this.store[key] },
  clear() { this.store = {} },
  key(i) { return Object.keys(this.store)[i] ?? null },
  get length() { return Object.keys(this.store).length },
}

Object.defineProperty(global, 'localStorage', { value: localStorageMock })
