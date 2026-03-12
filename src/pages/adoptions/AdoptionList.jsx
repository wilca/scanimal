import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import DataTable from '../../components/tables/DataTable'
import { formatDateTime, adoptionStatusColor } from '../../utils/formatters'

const LIMIT = 10

export default function AdoptionList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAnimalista } = useAuthStore()
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = (p = 1) => {
    setLoading(true)
    api.get('/adoptions', { params: { page: p, limit: LIMIT } })
      .then((r) => { setAdoptions(r.data.data || []); setTotalPages(Math.ceil((r.data.total || 0) / LIMIT)); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const columns = [
    { key: 'request_number', label: t('adoptions.requestNumber') },
    { key: 'requester_name', label: t('adoptions.requesterName') },
    { key: 'animal_name', label: 'Animal' },
    { key: 'email', label: t('adoptions.email') },
    { key: 'created_at', label: 'Fecha', render: (row) => formatDateTime(row.created_at) },
    {
      key: 'status', label: t('adoptions.status'),
      render: (row) => (
        <span className={adoptionStatusColor(row.status)}>
          {t(`adoptions.${row.status}`)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('adoptions.title')}</h1>
        <button onClick={() => navigate('/adoptions/new')} className="btn-primary">
          + {t('adoptions.new')}
        </button>
      </div>
      <DataTable columns={columns} data={adoptions} loading={loading} page={page} totalPages={totalPages} onPageChange={load} />
    </div>
  )
}
