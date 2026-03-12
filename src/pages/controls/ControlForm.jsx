import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import api from '../../services/api'
import Spinner from '../../components/ui/Spinner'

const schema = z.object({
  animal_id: z.coerce.number().int().positive('Animal requerido'),
  reason: z.string().min(5, 'Mínimo 5 caracteres').max(250),
  medication: z.string().min(2, 'Mínimo 2 caracteres').max(250),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
})

export default function ControlForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [animals, setAnimals] = useState([])
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    api.get('/animals', { params: { limit: 200 } }).then((r) => setAnimals(r.data.data || []))
  }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await api.post('/controls', data)
      toast.success('Control registrado correctamente')
      navigate('/controls')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const Field = ({ label, children, error }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/controls')} className="text-gray-500 hover:text-gray-700">← Controles</button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('controls.new')}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <Field label="Animal *" error={errors.animal_id?.message}>
          <select {...register('animal_id')} className="input-field">
            <option value="">Seleccionar animal...</option>
            {animals.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label={`${t('controls.reason')} *`} error={errors.reason?.message}>
          <input {...register('reason')} className="input-field" maxLength={250} />
        </Field>
        <Field label={`${t('controls.medication')} *`} error={errors.medication?.message}>
          <input {...register('medication')} className="input-field" maxLength={250} />
        </Field>
        <Field label={`${t('controls.description')} *`} error={errors.description?.message}>
          <textarea {...register('description')} rows={5} className="input-field resize-none" />
        </Field>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/controls')} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Spinner size="sm" />} {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
