import React, { useContext } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip
} from '@mui/material'
// Icons
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { ThemeContext } from '../context/ThemeContext'
import logo from '../static/img/logo.png'

export const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext)

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <Box>
      <AppBar
        position='static'
        elevation={1}
        color='default'
        sx={{
          bgcolor: theme === 'light' ? 'background.navbar' : 'background.default',
          height: '100px'
        }}
      >
        <Toolbar>
          <Typography
            variant='h6'
            component='div'
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            <img src={logo} alt='Logo' width={260} height={90} />
          </Typography>

          <Tooltip title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}>
            <IconButton onClick={handleThemeToggle} color='inherit'>
              {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
