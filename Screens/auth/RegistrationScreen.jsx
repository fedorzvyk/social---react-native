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
  Image,
  BackHandler,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { authSignUpUser } from '../../redux/auth/authOperations';

const initialState = {
  login: '',
  email: '',
  password: '',
};

export default function RegistrationScreen({ navigation }) {
  // console.log(Platform.OS);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);

  const dispatch = useDispatch();

  const [dimensions, setDimension] = useState(
    Dimensions.get('window').width - 20 * 2
  );

  Keyboard.addListener('keyboardDidShow', () => {
    setIsShowKeyboard(true);
  });
  Keyboard.addListener('keyboardDidHide', () => {
    setIsShowKeyboard(false);
  });

  useEffect(() => {
    const onChange = async () => {
      const width = Dimensions.get('window').width - 16 * 2;
      setDimension(width);
    };

    Dimensions.addEventListener('change', onChange);
    // return async () => await Dimensions.removeEventListener('change', onChange);
  }, [dimensions]);

  useEffect(() => {
    const backAction = () => {
      console.log('back');
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };
  const handleSubmit = () => {
    setIsShowKeyboard(false);
    // Keyboard.dismiss();
    console.log(state);
    dispatch(authSignUpUser(state));
    setState(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/images/Photo_BG.png')}
          style={styles.image}
        >
          <View
            // style={styles.wrapper}
            style={{
              ...styles.wrapper,
              height: isShowKeyboard ? 374 : 549,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : ''}
            >
              <View style={styles.formRegistration}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Регистрация</Text>
                </View>
                <View
                  // style={styles.form}
                  style={{
                    ...styles.form,
                    marginBottom: isShowKeyboard ? 20 : 78,
                    width: dimensions,
                  }}
                >
                  <View>
                    <TextInput
                      onFocus={() => setIsShowKeyboard(true)}
                      style={styles.input}
                      onChangeText={value =>
                        setState(prev => ({ ...prev, login: value }))
                      }
                      value={state.login}
                      placeholder="Логин"
                    />
                  </View>

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
                  {!isShowKeyboard ? (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.btnTitle}>SIGN UP</Text>
                      </TouchableOpacity>
                      <View style={styles.login}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Login')}
                        >
                          <Text style={styles.loginTitle}>
                            Уже есть аккаунт? Войти
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.avatar}>
                <Image
                  // style={styles.tinyLogo}
                  source={require('../../assets/images/avatar.png')}
                />
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
    height: 549,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'relative',
  },

  avatar: {
    width: 120,
    height: 120,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
    borderRadius: 16,
  },

  header: {
    marginTop: 92,
    alignItems: 'center',
    marginBottom: 33,
  },
  headerTitle: {
    color: '#212121',
    fontSize: 30,
    fontFamily: 'Roboto-Medium',
    // fontFamily: 'Itim-Regular',
    // fontFamily: 'Roboto-BoldItalic',
  },
  formRegistration: {
    alignItems: 'center',
  },
  form: {
    // marginHorizontal: 16
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
    // fontFamily: 'Itim-Regular',
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
