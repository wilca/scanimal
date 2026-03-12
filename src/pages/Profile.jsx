import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { uploadImage } from '../services/uploadImage'
import Spinner from '../components/ui/Spinner'

export default function Profile() {
  const { t } = useTranslation()
  const { user, setAuth, token } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    api.get('/profile')
      .then((r) => {
        reset(r.data)
        if (r.data.photo_url) setPhotoPreview(r.data.photo_url)
      })
      .catch(() => reset(user || {}))
  }, [])

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
          const url = await uploadImage(photoFile, `users/${user?.id}_${Date.now()}_${photoFile.name}`)
          data.photo_url = url
        } catch (uploadErr) {
          const is403 = uploadErr?.code === 'storage/unauthorized' || uploadErr?.message?.includes('403')
          toast.error(is403 ? 'Firebase Storage no configurado (403). El perfil se guardará sin foto.' : 'Error al subir imagen')
          data.photo_url = undefined
        }
      }
      const res = await api.put('/profile', data)
      setAuth(res.data, token)
      toast.success('Perfil actualizado correctamente')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('nav.profile')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('users.names')}</label>
          <input {...register('names')} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('users.phone')}</label>
          <input {...register('phone')} type="tel" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('users.identification')}</label>
          <input {...register('identification')} className="input-field" maxLength={50} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('users.birthdate')}</label>
          <input {...register('birthdate')} type="date" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Foto de perfil</label>
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
                onError={() => setPhotoPreview(null)}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
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
                {photoPreview ? 'Cambiar foto' : 'Subir foto'}
              </button>
              <p className="text-xs text-gray-400 mt-1">JPG / PNG — max 800 KB</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Spinner size="sm" />} {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
