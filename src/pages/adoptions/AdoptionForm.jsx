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
  requester_name: z.string().min(2, 'Mínimo 2 caracteres').max(150),
  animal_id: z.coerce.number().int().positive('Animal requerido'),
  phone: z.string().min(7, 'Mínimo 7 dígitos'),
  email: z.string().email('Correo inválido'),
  address: z.string().min(5, 'Mínimo 5 caracteres').max(250),
  description: z.string().max(500).optional(),
})

export default function AdoptionForm() {
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
      await api.post('/adoptions', data)
      toast.success('Solicitud de adopción enviada')
      navigate('/adoptions')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar solicitud')
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
        <button onClick={() => navigate('/adoptions')} className="text-gray-500 hover:text-gray-700">← Adopciones</button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('adoptions.new')}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <Field label={`${t('adoptions.requesterName')} *`} error={errors.requester_name?.message}>
          <input {...register('requester_name')} className="input-field" />
        </Field>
        <Field label={`${t('adoptions.animal')} *`} error={errors.animal_id?.message}>
          <select {...register('animal_id')} className="input-field">
            <option value="">Seleccionar animal...</option>
            {animals.map((a) => <option key={a.id} value={a.id}>{a.name} — {a.breed}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={`${t('adoptions.phone')} *`} error={errors.phone?.message}>
            <input {...register('phone')} type="tel" className="input-field" />
          </Field>
          <Field label={`${t('adoptions.email')} *`} error={errors.email?.message}>
            <input {...register('email')} type="email" className="input-field" />
          </Field>
        </div>
        <Field label={`${t('adoptions.address')} *`} error={errors.address?.message}>
          <input {...register('address')} className="input-field" />
        </Field>
        <Field label={t('adoptions.description')}>
          <textarea {...register('description')} rows={4} className="input-field resize-none" maxLength={500} placeholder="¿Por qué deseas adoptar a este animal?" />
        </Field>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/adoptions')} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Spinner size="sm" />} Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  )
}
