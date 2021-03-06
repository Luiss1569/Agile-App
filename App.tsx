import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainStack from './src/pages/MainStack';

import { ThemeProvider } from 'styled-components/native';
import { light } from './src/styles/themes';
import { StatusBar } from 'expo-status-bar';
import UserContext from './src/contexts/User';

export default () => {
  return (
    <UserContext>
      <ThemeProvider theme={light}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </ThemeProvider>
      <StatusBar style="auto" translucent />
    </UserContext>
  );
};
