import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { VI } from './data/vi'

export type Lang = 'en' | 'vi'

interface LangValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** translate an English string; falls back to the English text when there is no translation */
  t: (s: string) => string
}

const LangContext = createContext<LangValue>({ lang: 'en', setLang: () => {}, t: (s) => s })

const KEY = 'portfolio-lang'

function initialLang(): Lang {
  try {
    return localStorage.getItem(KEY) === 'vi' ? 'vi' : 'en'
  } catch {
    return 'en'
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch { /* storage unavailable */ }
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = (s: string) => (lang === 'vi' ? VI[s] ?? s : s)

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
