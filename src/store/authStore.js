import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('auth-storage')
      },

      hasRole: (roles) => {
        const role = get().user?.role
        if (!role) return false
        return Array.isArray(roles) ? roles.includes(role) : role === roles
      },

      isAdmin: () => get().user?.role === 'administrador',
      isAnimalista: () =>
        ['animalista', 'administrador'].includes(get().user?.role),
    }),
    { name: 'auth-storage' }
  )
)
