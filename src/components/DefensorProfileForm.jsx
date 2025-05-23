import React, { useState } from 'react';
import { Grid, Typography, Box  } from '@mui/material';
import NAInput from './NAInput'
import CustomInput from './CustomInput';

export const DefensorProfileForm = (profile) => {

  const [defensorProfile, setDefensorProfile] = useState({
    toughness: '',
    save: '',
    invulnerableSave: 'N/A',
    fellNoPain: 'N/A',
    wounds: '',
  });

  const [miniatureNumber, setMiniatureNumber] = useState('')

  return (
      <Box component="form" noValidate autoComplete="off" sx={{ p: 3, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{marginBottom: 3}}>
          Defensor Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomInput
              label= 'T'
              initialValue={defensorProfile.toughness}
              min={1}
              onChange={(val) => setDefensorProfile({ ...defensorProfile, toughness: val })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              label= 'S'
              initialValue={defensorProfile.save}
              min={1}
              onChange={(val) => setDefensorProfile({ ...defensorProfile, save: val })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <NAInput
              label= 'S+'
              initialValue={defensorProfile.invulnerableSave}
              onChange={(val) => setDefensorProfile({ ...defensorProfile, invulnerableSave: val })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <NAInput
              label= 'FNP'
              initialValue={defensorProfile.fellNoPain}
              onChange={(val) => setDefensorProfile({ ...defensorProfile, fellNoPain: val })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              label= 'W'
              initialValue={defensorProfile.wounds}
              min={1}
              onChange={(val) => setDefensorProfile({ ...defensorProfile, wounds: val })}
            />
          </Grid>
        </Grid>
        <br/>
        <Typography variant="h6" gutterBottom sx={{marginBottom: 3}}>
          Defending miniatures   
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

