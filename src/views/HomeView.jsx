import React from 'react'
import TwoColumnLayout from '../components/TwoColumnLayout'
import { AtackerProfileForm } from '../components/AtackerProfileForm'
import { DefenderProfileForm } from '../components/DefenderProfileForm'
import { Box } from '@mui/material'
import { CustomButton } from '../components/CustomButton'
import CalculationService from '../services/CalculationService'
import { useAttacker } from '../context/AttackerContext'
import { useDefender } from '../context/DefenderContext'

export const HomeView = () => {
  const { attacker } = useAttacker()
  const { defender } = useDefender()
  const calculateResults = () => {
    const result = CalculationService.calculate(attacker, defender)
    console.log('Result: ', result)
  }

  return (
    <TwoColumnLayout
      leftContent={
        <Box>
          <AtackerProfileForm />
          <DefenderProfileForm />
          <Box display='flex'>
            <CustomButton
              sx={{ ml: 'auto', mr: 2 }}
              onClick={calculateResults}
            >
              Calculate
            </CustomButton>
          </Box>
        </Box>
      }
      rightContent={
        <Box />
      }
    />
  )
}
