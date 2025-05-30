import { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, InputAdornment, IconButton, Box } from '@mui/material'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const CustomInput = ({ label, initialValue, onChange, min = 0, max = Infinity, negative = false }) => {
  const [value, setValue] = useState(initialValue)

  const incNumeric = () => {
    if (value === '') {
      setValue(min)
      onChange(min)
    } else {
      const numericValue = Number(value)
      const newValue = numericValue < max ? String(numericValue + 1) : String(max)
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
      label={label}
      sx={{ width: '100px' }}
      variant='outlined'
      value={value}
      InputProps={{
        readOnly: true,
        startAdornment:
            negative && value !== '' && value !== '0' ? (<InputAdornment position='start'>-</InputAdornment>) : null,
        endAdornment: (
          <InputAdornment position='end'>
            <Box display='flex' flexDirection='column' alignItems='right' mr={0}>
              <IconButton size='small' onClick={incNumeric} disabled={Number(value) === max}>
                <ArrowDropUpIcon fontSize='small' />
              </IconButton>
              <IconButton size='small' onClick={decNumeric} disabled={Number(value) === min || value === ''}>
                <ArrowDropDownIcon fontSize='small' />
              </IconButton>
            </Box>
          </InputAdornment>
        )
      }}
    />
  )
}

CustomInput.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func
}

CustomInput.defaultProps = {
  initialValue: '1',
  onChange: null
}

export default CustomInput
