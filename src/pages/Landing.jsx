import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '../store/uiStore'
import toast from 'react-hot-toast'
import axios from 'axios'

const NAV_LINKS = [
  { href: '#que-es', label: '¿Qué es?' },
  { href: '#como-adoptar', label: 'Cómo adoptar' },
  { href: '#contacto', label: 'Contacto' },
]

const FEATURES = [
  { icon: '🐶', title: 'Registro de animales', desc: 'Gestiona fichas completas con fotos, vacunas y controles médicos.' },
  { icon: '💉', title: 'Control médico', desc: 'Historial de medicamentos, revisiones y tratamientos en un solo lugar.' },
  { icon: '🏠', title: 'Gestión de adopciones', desc: 'Solicitudes de adopción con seguimiento de estado en tiempo real.' },
  { icon: '📊', title: 'Reportes PDF', desc: 'Genera tarjetas y reportes de cada animal con un solo clic.' },
]

const STEPS = [
  { num: '1', title: 'Explora los animales', desc: 'Conoce a los animales disponibles en nuestra fundación.' },
  { num: '2', title: 'Envía tu solicitud', desc: 'Completa el formulario con tus datos y el animal que deseas adoptar.' },
  { num: '3', title: 'Espera la respuesta', desc: 'Nuestro equipo revisará tu solicitud y te contactará.' },
  { num: '4', title: 'Dale un hogar', desc: '¡Bienvenido a la familia! Juntos hacemos la diferencia.' },
]

export default function Landing() {
  const { i18n } = useTranslation()
  const { lang, setLang, darkMode, toggleDark } = useUiStore()

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleLang = () => {
    const next = lang === 'es' ? 'en' : 'es'
    setLang(next)
    i18n.changeLanguage(next)
  }

  const handleContact = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Por favor completa todos los campos')
      return
    }
    setSending(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, {
        name: form.name,
        email: form.email,
        message: form.message,
      })
      toast.success('Mensaje enviado. ¡Pronto te contactaremos!')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('No se pudo enviar el mensaje. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <span aria-hidden="true">🐾</span> Scanimal
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cambiar tema"
              title="Cambiar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleLang}
              className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cambiar idioma"
            >
              {lang === 'es' ? 'ES' : 'EN'}
            </button>
            <Link to="/login" className="btn-primary px-4 py-2 text-sm">
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight mb-6">
            Gestiona tu fundación<br />
            <span className="text-primary-600">con amor y orden</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Scanimal centraliza el registro de animales, controles médicos y adopciones para que puedas enfocarte en lo que importa: darles una mejor vida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary px-8 py-3 text-base">
              Comenzar ahora
            </Link>
            <a href="#como-adoptar" className="btn-secondary px-8 py-3 text-base">
              Cómo adoptar
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 max-w-xs mx-auto">
            {[
              { value: '∞', label: 'Animales registrables' },
              { value: '3', label: 'Roles de acceso' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-primary-600">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué es */}
      <section id="que-es" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              ¿Qué es Scanimal?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Una plataforma diseñada para fundaciones sin ánimo de lucro que rescatan y cuidan animales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo adoptar */}
      <section id="como-adoptar" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              ¿Cómo adoptar?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              El proceso es simple, rápido y completamente en línea.
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-primary-100 dark:bg-primary-900/40 mx-16" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {STEPS.map((s) => (
                <div key={s.num} className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 relative z-10">
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/login" className="btn-primary px-8 py-3 text-base inline-block">
              Solicitar adopción
            </Link>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            ¿Tienes preguntas?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10">
            Estamos aquí para ayudarte. Escríbenos y te respondemos a la brevedad.
          </p>
          <form
            onSubmit={handleContact}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 space-y-4 text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Tu correo"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-field"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Tu mensaje..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="input-field resize-none w-full"
            />
            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full py-3"
            >
              {sending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 font-semibold text-primary-600">
            <span aria-hidden="true">🐾</span> Scanimal
          </div>
          <p>© {new Date().getFullYear()} Scanimal. Hecho con ❤️ para las fundaciones animales.</p>
          <Link to="/login" className="text-primary-600 hover:underline">
            Acceder al sistema
          </Link>
        </div>
      </footer>
    </div>
  )
}
