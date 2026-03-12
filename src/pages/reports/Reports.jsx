import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import api from '../../services/api'
import Spinner from '../../components/ui/Spinner'
import { formatDate } from '../../utils/formatters'

const PAW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
  <ellipse cx="50" cy="62" rx="18" ry="14"/>
  <ellipse cx="28" cy="48" rx="9" ry="12"/>
  <ellipse cx="72" cy="48" rx="9" ry="12"/>
  <ellipse cx="38" cy="32" rx="8" ry="10"/>
  <ellipse cx="62" cy="32" rx="8" ry="10"/>
</svg>`

function PawBackground() {
  const positions = [
    { top: '5%', left: '3%', size: 60, rotate: -20 },
    { top: '5%', left: '72%', size: 50, rotate: 15 },
    { top: '28%', left: '85%', size: 40, rotate: -10 },
    { top: '55%', left: '78%', size: 55, rotate: 25 },
    { top: '72%', left: '5%', size: 45, rotate: -30 },
    { top: '82%', left: '60%', size: 38, rotate: 10 },
    { top: '40%', left: '-2%', size: 42, rotate: 20 },
  ]
  return (
    <>
      {positions.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0.07,
            transform: `rotate(${p.rotate}deg)`,
            color: '#fff',
          }}
          dangerouslySetInnerHTML={{ __html: PAW_SVG }}
        />
      ))}
    </>
  )
}

function AnimalCarnet({ animal }) {
  const [imgSrc, setImgSrc] = useState(animal.photo_url || '/default-animal.svg')
  return (
    <div
      id="pdf-card"
      style={{
        width: 297,
        minHeight: 420,
        background: 'linear-gradient(160deg, #0f766e 0%, #134e4a 100%)',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Manrope, sans-serif',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 24px 20px',
      }}
    >
      <PawBackground />

      {/* Header */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, opacity: 0.7, textTransform: 'uppercase' }}>
          🐾 Scanimal Foundation
        </div>
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>Ficha de Identificación Animal</div>
      </div>

      {/* Photo */}
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <div style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.9)',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <img
            src={imgSrc}
            alt={animal.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgSrc('/default-animal.svg')}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Name */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{animal.name}</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
          {animal.breed}{animal.category ? ` · ${animal.category}` : ''}
        </div>
      </div>

      {/* Data rows */}
      <div style={{
        position: 'relative',
        width: '100%',
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 16,
      }}>
        {[
          { label: 'Nombre', value: animal.name },
          { label: 'Raza', value: animal.breed || '—' },
          { label: 'Categoría', value: animal.category || '—' },
          { label: 'Edad', value: animal.age != null ? `${animal.age} años` : '—' },
          { label: 'Peso', value: animal.weight != null ? `${animal.weight} kg` : '—' },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 600 }}>{row.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', textAlign: 'center', opacity: 0.5, fontSize: 9 }}>
        Generado el {new Date().toLocaleDateString('es-CO')} · scanimal.org
      </div>
    </div>
  )
}

function AnimalReportHeader({ animal }) {
  const [imgSrc, setImgSrc] = useState(animal.photo_url || '/default-animal.svg')
  return (
    <div className="flex items-start gap-5 mb-6">
      <img
        src={imgSrc}
        alt={animal.name}
        className="w-32 h-32 rounded-full object-cover border-4 border-teal-600 bg-gray-100 shrink-0"
        onError={() => setImgSrc('/default-animal.svg')}
      />
      <div className="flex-1">
        <div className="text-xs text-teal-600 font-semibold mb-1 tracking-wide">SCANIMAL FOUNDATION</div>
        <h2 className="text-3xl font-bold text-gray-900">{animal.name}</h2>
        <p className="text-gray-500 text-sm">{animal.breed}{animal.category ? ` · ${animal.category}` : ''}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {animal.age != null && <span className="bg-teal-50 text-teal-700 rounded px-2 py-0.5">Edad: {animal.age} años</span>}
          {animal.weight != null && <span className="bg-teal-50 text-teal-700 rounded px-2 py-0.5">Peso: {animal.weight} kg</span>}
        </div>
        {animal.description && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-3">{animal.description}</p>
        )}
      </div>
    </div>
  )
}

export default function Reports() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(null)
  const [allAnimals, setAllAnimals] = useState([])
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    api.get('/animals', { params: { limit: 500 } })
      .then((r) => setAllAnimals(r.data.data || []))
      .catch(() => {})
  }, [])

  const loadAnimal = async (animalId) => {
    if (!animalId) return
    setLoading(true)
    try {
      const res = await api.get(`/animals/${animalId}`)
      setAnimal(res.data)
    } catch {
      toast.error('Animal no encontrado')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadAnimal(id)
  }, [id])

  const filtered = allAnimals.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.breed || '').toLowerCase().includes(search.toLowerCase())
  )

  const selectAnimal = (a) => {
    setSearch(a.name)
    setShowDropdown(false)
    loadAnimal(a.id)
  }

  const generatePDF = async (type) => {
    setGenerating(type)
    try {
      const el = document.getElementById(`pdf-${type}`)
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', type === 'card' ? 'a6' : 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
      pdf.save(`scanimal-${type}-${animal?.name || 'animal'}.pdf`)
      toast.success(type === 'card' ? 'Tarjeta generada' : 'Reporte generado')
    } catch {
      toast.error('Error al generar PDF')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('nav.reports')}</h1>

      {/* Searchable animal selector */}
      <div className="card p-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Buscar animal
        </label>
        <div className="relative max-w-sm" onBlur={() => setTimeout(() => setShowDropdown(false), 150)}>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowDropdown(true) }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Nombre o raza..."
            className="input-field"
          />
          {showDropdown && filtered.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-56 overflow-y-auto">
              {filtered.slice(0, 20).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onMouseDown={() => selectAnimal(a)}
                  className="w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-gray-700 text-sm flex items-center gap-3"
                >
                  <img
                    src={a.photo_url || '/default-animal.svg'}
                    alt={a.name}
                    className="w-7 h-7 rounded-full object-cover bg-gray-100 shrink-0"
                    onError={(e) => { e.target.src = '/default-animal.svg' }}
                  />
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{a.name}</span>
                    {a.breed && <span className="text-gray-400 ml-1 text-xs">· {a.breed}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {showDropdown && search && filtered.length === 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-400">
              Sin resultados
            </div>
          )}
        </div>
      </div>

      {loading && <Spinner size="lg" className="py-10" />}

      {animal && (
        <>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => generatePDF('report')}
              disabled={!!generating}
              className="btn-primary flex items-center gap-2"
            >
              {generating === 'report' ? <Spinner size="sm" /> : '📄'} Generar Reporte PDF
            </button>
            <button
              onClick={() => generatePDF('card')}
              disabled={!!generating}
              className="btn-secondary flex items-center gap-2"
            >
              {generating === 'card' ? <Spinner size="sm" /> : '🐾'} Generar Tarjeta PDF
            </button>
          </div>

          {/* Full Report */}
          <div>
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Vista previa — Reporte</p>
            <div id="pdf-report" className="card p-8 max-w-2xl bg-white">
              <AnimalReportHeader animal={animal} />
              {animal.vaccines?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Vacunas</h3>
                  <div className="space-y-1">
                    {animal.vaccines.map((v, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-600">
                        <span>· {v.name}</span>
                        <span>{formatDate(v.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-400 border-t pt-3 mt-4">
                Generado el {formatDate(new Date().toISOString())} · Scanimal
              </div>
            </div>
          </div>

          {/* Tarjeta carnet A6 */}
          <div>
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Vista previa — Tarjeta carnet</p>
            <AnimalCarnet animal={animal} />
          </div>
        </>
      )}
    </div>
  )
}
