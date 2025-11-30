'use client'

import { useState, useRef, useEffect } from 'react'
import { Locale, locales, localeNames, localeCodes } from '@/i18n/config'

interface LanguageSelectorProps {
  currentLocale: Locale
  onLocaleChange: (locale: Locale) => void
  compact?: boolean // Pour le mode mobile avec juste le globe
}

export default function LanguageSelector({ currentLocale, onLocaleChange, compact = false }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div ref={dropdownRef} className="relative z-[100]">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg transition-all duration-300 text-white/80 hover:text-white ${
          compact 
            ? 'p-2 bg-white/5 hover:bg-white/10' 
            : 'px-3 py-2 bg-white/5 border border-white/20 hover:border-boo-blue/50 hover:bg-white/10 text-sm font-medium'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        {/* Globe Icon */}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        {!compact && (
          <>
            <span className="uppercase font-mono text-xs">{localeCodes[currentLocale]}</span>
            <svg 
              className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown - Superposed */}
      {isOpen && (
        <div 
          className="fixed md:absolute right-4 md:right-0 mt-2 w-56 md:w-48 max-h-[60vh] overflow-y-auto rounded-xl bg-[#0a0e17]/95 backdrop-blur-xl border border-boo-blue/30 shadow-2xl shadow-black/80"
          role="listbox"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0a0e17] px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-xs font-medium uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Language
            </div>
          </div>

          {/* Language List */}
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => {
                  onLocaleChange(locale)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left
                  transition-all duration-150
                  ${currentLocale === locale 
                    ? 'bg-boo-blue/20 text-boo-blue border-l-2 border-boo-blue' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white border-l-2 border-transparent'
                  }
                `}
                role="option"
                aria-selected={currentLocale === locale}
              >
                <span className="w-8 font-mono text-xs uppercase text-white/50">{localeCodes[locale]}</span>
                <span className="flex-1 text-sm font-medium">{localeNames[locale]}</span>
                {currentLocale === locale && (
                  <svg className="w-4 h-4 text-boo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
