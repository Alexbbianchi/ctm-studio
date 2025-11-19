"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, Moon, Sun, Languages } from 'lucide-react'
import { useLocale } from '@/hooks/use-locale'
import { useTheme } from '@/hooks/use-theme'
import type { Locale } from '@/lib/i18n'

export function SettingsMenu() {
  const { locale, setLocale, t } = useLocale()
  const { theme, toggleTheme } = useTheme()

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t.language}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLocaleChange('pt')} className={locale === 'pt' ? 'bg-accent' : ''}>
          <Languages className="w-4 h-4 mr-2" />
          Português
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange('en')} className={locale === 'en' ? 'bg-accent' : ''}>
          <Languages className="w-4 h-4 mr-2" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange('es')} className={locale === 'es' ? 'bg-accent' : ''}>
          <Languages className="w-4 h-4 mr-2" />
          Español
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4 mr-2" />
              {t.darkMode}
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 mr-2" />
              {t.lightMode}
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
