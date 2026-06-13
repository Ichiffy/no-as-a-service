import { useState, useEffect } from 'react'
import NaaSLogo from './assets/imgs/naas-with-no-logo-bunny.png'
import './App.css'

type Locale = 'fr' | 'en'

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    bannerTitle: 'No-as-a-Service',
    title: 'Démarrage',
    heroText: 'Éditez src/App.tsx et enregistrez pour tester HMR',
    counterLabel: 'Compteur:',
    apiSection: 'Comment dire Non :',
    languageLabel: 'Langue',
    loading: 'Chargement...',
    errorPrefix: 'Erreur',
    docsTitle: 'Documentation',
    docsText: 'Vos questions, répondues',
    explore: 'Explorer Vite',
    learnMore: 'En savoir plus',
    connectTitle: 'Connectez-vous',
    connectText: 'Rejoignez la communauté Vite',
    github: 'GitHub',
    discord: 'Discord',
    xcom: 'X.com',
    bluesky: 'Bluesky',
  },
  en: {
    bannerTitle: 'No-as-a-Service',
    title: 'Get started',
    heroText: 'Edit src/App.tsx and save to test HMR',
    counterLabel: 'Count is',
    apiSection: 'How to say No:',
    languageLabel: 'Language',
    loading: 'Loading...',
    errorPrefix: 'Error',
    docsTitle: 'Documentation',
    docsText: 'Your questions, answered',
    explore: 'Explore Vite',
    learnMore: 'Learn more',
    connectTitle: 'Connect with us',
    connectText: 'Join the Vite community',
    github: 'GitHub',
    discord: 'Discord',
    xcom: 'X.com',
    bluesky: 'Bluesky',
  },
}

const detectBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') {
    return 'fr'
  }

  const language = navigator.languages?.[0] || navigator.language || 'fr'
  return language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

function App() {
  const [locale, setLocale] = useState<Locale>(detectBrowserLocale)
  const [apiResponse, setApiResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = translations[locale]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8080/api/no?lang=${locale}`)
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const data = await response.json()
        setApiResponse(data.message)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        setApiResponse(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  return (
    <>
      <header className="app-banner">
        <img src={NaaSLogo} alt="No-as-a-Service Logo" className="base"height="179" />
        <h1>{t.bannerTitle}</h1>
        <div className="locale-switch">
          <button
            type="button"
            className={locale === 'en' ? 'active' : ''}
            onClick={() => setLocale('en')}
          >
            EN
          </button>
          <span className="switch-separator">/</span>
          <button
            type="button"
            className={locale === 'fr' ? 'active' : ''}
            onClick={() => setLocale('fr')}
          >
            FR
          </button>
        </div>
      </header>
      <section id="api-response">
        <h2>{t.apiSection}</h2>
        {loading && <p>{t.loading}</p>}
        {error && <p style={{ color: 'red' }}>{t.errorPrefix}: {error}</p>}
        {apiResponse && <p>{apiResponse}</p>}
      </section>

    </>
  )
}

export default App
