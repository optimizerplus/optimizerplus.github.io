'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Locale, defaultLocale, locales } from '@/i18n/config'
import { getMessages, Messages } from '@/i18n'

interface I18nContextType {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'boosteroid-optimizer-locale'

// Helper to safely access nested object properties
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // Return the path if not found
    }
  }
  
  return typeof current === 'string' ? current : path
}

// Detect user's preferred language from browser
function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  
  // Check localStorage first
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale
  }
  
  // Check secondary languages
  for (const lang of navigator.languages) {
    const code = lang.split('-')[0]
    if (locales.includes(code as Locale)) {
      return code as Locale
    }
  }
  
  return defaultLocale
}

interface I18nProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale)
  const [messages, setMessages] = useState<Messages>(getMessages(initialLocale || defaultLocale))
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize locale on mount
  useEffect(() => {
    if (!isInitialized) {
      const detectedLocale = detectBrowserLocale()
      setLocaleState(detectedLocale)
      setMessages(getMessages(detectedLocale))
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Handle locale change
  const setLocale = useCallback((newLocale: Locale) => {
    if (!locales.includes(newLocale)) return
    
    setLocaleState(newLocale)
    setMessages(getMessages(newLocale))
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    }
    
    // Update document lang attribute
    document.documentElement.lang = newLocale
  }, [])

  // Translation function
  const t = useCallback((key: string): string => {
    return getNestedValue(messages as unknown as Record<string, unknown>, key)
  }, [messages])

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use translations
export function useTranslations() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider')
  }
  return context
}

// Hook to get specific translation section
export function useTranslation(section: keyof Messages) {
  const { messages, locale, setLocale } = useTranslations()
  return {
    t: messages[section],
    locale,
    setLocale,
  }
}
