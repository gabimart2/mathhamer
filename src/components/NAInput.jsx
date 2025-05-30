import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton, Box } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import RestoreIcon from '@mui/icons-material/Restore'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const NAInput = ({ label, initialValue, onChange, min = 2 }) => {
  const [value, setValue] = useState(initialValue)
  const [isNA, setIsNA] = useState(initialValue === 'N/A')
  const [lastValue, setLastValue] = useState(initialValue === 'N/A' ? min : initialValue) // valor por defecto

  const handleToggle = () => {
    if (isNA) {
      setIsNA(false)
      setValue(lastValue)
      onChange(lastValue)
    } else {
      setIsNA(true)
      setLastValue(value)
      setValue('N/A')
      onChange('N/A')
    }
  }

  // numeric handlers
  const incNumeric = () => {
    if (value === '') {
      setValue(String(min))
      onChange(String(min))
    } else {
      const numericValue = Number(value)
      const newValue = numericValue < 6 ? String(numericValue + 1) : '6'
      setValue(newValue)
      onChange(newValue)
    }
  }
  const decNumeric = () => {
    const numericValue = value !== '' ? Number(value) : min
    const newValue = numericValue > min ? String(numericValue - 1) : String(min)
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <TextField
      fullWidth
      sx={{ width: '140px' }}
      label={label}
      type='text'
      value={value}
      inputProps={{ min: 2 }}
      InputProps={{
        readOnly: true,
        startAdornment:
          !isNA && value !== '' ? <InputAdornment position='start'>+</InputAdornment> : null,
        endAdornment: (
          <InputAdornment position='end'>
            {!isNA
              ? (
                <Box display='flex' flexDirection='column' alignItems='right' mr={0}>
                  <IconButton size='small' onClick={incNumeric} disabled={value === '6'}>
                    <ArrowDropUpIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={decNumeric}
                    disabled={Number(value) === min || value === ''}
                  >
                    <ArrowDropDownIcon fontSize='small' />
                  </IconButton>
                </Box>
                )
              : ''}
            <IconButton size='small' onClick={handleToggle}>
              {isNA ? <RestoreIcon fontSize='small' /> : <ClearIcon fontSize='small' />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}

export default NAInput
