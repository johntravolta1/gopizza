import React from 'react';
import {useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans'
import { DMSerifDisplay_400Regular} from '@expo-google-fonts/dm-serif-display'
import {ThemeProvider} from 'styled-components/native'
import theme from './src/theme';
import { Loading } from './src/components/Loading';

import {StatusBar} from 'expo-status-bar'
import { AuthProvider } from './src/hooks/auth';
import { Routes } from './src/routes';
import { Order } from './src/screens/Order';
import { Orders } from './src/screens/Orders';

export default function App() {

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular
  })

  if (!fontsLoaded) {
    return <Loading></Loading>
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style='light' translucent backgroundColor='transparent'></StatusBar>
      <AuthProvider>
        <Routes></Routes>
        {/* <Orders></Orders> */}
      </AuthProvider>
    </ThemeProvider>
  );
}
