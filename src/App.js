import { useEffect, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { GlobalRouter } from './routes/GlobalRouter'
import { ThemeContext } from './context/ThemeContext'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

function App () {
  const [theme, setTheme] = useLocalStorage('theme', 'dark')

  // Crear el tema de MUI según el valor almacenado
  const muiTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: theme === 'dark' ? 'dark' : 'light'
      }
    }), [theme])

  // (Opcional) sincronizar con la clase del body si lo necesitas para otros estilos globales
  useEffect(() => {
    document.body.className = 'body--' + theme
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <GlobalRouter />
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default App
