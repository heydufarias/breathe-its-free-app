import { useTranslation } from 'react-i18next'
import type { Language } from '../lib/types'
import { motion } from 'framer-motion'

export function Footer() {
  const { i18n } = useTranslation()
  const current = i18n.language

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-[clamp(1.5rem,5vw,2.5rem)] pb-6">
      <div className="flex text-2xl font-semibold tracking-tight leading-7 gap-3">
        {(['en', 'pt-BR'] as Language[]).map((language) => {
          return (
            <button
              key={language}
              onClick={() => i18n.changeLanguage(language)}
              className="relative cursor-pointer"
            >
              {language === 'en' ? 'En' : 'Pt-br'}

              {current === language && (
                <motion.div
                  layoutId="active-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="text-[22px] font-semibold">
        ©2026
      </div>
    </footer>
  )
}