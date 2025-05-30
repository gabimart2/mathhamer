import { Button, useTheme } from '@mui/material'

export const CustomButton = ({ children, sx = {}, ...props }) => {
  const theme = useTheme()

  const borderColor =
    theme.palette.mode === 'light' ? theme.palette.grey[800] : '#ffffff'

  return (
    <Button
      variant='outlined'
      sx={{
        borderColor,
        color: borderColor,
        '&:hover': {
          borderColor,
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : 'rgba(255, 255, 255, 0.1)'
        },
        ...sx // Permite extender el estilo con props
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
