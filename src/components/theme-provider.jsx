import { useEffect, useState } from 'react'
import ThemeContext from '@/contexts/theme'

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'theme', ...props }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeContext.Provider
      value={value}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
