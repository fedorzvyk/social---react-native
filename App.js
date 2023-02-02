import React from 'react';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

import useRoute from './router';

SplashScreen.preventAutoHideAsync();

export default function App({ navigation }) {
  const routing = useRoute(true);

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'Itim-Regular': require('./assets/fonts/Itim-Regular.ttf'),
    'Roboto-BoldItalic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  console.log(onLayoutRootView());

  return (
    <Provider store={store}>
      <NavigationContainer>{routing}</NavigationContainer>
    </Provider>
  );
}
