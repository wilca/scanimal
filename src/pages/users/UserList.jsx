import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '../../services/api'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Spinner from '../../components/ui/Spinner'

const schema = z.object({
  names: z.string().min(2, 'Mínimo 2 caracteres').max(150),
  email: z.string().email('Correo inválido'),
  phone: z.string().min(7, 'Mínimo 7 dígitos'),
  role_id: z.coerce.number().int().positive('Rol requerido'),
  sex: z.enum(['M', 'F', 'otro', '']).optional(),
  identification: z.string().max(50).optional(),
})

const LIMIT = 10

export default function UserList() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const load = (p = 1) => {
    setLoading(true)
    api.get('/users', { params: { page: p, limit: LIMIT } })
      .then((r) => { setUsers(r.data.data || []); setTotalPages(Math.ceil((r.data.total || 0) / LIMIT)); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setFormError(''); reset({ names: '', email: '', phone: '', role_id: '', sex: '', identification: '' }); setModalOpen(true) }
  const openEdit = (u) => { setEditing(u); setFormError(''); reset(u); setModalOpen(true) }

  const onSubmit = async (data) => {
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        await api.put(`/users/${editing.id}`, data)
        toast.success('Usuario actualizado correctamente')
        load()
        setModalOpen(false)
      } else {
        const res = await api.post('/users', data)
        const pwd = res.data?.generated_password
        toast.success(`Usuario "${data.names}" creado. Contraseña: ${pwd}`, { duration: 10000 })
        load()
        setModalOpen(false)
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'No se pudo guardar')
    } finally { setSaving(false) }
  }

  const columns = [
    { key: 'names', label: t('users.names') },
    { key: 'email', label: t('users.email') },
    { key: 'phone', label: t('users.phone') },
    { key: 'role', label: t('users.role'), render: (row) => <span className="capitalize">{row.role}</span> },
    {
      key: 'is_active', label: 'Estado',
      render: (row) => <span className={row.is_active ? 'badge-active' : 'badge-inactive'}>{row.is_active ? 'Activo' : 'Inactivo'}</span>,
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('users.title')}</h1>
        <button onClick={openCreate} className="btn-primary">+ {t('users.new')}</button>
      </div>

      <DataTable columns={columns} data={users} loading={loading} page={page} totalPages={totalPages} onPageChange={load} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar usuario' : t('users.new')}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('users.names')} *</label>
            <input {...register('names')} className="input-field" />
            {errors.names && <p className="text-red-500 text-xs mt-1">{errors.names.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('users.email')} *</label>
            <input {...register('email')} type="email" className="input-field" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('users.phone')} *</label>
            <input {...register('phone')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('users.role')} *</label>
            <select {...register('role_id')} className="input-field">
              <option value="">Seleccionar...</option>
              <option value="1">Usuario</option>
              <option value="2">Animalista</option>
              <option value="3">Administrador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('users.sex')}</label>
            <select {...register('sex')} className="input-field">
              <option value="">—</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('users.identification')}</label>
            <input {...register('identification')} className="input-field" maxLength={50} />
          </div>
          {!editing && (
            <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              🔑 {t('users.passwordGenerated')} — se mostrará al crear el usuario.
            </div>
          )}
          {formError && (
            <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {formError}
            </div>
          )}
          <div className="col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Spinner size="sm" />} {t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => api.delete(`/users/${deleteTarget}`).then(() => { toast.success('Usuario eliminado'); load(page) })}
        title="Eliminar usuario" message="¿Eliminar este usuario?" danger />
    </div>
  )
}
