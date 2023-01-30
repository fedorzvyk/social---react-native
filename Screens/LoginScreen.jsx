import { useCallback } from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

SplashScreen.preventAutoHideAsync();

const initialState = {
  login: '',
  email: '',
  password: '',
};

export default function LoginScreen() {
  console.log(Platform.OS);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [dimensions, setDimension] = useState(
    Dimensions.get('window').width - 20 * 2
  );

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
  });

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get('window').width - 20 * 2;
      setDimension(width);
      console.log(width);
    };
    Dimensions.addEventListener('change', onChange);
    return () => {
      Dimensions.removeEventListener('change');
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };
  const handleSubmit = () => {
    setIsShowKeyboard(false);
    // Keyboard.dismiss();
    console.log(state);
    setState(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <ImageBackground
          source={require('../assets/images/Photo_BG.png')}
          style={styles.image}
        >
          <View
            // style={styles.wrapper}
            style={{
              ...styles.wrapper,
              height: isShowKeyboard ? 248 : 489,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : ''}
            >
              <View style={styles.formRegistration}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Войти</Text>
                </View>
                <View
                  // style={styles.form}
                  style={{
                    ...styles.form,
                    marginBottom: isShowKeyboard ? 20 : 144,
                    width: dimensions,
                  }}
                >
                  <View style={{ marginTop: 16 }}>
                    <TextInput
                      onFocus={() => setIsShowKeyboard(true)}
                      style={styles.input}
                      onChangeText={value =>
                        setState(prev => ({ ...prev, email: value }))
                      }
                      value={state.email}
                      placeholder="Адрес электронной почты"
                    />
                  </View>

                  <View style={{ marginTop: 16 }}>
                    <TextInput
                      onFocus={() => setIsShowKeyboard(true)}
                      style={styles.input}
                      onChangeText={value =>
                        setState(prev => ({ ...prev, password: value }))
                      }
                      value={state.password}
                      placeholder="Пароль"
                      secureTextEntry={true}
                    />
                  </View>
                  {!isShowKeyboard && (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.btnTitle}>SIGN IN</Text>
                      </TouchableOpacity>
                      <View style={styles.login}>
                        <Text style={styles.loginTitle}>
                          Нет аккаунта? Зарегистрироваться
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
    height: 489,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  header: {
    marginTop: 32,
    alignItems: 'center',
    marginBottom: 33,
  },
  headerTitle: {
    color: '#212121',
    fontSize: 30,
    fontFamily: 'Roboto-Medium',
  },
  form: {
    // marginHorizontal: 16
  },
  formRegistration: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    padding: 16,
    color: '#212121',
    placeholderTextColor: '#BDBDBD',

    borderColor: '#E8E8E8',
    backgroundColor: '#F6F6F6',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',

    height: 51,
    borderRadius: 100,
    marginTop: 43,

    backgroundColor: '#FF6C00',

    // ...Platform.select({
    //   ios: { backgroundColor: '#FF6C00' },
    //   android: { backgroundColor: '#FF6C00' },
    // }),
  },

  btnTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },

  login: {
    alignItems: 'center',
    marginTop: 16,
    // marginBottom: 78,
    // justifyContent: 'center',
  },
  loginTitle: {
    color: '#1B4371',
    fontSize: 16,
  },
});
