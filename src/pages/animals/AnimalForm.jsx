import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { uploadImage } from '../../services/uploadImage'
import Spinner from '../../components/ui/Spinner'

const schema = z.object({
  name: z.string().min(2).max(150),
  category_id: z.coerce.number().int().positive('Categoría requerida'),
  breed: z.string().min(2).max(100),
  age: z.coerce.number().int().min(0).max(30).optional().or(z.literal('')),
  weight: z.coerce.number().min(0).optional().or(z.literal('')),
  height: z.coerce.number().min(0).optional().or(z.literal('')),
  width: z.coerce.number().min(0).optional().or(z.literal('')),
  length: z.coerce.number().min(0).optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  photo_url: z.string().nullish(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(250).optional(),
  address_extra: z.string().max(250).optional(),
  vaccines: z.array(z.object({
    name: z.string().min(2),
    date: z.string().optional(),
  })).optional(),
})

export default function AnimalForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { vaccines: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'vaccines' })

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data || []))
    if (isEdit) {
      api.get(`/animals/${id}`)
        .then((r) => {
          reset(r.data)
          if (r.data.photo_url) setPhotoPreview(r.data.photo_url)
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (photoFile) {
        try {
          const url = await uploadImage(photoFile, `animals/${Date.now()}_${photoFile.name}`)
          data.photo_url = url
        } catch (uploadErr) {
          const is403 = uploadErr?.code === 'storage/unauthorized' || uploadErr?.message?.includes('403')
          toast.error(is403 ? 'Firebase Storage no configurado (403). El animal se guardará sin imagen.' : 'Error al subir imagen')
          data.photo_url = null
        }
      }
      if (isEdit) {
        await api.put(`/animals/${id}`, data)
        toast.success('Animal actualizado correctamente')
      } else {
        await api.post('/animals', data)
        toast.success('Animal registrado correctamente')
      }
      navigate('/animals')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner size="lg" className="py-20" />

  const Field = ({ label, children, error }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/animals')} className="text-gray-500 hover:text-gray-700">
          ← Animales
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEdit ? t('animals.edit') : t('animals.new')}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <Field label={`${t('animals.name')} *`} error={errors.name?.message}>
              <input {...register('name')} className="input-field" />
            </Field>

            <Field label={`${t('animals.category')} *`} error={errors.category_id?.message}>
              <select {...register('category_id')} className="input-field">
                <option value="">Seleccionar...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label={`${t('animals.breed')} *`} error={errors.breed?.message}>
              <input {...register('breed')} className="input-field" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label={t('animals.age')} error={errors.age?.message}>
                <input {...register('age')} type="number" min="0" max="30" className="input-field" />
              </Field>
              <Field label={t('animals.weight')} error={errors.weight?.message}>
                <input {...register('weight')} type="number" step="0.01" min="0" className="input-field" />
              </Field>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medidas (cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input {...register('height')} type="number" step="0.01" min="0" placeholder="Alto" className="input-field" />
                <input {...register('width')} type="number" step="0.01" min="0" placeholder="Ancho" className="input-field" />
                <input {...register('length')} type="number" step="0.01" min="0" placeholder="Largo" className="input-field" />
              </div>
            </div>

            <Field label={t('animals.description')}>
              <textarea {...register('description')} rows={4} className="input-field resize-none" maxLength={1000} />
            </Field>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Field label={t('animals.photo')}>
              <div className="space-y-2">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    onError={() => setPhotoPreview(null)}
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-sm"
                >
                  {photoPreview ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
                <p className="text-xs text-gray-400">JPG / PNG — max 800 KB</p>
              </div>
            </Field>

            <Field label={t('animals.phone')}>
              <input {...register('phone')} type="tel" className="input-field" />
            </Field>

            <Field label={t('animals.email')} error={errors.email?.message}>
              <input {...register('email')} type="email" className="input-field" />
            </Field>

            <Field label={t('animals.address')}>
              <input {...register('address')} className="input-field" maxLength={250} />
            </Field>

            <Field label={t('animals.addressExtra')}>
              <input {...register('address_extra')} className="input-field" maxLength={250} />
            </Field>
          </div>
        </div>

        {/* Vaccines */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">
              {t('animals.vaccines')}
            </h2>
            <button
              type="button"
              onClick={() => append({ name: '', date: '' })}
              className="btn-secondary text-sm"
            >
              + {t('animals.addVaccine')}
            </button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Sin vacunas registradas
            </p>
          )}

          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-3">
                <input
                  {...register(`vaccines.${i}.name`)}
                  placeholder={t('animals.vaccineName')}
                  className="input-field flex-1"
                />
                <input
                  {...register(`vaccines.${i}.date`)}
                  type="date"
                  className="input-field w-40"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-400 hover:text-red-600 shrink-0"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/animals')} className="btn-secondary">
            {t('common.cancel')}
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Spinner size="sm" />}
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
