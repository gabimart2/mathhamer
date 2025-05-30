import React from 'react'
import { Grid, Typography, Box } from '@mui/material'
import NAInput from './NAInput'
import CustomInput from './CustomInput'
import { useDefender } from '../context/DefenderContext'

export const DefenderProfileForm = () => {
  const { defender, updateProfile, setNumModels } = useDefender()

  return (
    <Box component='form' noValidate autoComplete='off' sx={{ p: 3, mx: 'auto', mt: 4 }}>
      <Typography variant='h6' gutterBottom sx={{ marginBottom: 3 }}>
        Defensor Profile
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label='T'
            initialValue={defender.profile.toughness}
            min={1}
            onChange={(val) => updateProfile({ toughness: val })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label='S'
            initialValue={defender.profile.save}
            min={1}
            max={7}
            onChange={(val) => updateProfile({ save: val })}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <NAInput
            label='S+'
            initialValue={defender.profile.invulnerableSave}
            onChange={(val) => updateProfile({ invulnerableSave: val })}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <NAInput
            label='FNP'
            initialValue={defender.profile.fellNoPain}
            onChange={(val) => updateProfile({ fellNoPain: val })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label='W'
            initialValue={defender.profile.wounds}
            min={1}
            onChange={(val) => updateProfile({ wounds: val })}
          />
        </Grid>
      </Grid>
      <br />
      <Typography variant='h6' gutterBottom sx={{ marginBottom: 3 }}>
        Defending miniatures
      </Typography>
      <CustomInput
        label='N'
        initialValue={defender.numModels}
        min={1}
        onChange={(val) => setNumModels(val)}
      />
    </Box>
  )
}
