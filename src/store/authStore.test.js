import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

const mockUser = { id: 1, names: 'Test User', email: 'test@test.com', role: 'usuario' }
const mockToken = 'test-token-123'

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
})

describe('authStore', () => {
  it('initial state is null', () => {
    const { user, token } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(token).toBeNull()
  })

  it('setAuth stores user and token', () => {
    useAuthStore.getState().setAuth(mockUser, mockToken)
    const { user, token } = useAuthStore.getState()
    expect(user).toEqual(mockUser)
    expect(token).toBe(mockToken)
  })

  it('logout clears user and token', () => {
    useAuthStore.getState().setAuth(mockUser, mockToken)
    useAuthStore.getState().logout()
    const { user, token } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(token).toBeNull()
  })

  it('isAuthenticated returns true when token exists', () => {
    useAuthStore.getState().setAuth(mockUser, mockToken)
    expect(useAuthStore.getState().token).toBeTruthy()
  })
})
