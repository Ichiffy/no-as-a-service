import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

type Locale = 'fr' | 'en'

const translations: Record<Locale, Record<string, string>> = {
  fr: {
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
  const [count, setCount] = useState(0)
  const [locale, setLocale] = useState<Locale>('fr')
  const [apiResponse, setApiResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = translations[locale]

  useEffect(() => {
    const initialLocale = detectBrowserLocale()
    if (initialLocale !== locale) {
      setLocale(initialLocale)
    }
  }, [])

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

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value as Locale)
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>{t.title}</h1>
          <p>{t.heroText}</p>
        </div>
        <div className="language-selector">
          <label htmlFor="locale-select">{t.languageLabel}</label>
          <select id="locale-select" value={locale} onChange={handleLocaleChange}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          {t.counterLabel} {count}
        </button>
      </section>

      <section id="api-response">
        <h2>{t.apiSection}</h2>
        {loading && <p>{t.loading}</p>}
        {error && <p style={{ color: 'red' }}>{t.errorPrefix}: {error}</p>}
        {apiResponse && <p>{apiResponse}</p>}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>{t.docsTitle}</h2>
          <p>{t.docsText}</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                {t.explore}
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                {t.learnMore}
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>{t.connectTitle}</h2>
          <p>{t.connectText}</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                {t.github}
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                {t.discord}
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                {t.xcom}
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                {t.bluesky}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
