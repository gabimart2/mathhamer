import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TextField, InputAdornment, IconButton, Box } from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

/**
 * Componente DiceInput: alterna entre modo numérico (>=1)
 * y modo 'dados' con dos controles: prefijo (D3→D6→2D6→3D6…) y sufijo (+X).
 * Props:
 * - initialValue: valor inicial (p.ej. '4', 'D3+2', 'D6+1', '2D6+3')
 * - onChange: callback que recibe el valor actual
 */
const DiceInput = ({ label, initialValue, onChange }) => {
  const [diceMode, setDiceMode] = useState(false)
  const [numericValue, setNumericValue] = useState('')
  const [diceCount, setDiceCount] = useState(1)
  const [sides, setSides] = useState(3)
  const [modifier, setModifier] = useState(0)
  const [width, setWidth] = useState('120')

  // parse initialValue
  useEffect(() => {
    const str = initialValue.toString()
    const diceMatch = str.match(/^(\d*)D(3|6)(?:\+(\d+))?$/)
    if (diceMatch) {
      setDiceMode(true)
      setDiceCount(parseInt(diceMatch[1] || '1', 10))
      setSides(parseInt(diceMatch[2], 10))
      setModifier(parseInt(diceMatch[3] || '0', 10))
    } else {
      const num = parseInt(str, 10)
      setDiceMode(false)
      setNumericValue(isNaN(num) || num < 1 ? '' : num)
      setDiceCount(1)
      setSides(3)
      setModifier(0)
    }
  }, [initialValue])

  // notify changes
  useEffect(() => {
    if (onChange) {
      const value = diceMode
        ? `${diceCount > 1 ? diceCount : ''}D${sides}${modifier ? `+${modifier}` : ''}`
        : String(numericValue)
      onChange(value)
    }
  }, [diceMode, numericValue, diceCount, sides, modifier])

  // toggle between numeric and dice modes
  const toggleMode = () => {
    setWidth(!diceMode ? '205' : '120')
    setDiceMode(m => !m)
  }

  // numeric handlers
  const incNumeric = () => setNumericValue(v => v + 1)
  const decNumeric = () => setNumericValue(v => (v > 1 ? v - 1 : 1))

  // dice prefix handlers (diceCount & sides)
  const incPrefix = () => {
    if (sides === 3) {
      setSides(6)
    } else {
      setDiceCount(c => c + 1)
    }
  }
  const decPrefix = () => {
    if (diceCount > 1) {
      setDiceCount(c => c - 1)
    } else if (sides === 6) {
      setSides(3)
    }
  }

  // dice suffix handlers (modifier)
  const incModifier = () => setModifier(m => m + 1)
  const decModifier = () => setModifier(m => (m > 0 ? m - 1 : 0))

  // displayed value
  const displayValue = diceMode
    ? `${diceCount > 1 ? diceCount : ''}D${sides}${modifier ? `+${modifier}` : ''}`
    : !isNaN(numericValue) ? String(numericValue) : ''

  return (
    <TextField
      label={label}
      sx={{ width: width + 'px' }}
      variant='outlined'
      value={displayValue}
      InputProps={{
        readOnly: true,
        startAdornment: diceMode && (
          <InputAdornment position='start'>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <IconButton size='small' onClick={incPrefix}>
                <ArrowDropUpIcon fontSize='small' />
              </IconButton>
              <IconButton size='small' onClick={decPrefix} disabled={sides === 3}>
                <ArrowDropDownIcon fontSize='small' />
              </IconButton>
            </Box>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position='end'>
            {diceMode
              ? (
                <Box display='flex' flexDirection='column' alignItems='center' mr={1}>
                  <IconButton size='small' onClick={incModifier}>
                    <ArrowDropUpIcon fontSize='small' />
                  </IconButton>
                  <IconButton size='small' onClick={decModifier} disabled={!modifier}>
                    <ArrowDropDownIcon fontSize='small' />
                  </IconButton>
                </Box>
                )
              : (
                <Box display='flex' flexDirection='column' alignItems='center'>
                  <IconButton size='small' onClick={incNumeric}>
                    <ArrowDropUpIcon fontSize='small' />
                  </IconButton>
                  <IconButton size='small' onClick={decNumeric} disabled={numericValue === '' || numericValue === 1}>
                    <ArrowDropDownIcon fontSize='small' />
                  </IconButton>
                </Box>)}
            <IconButton size='small' onClick={toggleMode} edge='end'>
              <CasinoIcon fontSize='small' />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}

DiceInput.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func
}

DiceInput.defaultProps = {
  initialValue: '1',
  onChange: null
}

export default DiceInput
