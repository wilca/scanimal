import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../services/api'
import DataTable from '../../components/tables/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatDateTime } from '../../utils/formatters'

const LIMIT = 10

export default function ControlList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [controls, setControls] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = (p = 1) => {
    setLoading(true)
    api.get('/controls', { params: { page: p, limit: LIMIT } })
      .then((r) => { setControls(r.data.data || []); setTotalPages(Math.ceil((r.data.total || 0) / LIMIT)); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const columns = [
    { key: 'animal_name', label: 'Animal' },
    { key: 'reason', label: t('controls.reason') },
    { key: 'medication', label: t('controls.medication') },
    { key: 'created_at', label: 'Fecha', render: (row) => formatDateTime(row.created_at) },
    {
      key: 'actions', label: t('common.actions'),
      render: (row) => (
        <button onClick={() => setDeleteTarget(row.id)} className="text-red-500 text-xs">🗑️</button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('controls.title')}</h1>
        <button onClick={() => navigate('/controls/new')} className="btn-primary">+ {t('controls.new')}</button>
      </div>
      <DataTable columns={columns} data={controls} loading={loading} page={page} totalPages={totalPages} onPageChange={load} />
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => api.delete(`/controls/${deleteTarget}`).then(() => load(page))}
        title="Eliminar control" message="¿Eliminar este control médico?" danger />
    </div>
  )
}
