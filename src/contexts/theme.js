import { createContext } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => null,
})

export default ThemeContext
