import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { key: 'dashboard',  path: '/dashboard',  icon: '📊', roles: null },
  { key: 'animals',    path: '/animals',    icon: '🐾', roles: ['animalista', 'administrador'] },
  { key: 'categories', path: '/categories', icon: '🏷️', roles: ['animalista', 'administrador'] },
  { key: 'controls',   path: '/controls',   icon: '💉', roles: ['animalista', 'administrador'] },
  { key: 'adoptions',  path: '/adoptions',  icon: '🏠', roles: null },
  { key: 'reports',    path: '/reports',    icon: '📄', roles: ['animalista', 'administrador'] },
  { key: 'users',      path: '/users',      icon: '👥', roles: ['administrador'] },
  { key: 'profile',    path: '/profile',    icon: '👤', roles: null },
]

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  )

  return (
    <aside
      aria-label="Navegación principal"
      className={[
        'flex flex-col h-full bg-primary-600 text-white transition-all duration-300',
        // Mobile: fixed drawer
        'fixed inset-y-0 left-0 z-40',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: relative, always visible, collapsible width
        'lg:relative lg:z-auto lg:translate-x-0',
        collapsed ? 'lg:w-16' : 'lg:w-64',
        'w-64',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-primary-700">
        <span className="text-2xl" aria-hidden="true">🐾</span>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight lg:block">Scanimal</span>
        )}
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="ml-auto lg:hidden text-primary-200 hover:text-white p-1 rounded"
          aria-label="Cerrar menú"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto" aria-label="Menú">
        {visibleItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            onClick={onClose}
            aria-label={t(`nav.${item.key}`)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-primary-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-base shrink-0" aria-hidden="true">{item.icon}</span>
            <span className={collapsed ? 'lg:hidden' : ''}>{t(`nav.${item.key}`)}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-primary-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0"
            aria-hidden="true"
          >
            {user?.names?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="text-sm font-semibold truncate">{user?.names}</p>
            <p className="text-xs text-primary-200 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          aria-label={t('nav.logout')}
          className="flex items-center gap-2 text-primary-200 hover:text-white text-sm transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
        >
          <span aria-hidden="true">🚪</span>
          <span className={collapsed ? 'lg:hidden' : ''}>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  )
}
