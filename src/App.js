import { useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { GlobalRouter } from './routes/GlobalRouter'
import { ThemeContext } from './context/ThemeContext'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { AttackerProvider } from './context/AttackerContext'
import { DefenderProvider } from './context/DefenderContext'

function App () {
  const [theme, setTheme] = useLocalStorage('theme', 'dark')

  // Crear el tema de MUI según el valor almacenado
  const muiTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: theme === 'dark' ? 'dark' : 'light'
      }
    }), [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={muiTheme}>
        <AttackerProvider>
          <DefenderProvider>
            <CssBaseline />
            <GlobalRouter />
          </DefenderProvider>
        </AttackerProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default App
