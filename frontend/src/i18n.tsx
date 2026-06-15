import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en_US/common.json'
import frCommon from './locales/fr_FR/common.json'

const detectInitialLanguage = () => {
  if (typeof navigator === 'undefined') {
    return 'en-US'
  }

  const browserLanguage = navigator.languages?.[0] ?? navigator.language ?? 'en-US'
  return browserLanguage.toLowerCase().startsWith('fr') ? 'fr-FR' : 'en-US'
}

export const defaultNS = 'common'

export const resources = {
  'en-US': {
    common: enCommon,
  },
  'fr-FR': {
    common: frCommon,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: 'en-US',
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n