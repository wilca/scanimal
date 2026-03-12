import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n'

export const useUiStore = create(
  persist(
    (set) => ({
      darkMode: false,
      lang: 'es',

      toggleDark: () =>
        set((s) => {
          const next = !s.darkMode
          document.documentElement.classList.toggle('dark', next)
          return { darkMode: next }
        }),

      setLang: (lang) => {
        localStorage.setItem('lang', lang)
        return set({ lang })
      },
    }),
    {
      name: 'ui-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) document.documentElement.classList.add('dark')
        if (state?.lang) i18n.changeLanguage(state.lang)
      },
    }
  )
)
