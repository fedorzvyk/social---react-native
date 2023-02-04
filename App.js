import React, { useState, useEffect } from 'react';

// import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { store } from './redux/store';
import { Provider, useSelector } from 'react-redux';
// import { NavigationContainer } from '@react-navigation/native';
import { Main } from './components/Main';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
// import app from './firebase/config';

// import useRoute from './router';
// const auth = getAuth(app);

SplashScreen.preventAutoHideAsync();

export default function App({}) {
  // const [user, setUser] = useState(null);
  // const routing = useRoute(user);

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'Itim-Regular': require('./assets/fonts/Itim-Regular.ttf'),
    'Roboto-BoldItalic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
  });

  // onAuthStateChanged(auth, user => {
  //   setUser(user);
  //   console.log(user);
  // });

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
      {/* <NavigationContainer>{routing}</NavigationContainer> */}
      <Main />
    </Provider>
  );
}
