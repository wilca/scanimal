import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import Spinner from '../components/ui/Spinner'

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, isAdmin, isAnimalista } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then((r) => setStats(r.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" className="py-20" />

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {greeting}, {user?.names?.split(' ')[0]} 👋
      </h1>

      {/* Stats grid */}
      {isAnimalista() && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="🐾"
            label={t('dashboard.activeAnimals')}
            value={stats?.activeAnimals ?? '—'}
            color="bg-primary-50 dark:bg-primary-900/30"
          />
          <StatCard
            icon="💉"
            label={t('dashboard.controlsToday')}
            value={stats?.controlsToday ?? '—'}
            color="bg-blue-50 dark:bg-blue-900/30"
          />
          <StatCard
            icon="🏠"
            label={t('dashboard.pendingRequests')}
            value={stats?.pendingAdoptions ?? '—'}
            color="bg-amber-50 dark:bg-amber-900/30"
          />
          {isAdmin() && (
            <StatCard
              icon="👥"
              label={t('dashboard.activeUsers')}
              value={stats?.activeUsers ?? '—'}
              color="bg-green-50 dark:bg-green-900/30"
            />
          )}
        </div>
      )}

      {/* User role: show only their adoptions */}
      {!isAnimalista() && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('dashboard.myRequests')}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.myAdoptions?.total ?? 0}
              </p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">
                {stats?.myAdoptions?.pending ?? 0}
              </p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {stats?.myAdoptions?.approved ?? 0}
              </p>
              <p className="text-sm text-gray-500">Aprobadas</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent adoptions */}
      {isAnimalista() && stats?.recentAdoptions?.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('dashboard.recentAdoptions')}
          </h2>
          <div className="space-y-3">
            {stats.recentAdoptions.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.requesterName}</p>
                  <p className="text-xs text-gray-500">{a.animalName}</p>
                </div>
                <span className={`badge-${a.status === 'pendiente' ? 'pending' : a.status === 'aprobada' ? 'approved' : 'rejected'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
