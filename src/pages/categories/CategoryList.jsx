import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '../../services/api'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Spinner from '../../components/ui/Spinner'

const schema = z.object({ name: z.string().min(2).max(100) })

export default function CategoryList() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const load = () => {
    setLoading(true)
    api.get('/categories').then((r) => setCategories(r.data || [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); reset({ name: '' }); setModalOpen(true) }
  const openEdit = (cat) => { setEditing(cat); reset({ name: cat.name }); setModalOpen(true) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editing) await api.put(`/categories/${editing.id}`, data)
      else await api.post('/categories', data)
      load()
      setModalOpen(false)
      setFeedback(editing ? 'Categoría actualizada' : 'Categoría creada correctamente')
      setTimeout(() => setFeedback(''), 3000)
    } catch (err) {
      setFeedback('Error: ' + (err.response?.data?.message || 'No se pudo guardar'))
      setTimeout(() => setFeedback(''), 4000)
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    await api.delete(`/categories/${deleteTarget}`)
    load()
  }

  const columns = [
    { key: 'id', label: 'ID', width: 60 },
    { key: 'name', label: t('categories.name') },
    {
      key: 'is_active', label: 'Estado',
      render: (row) => <span className={row.is_active ? 'badge-active' : 'badge-inactive'}>{row.is_active ? t('common.active') : t('common.inactive')}</span>,
    },
    {
      key: 'actions', label: t('common.actions'),
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="text-primary-600 text-xs">✏️</button>
          <button onClick={() => setDeleteTarget(row.id)} className="text-red-500 text-xs">🗑️</button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('categories.title')}</h1>
        <button onClick={openCreate} className="btn-primary">+ {t('categories.new')}</button>
      </div>

      {feedback && (
        <div className={`px-4 py-2 rounded-lg text-sm ${feedback.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {feedback}
        </div>
      )}

      <DataTable columns={columns} data={categories} loading={loading} page={1} totalPages={1} onPageChange={() => {}} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar categoría' : t('categories.new')} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('categories.name')}</label>
            <input {...register('name')} className="input-field" autoFocus />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Spinner size="sm" />} {t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Eliminar categoría" message="¿Eliminar esta categoría?" danger />
    </div>
  )
}
