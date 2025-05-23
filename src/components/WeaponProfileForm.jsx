import React, { useState } from 'react';
import { Grid, Typography, Box  } from '@mui/material';
import NAInput from './NAInput'
import DiceInput from './DiceInput'
import CustomInput from './CustomInput';

export const WeaponProfileForm = (profile) => {

  const [weaponProfile, setWeaponProfile] = useState({
    attacks: '',
    skill: '',
    strength: '',
    armorPen: '',
    damage: '',
  });

  const [miniatureNumber, setMiniatureNumber] = useState('')

  return (
      <Box component="form" noValidate autoComplete="off" sx={{ p: 3, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{marginBottom: 3}}>
          Weapon Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <DiceInput
              label='A'
              initialValue={weaponProfile.attacks}
              onChange={(val) => setWeaponProfile({ ...weaponProfile, attacks: val })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <NAInput
              label= 'WS'
              initialValue={weaponProfile.skill}
              onChange={(val) => setWeaponProfile({ ...weaponProfile, skill: val })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              label= 'S'
              initialValue={weaponProfile.strength}
              min={1}
              onChange={(val) => setWeaponProfile({ ...weaponProfile, strength: val })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              label= 'AP'
              initialValue={weaponProfile.armorPen}
              min={0}
              negative={true}
              onChange={(val) => setWeaponProfile({ ...weaponProfile, armorPen: val })}
            />
          </Grid>
          <Grid item xs={12}>
            <DiceInput
              label='D'
              initialValue={weaponProfile.damage}
              onChange={(val) => setWeaponProfile({ ...weaponProfile, damage: val })}
            />
          </Grid>
        </Grid>
        <br/>
        <Typography variant="h6" gutterBottom sx={{marginBottom: 3}}>
          Attacking miniatures   
        </Typography>
        <CustomInput
          label= 'N'
          initialValue={miniatureNumber}
          min={1}
          onChange={(val) => setMiniatureNumber(val)}
        />
      </Box>
  );
};

