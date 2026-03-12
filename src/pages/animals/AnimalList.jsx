import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import DataTable from '../../components/tables/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { canManageAnimals, canDeleteRecords, canGeneratePDF } from '../../utils/permissions'
import { formatAge, formatWeight } from '../../utils/formatters'

const LIMIT = 10

export default function AnimalList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({ nombre: '', categoria: '', edad: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p, limit: LIMIT, ...filters }
      const res = await api.get('/animals', { params })
      setAnimals(res.data.data || [])
      setTotalPages(Math.ceil((res.data.total || 0) / LIMIT))
      setPage(p)
    } catch {
      setAnimals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(1) }, [filters])

  const handleDelete = async () => {
    await api.delete(`/animals/${deleteTarget}`)
    toast.success('Animal eliminado')
    load(page)
  }

  const columns = [
    {
      key: 'photo_url',
      label: 'Foto',
      width: 64,
      render: (row) => (
        <img
          src={row.photo_url || '/default-animal.svg'}
          alt={row.name}
          className="w-10 h-10 rounded-full object-cover bg-gray-100"
          onError={(e) => { e.target.src = '/default-animal.svg' }}
        />
      ),
    },
    { key: 'name', label: t('animals.name') },
    { key: 'category', label: t('animals.category') },
    { key: 'breed', label: t('animals.breed') },
    { key: 'age', label: t('animals.age'), render: (row) => formatAge(row.age) },
    { key: 'weight', label: t('animals.weight'), render: (row) => formatWeight(row.weight) },
    {
      key: 'is_active',
      label: 'Estado',
      render: (row) => (
        <span className={row.is_active ? 'badge-active' : 'badge-inactive'}>
          {row.is_active ? t('common.active') : t('common.inactive')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: t('common.actions'),
      render: (row) => (
        <div className="flex items-center gap-2">
          {canManageAnimals(user?.role) && (
            <button
              onClick={() => navigate(`/animals/${row.id}/edit`)}
              className="text-primary-600 hover:text-primary-700 text-xs font-medium"
              title="Editar"
            >
              ✏️
            </button>
          )}
          {canDeleteRecords(user?.role) && (
            <button
              onClick={() => setDeleteTarget(row.id)}
              className="text-red-500 hover:text-red-700 text-xs"
              title="Eliminar"
            >
              🗑️
            </button>
          )}
          {canGeneratePDF(user?.role) && (
            <button
              onClick={() => navigate(`/reports/animal/${row.id}`)}
              className="text-gray-500 hover:text-gray-700 text-xs"
              title="PDF"
            >
              📄
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('animals.title')}
        </h1>
        {canManageAnimals(user?.role) && (
          <button
            onClick={() => navigate('/animals/new')}
            className="btn-primary"
          >
            + {t('animals.new')}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder={`${t('common.search')} ${t('animals.name').toLowerCase()}...`}
          className="input-field max-w-xs"
          value={filters.nombre}
          onChange={(e) => setFilters((f) => ({ ...f, nombre: e.target.value }))}
        />
        <input
          type="number"
          placeholder={t('animals.age')}
          className="input-field w-28"
          value={filters.edad}
          onChange={(e) => setFilters((f) => ({ ...f, edad: e.target.value }))}
        />
        <button
          onClick={() => setFilters({ nombre: '', categoria: '', edad: '' })}
          className="btn-secondary text-sm"
        >
          Limpiar
        </button>
      </div>

      <DataTable
        columns={columns}
        data={animals}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={load}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar animal"
        message="¿Estás seguro de eliminar este animal? La acción no se puede deshacer."
        danger
      />
    </div>
  )
}
