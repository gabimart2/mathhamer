import React, { useState } from 'react';
import { Grid, TextField, Typography, Box  } from '@mui/material';
import {WeaponSkillInput} from './WeaponSkillInput'
import DiceSkillInput from './DiceSkillInput'

export const WeaponProfileForm = (profile) => {

  const [weaponProfile, setWeaponProfile] = useState({
    attacks: '',
    skill: '',
    strength: '',
    armorPen: '',
    damage: '',
  });

  const handleChange = (field) => (event) => {
    const value = field === 'skill' && event.target.value === '7' ? 'N/A' : event.target.value 
    setWeaponProfile({
      ...weaponProfile,
      [field]: value,
    });
  };

  return (
      <Box component="form" noValidate autoComplete="off" sx={{ p: 3, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{marginBottom: 3}}>
          Perfil del arma atacante
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <DiceSkillInput
              label='A'
              initialValue={weaponProfile.attacks}
              onChange={(val) => setWeaponProfile({ ...weaponProfile, attacks: val })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
          <WeaponSkillInput
            value={weaponProfile.skill}
            onChange={(val) => setWeaponProfile({ ...weaponProfile, skill: val })}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              sx={{width: '80px'}}
              label="F"
              type="number"
              value={weaponProfile.strength}
              onChange={handleChange('strength')}
              inputProps={{ min: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              sx={{width: '80px'}}
              label="FP"
              type="number"
              value={weaponProfile.armorPen}
              onChange={handleChange('armorPen')}
              inputProps={{ max: 0}}

            />
          </Grid>
          <Grid item xs={12}>
            <DiceSkillInput
              label='D'
              initialValue={weaponProfile.damage}
              onChange={(val) => setWeaponProfile({ ...weaponProfile, damage: val })}
            />
          </Grid>
        </Grid>
      </Box>
  );
};

