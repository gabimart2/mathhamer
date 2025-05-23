import React from 'react'
import TwoColumnLayout from '../components/TwoColumnLayout'
import { WeaponProfileForm } from '../components/WeaponProfileForm'
import { DefensorProfileForm } from '../components/DefensorProfileForm'

export const HomeView = () => {
  return (
    <TwoColumnLayout
      leftContent={
        <div>
          <WeaponProfileForm />
          <DefensorProfileForm />
        </div>
      }
      rightContent={
        <div />
      }
    />
  )
}
