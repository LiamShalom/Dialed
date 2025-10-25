'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAppStore()
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Update theme when user changes
  useEffect(() => {
    if (user?.theme) {
      setThemeState(user.theme)
    }
  }, [user])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setResolvedTheme(systemTheme)
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      setResolvedTheme(theme)
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(systemTheme)
        document.documentElement.classList.toggle('dark', systemTheme === 'dark')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    
    // Update in database if user is logged in
    if (user) {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        await (supabase as any)
          .from('users')
          .update({ theme: newTheme })
          .eq('id', user.id)

        // Update local user state
        setUser({ ...user, theme: newTheme })
      } catch (error) {
        console.error('Failed to update theme:', error)
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
