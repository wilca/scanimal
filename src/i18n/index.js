import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './es.json'
import en from './en.json'

const storedUi = JSON.parse(localStorage.getItem('ui-storage') || '{}')
const initialLang = storedUi?.state?.lang || localStorage.getItem('lang') || 'es'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: initialLang,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
  })

export default i18n
