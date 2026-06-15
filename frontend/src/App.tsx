import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NaaSLogo from './assets/imgs/naas-with-no-logo-bunny.png'
import './App.css'

type Locale = 'fr-FR' | 'en-US'

const languageToApiLocale: Record<Locale, 'fr' | 'en'> = {
  'en-US': 'en',
  'fr-FR': 'fr',
}

function App() {
  const { i18n, t } = useTranslation()
  const activeLocale = i18n.resolvedLanguage === 'fr-FR' ? 'fr-FR' : 'en-US'
  const [apiResponse, setApiResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8080/api/no?lang=${languageToApiLocale[activeLocale]}`)
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const data = await response.json()
        setApiResponse(data.message)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('unknownError'))
        setApiResponse(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeLocale, t])

  const switchLanguage = (locale: Locale) => {
    void i18n.changeLanguage(locale)
  }

  return (
    <>
      <header className="app-banner">
        <img src={NaaSLogo} alt="No-as-a-Service Logo" className="base" height="179" />
        <h1>{t('bannerTitle')}</h1>
        <div className="locale-switch">
          <button
            type="button"
            className={activeLocale === 'en-US' ? 'active' : ''}
            onClick={() => switchLanguage('en-US')}
          >
            EN
          </button>
          <span className="switch-separator">/</span>
          <button
            type="button"
            className={activeLocale === 'fr-FR' ? 'active' : ''}
            onClick={() => switchLanguage('fr-FR')}
          >
            FR
          </button>
        </div>
      </header>
      <section id="api-response">
        <h2>{t('apiSection')}</h2>
        {loading && <p>{t('loading')}</p>}
        {error && <p style={{ color: 'red' }}>{t('errorPrefix')}: {error}</p>}
        {apiResponse && <p>{apiResponse}</p>}
      </section>

    </>
  )
}

export default App
