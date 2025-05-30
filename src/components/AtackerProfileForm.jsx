import { Grid, Typography, Box } from '@mui/material'
import NAInput from './NAInput'
import DiceInput from './DiceInput'
import CustomInput from './CustomInput'
import { useAttacker } from '../context/AttackerContext'

export const AtackerProfileForm = () => {
  const { attacker, updateProfile, setNumModels } = useAttacker()

  return (
    <Box component='form' noValidate autoComplete='off' sx={{ p: 3, mx: 'auto', mt: 4 }}>
      <Typography variant='h6' gutterBottom sx={{ marginBottom: 3 }}>
        Weapon Profile
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2}>
          <DiceInput
            label='A'
            initialValue={attacker.profile.attacks}
            onChange={(val) => updateProfile({ attacks: val })}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <NAInput
            label='WS'
            initialValue={attacker.profile.skill}
            onChange={(val) => updateProfile({ skill: val })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label='S'
            initialValue={attacker.profile.strength}
            min={1}
            onChange={(val) => updateProfile({ strength: val })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label='AP'
            initialValue={attacker.profile.armorPen}
            min={0}
            negative
            onChange={(val) => updateProfile({ armorPen: val })}
          />
        </Grid>
        <Grid item xs={12}>
          <DiceInput
            label='D'
            initialValue={attacker.profile.damage}
            onChange={(val) => updateProfile({ damage: val })}
          />
        </Grid>
      </Grid>
      <br />
      <Typography variant='h6' gutterBottom sx={{ marginBottom: 3 }}>
        Attacking miniatures
      </Typography>
      <CustomInput
        label='N'
        initialValue={attacker.numModels}
        min={1}
        onChange={(val) => setNumModels(val)}
      />
    </Box>
  )
}
