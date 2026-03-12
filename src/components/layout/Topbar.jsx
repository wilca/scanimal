import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'

export default function Topbar({ onToggleSidebar }) {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const { darkMode, toggleDark, lang, setLang } = useUiStore()

  const handleLang = () => {
    const next = lang === 'es' ? 'en' : 'es'
    setLang(next)
    i18n.changeLanguage(next)
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 p-1"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          {greeting}, <strong>{user?.names?.split(' ')[0]}</strong>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <button
          onClick={handleLang}
          className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {lang === 'es' ? 'EN' : 'ES'}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
