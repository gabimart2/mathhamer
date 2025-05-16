import React from 'react';
import TwoColumnLayout from '../components/TwoColumnLayout';
import {WeaponProfileForm} from '../components/WeaponProfileForm';

export const HomeView = () => {
  return (
    <TwoColumnLayout
      leftContent={
        <div>
          <WeaponProfileForm/>
        </div>
      }
      rightContent={
        <div/>
      }
    />
  );
};
