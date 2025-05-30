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
 * - label: etiqueta del TextField
 * - initialValue: valor inicial (ej. '4', 'D3+2', '2D6+3')
 * - onChange: callback que recibe el valor actual cuando el usuario lo modifica
 */
const DiceInput = ({ label, initialValue, onChange }) => {
  const [diceMode, setDiceMode] = useState(false)
  const [numericValue, setNumericValue] = useState('')
  const [diceCount, setDiceCount] = useState(1)
  const [sides, setSides] = useState(3)
  const [modifier, setModifier] = useState(0)
  const [width, setWidth] = useState('120')

  // Parsear initialValue al montar o cuando cambie externamente
  useEffect(() => {
    const str = initialValue.toString()
    const diceMatch = str.match(/^(\d*)D(3|6)(?:\+(\d+))?$/)
    if (diceMatch) {
      setDiceMode(true)
      setDiceCount(parseInt(diceMatch[1] || '1', 10))
      setSides(parseInt(diceMatch[2], 10))
      setModifier(parseInt(diceMatch[3] || '0', 10))
      setNumericValue('')
      setWidth('205')
    } else {
      const num = parseInt(str, 10)
      setDiceMode(false)
      setNumericValue(!isNaN(num) && num >= 1 ? num : '')
      setDiceCount(1)
      setSides(3)
      setModifier(0)
      setWidth('120')
    }
  }, [initialValue, onChange])

  // Helper para notificar cambios al padre
  const notify = value => {
    if (onChange) onChange(value)
  }

  // Handlers: actualizan estado y notifican
  const toggleMode = () => {
    const newMode = !diceMode
    setDiceMode(newMode)
    const newWidth = newMode ? '205' : '120'
    setWidth(newWidth)
    const value = newMode
      ? `${diceCount > 1 ? diceCount : ''}D${sides}${modifier ? `+${modifier}` : ''}`
      : String(numericValue)
    notify(value)
  }

  const incNumeric = () => {
    const next = numericValue === '' ? 1 : numericValue + 1
    setNumericValue(next)
    notify(String(next))
  }
  const decNumeric = () => {
    const next = numericValue > 1 ? numericValue - 1 : 1
    setNumericValue(next)
    notify(String(next))
  }

  const incPrefix = () => {
    let nextCount = diceCount
    let nextSides = sides
    if (sides === 3) {
      nextSides = 6
    } else {
      nextCount = diceCount + 1
    }
    setSides(nextSides)
    setDiceCount(nextCount)
    notify(`${nextCount > 1 ? nextCount : ''}D${nextSides}${modifier ? `+${modifier}` : ''}`)
  }
  const decPrefix = () => {
    let nextCount = diceCount
    let nextSides = sides
    if (diceCount > 1) {
      nextCount = diceCount - 1
    } else if (sides === 6) {
      nextSides = 3
    }
    setDiceCount(nextCount)
    setSides(nextSides)
    notify(`${nextCount > 1 ? nextCount : ''}D${nextSides}${modifier ? `+${modifier}` : ''}`)
  }

  const incModifier = () => {
    const next = modifier + 1
    setModifier(next)
    notify(`${diceCount > 1 ? diceCount : ''}D${sides}+${next}`)
  }
  const decModifier = () => {
    const next = modifier > 0 ? modifier - 1 : 0
    setModifier(next)
    notify(`${diceCount > 1 ? diceCount : ''}D${sides}${next ? `+${next}` : ''}`)
  }

  const displayValue = diceMode
    ? `${diceCount > 1 ? diceCount : ''}D${sides}${modifier ? `+${modifier}` : ''}`
    : (numericValue !== '' ? String(numericValue) : '')

  return (
    <TextField
      label={label}
      variant='outlined'
      value={displayValue}
      sx={{ width: { xs: '100%', sm: `${width}px` } }}
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
            <Box display='flex' flexDirection='column' alignItems='center' mr={1}>
              {diceMode
                ? (
                  <>
                    <IconButton size='small' onClick={incModifier}>
                      <ArrowDropUpIcon fontSize='small' />
                    </IconButton>
                    <IconButton size='small' onClick={decModifier} disabled={modifier === 0}>
                      <ArrowDropDownIcon fontSize='small' />
                    </IconButton>
                  </>
                  )
                : (
                  <>
                    <IconButton size='small' onClick={incNumeric}>
                      <ArrowDropUpIcon fontSize='small' />
                    </IconButton>
                    <IconButton size='small' onClick={decNumeric} disabled={numericValue === '' || numericValue === 1}>
                      <ArrowDropDownIcon fontSize='small' />
                    </IconButton>
                  </>
                  )}
            </Box>
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
  label: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func
}

DiceInput.defaultProps = {
  label: '',
  initialValue: '1',
  onChange: null
}

export default DiceInput
