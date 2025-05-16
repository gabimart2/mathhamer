import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import RestoreIcon from '@mui/icons-material/Restore'


export const WeaponSkillInput = ({ value, onChange }) => {
  
    const isNA = value === 'N/A'
    const [lastValue, setLastValue] = useState(2) // valor por defecto
  
    const handleToggle = () => {
      if (isNA) {
        onChange(lastValue)
      } else {
        setLastValue(value !== '' && !isNaN(value) ? Number(value) : 4)
        onChange('N/A')
      }
    }
  
    const handleInputChange = (e) => {
      const val = e.target.value.toUpperCase()
      if (val === '' || val === 'N/A' || (!isNaN(val) && Number(val) >= 2 && Number(val) <= 6)) {
        onChange(val)
      }
    }
  
    return (
      <TextField
        fullWidth
        sx={{ width: '120px' }}
        label="H"
        type={isNA ? 'text' : 'number'}
        value={value}
        onChange={handleInputChange}
        inputProps={{ min: 2 }}
        InputProps={{
          startAdornment:
            !isNA && value !== '' ? (
              <InputAdornment position="start">+</InputAdornment>
            ) : null,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleToggle}>
                {isNA ? <RestoreIcon fontSize="small" /> : <ClearIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );

}

