import { collection, addDoc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebase/config';

import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
// import { Entypo } from '@expo/vector-icons';

import { Camera, CameraType } from 'expo-camera';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';

export default function CreatePostsScreen({ navigation }) {
  // Camera.requestCameraPermissionsAsync();
  // const [permission, requestPermission] = Camera.useCameraPermissions();

  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState('');
  const [cameraPermission, setCameraPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const { userId, login } = useSelector(state => state.auth);
  const isFocused = useIsFocused();
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  Keyboard.addListener('keyboardDidShow', () => {
    setIsShowKeyboard(true);
  });
  Keyboard.addListener('keyboardDidHide', () => {
    setIsShowKeyboard(false);
  });

  const permisionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.status === 'granted');
    if (cameraPermission.status !== 'granted') {
      alert('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const takePhoto = async () => {
    if (camera) {
      const image = await camera.takePictureAsync();
      setPhoto(image.uri);
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('no location');
      return;
    } else setLocation((await Location.getCurrentPositionAsync({})).coords);
  };

  const sendPhoto = async e => {
    navigation.navigate('Posts', { photo });
    uploadPostToServer();
    setIsShowKeyboard(false);
    setPlace('');
    setTitle('');
    setPhoto('');
  };

  // function toggleCameraType() {
  //   setType(current =>
  //     current === CameraType.back ? CameraType.front : CameraType.back
  //   );
  // }

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    try {
      await addDoc(collection(db, 'posts'), {
        photo,
        title,
        location,
        userId,
        login,
        place,
      });
    } catch (e) {
      console.error('Error adding post: ', e);
    }
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const postId = await Date.now().toString();

    const storageRef = await ref(storage, `postImages/${postId}`);
    await uploadBytes(storageRef, file);
    //   .then(snapshot => {
    //   console.log(snapshot);
    // });

    const processedPhoto = await getDownloadURL(
      ref(storage, `postImages/${postId}`)
    );
    // .then(url => {
    //   // `url` is the download URL for 'images/stars.jpg'

    //   // This can be downloaded directly:
    //   const xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob';
    //   xhr.onload = event => {
    //     const blob = xhr.response;
    //   };
    //   xhr.open('GET', url);
    //   xhr.send();

    //   // Or inserted into an <img> element
    //   const img = document.getElementById('myimg');
    //   img.setAttribute('src', url);
    // })
    // .catch(error => {
    //   // Handle any errors
    // });
    // console.log(processedPhoto);
    return processedPhoto;
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        {isFocused && !isShowKeyboard && (
          <View style={styles.cameraWrapper}>
            <Camera
              style={styles.camera}
              ref={setCamera}
              type={type}
              // ratio={'4:3'}
            >
              {photo && (
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo }}
                    style={{ height: 100, width: 100 }}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={takePhoto}
                style={styles.snapContainer}
              >
                <FontAwesome name="camera" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </Camera>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            value={title}
            placeholder="Title..."
            style={styles.input}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={place}
            placeholder="Location..."
            style={styles.input}
            onChangeText={setPlace}
          />
        </View>
        <View
        // style={{
        //   marginBottom: isShowKeyboard ? 20 : 20,
        // }}
        >
          {(!photo || !title || !place) && (
            <Text style={styles.notice}>
              *Make photo and fill out all fields
            </Text>
          )}
          <TouchableOpacity
            disabled={!photo || !title || !place}
            onPress={sendPhoto}
            style={
              !photo || !title || !place
                ? { ...styles.sendBtn, ...styles.buttonDisabled }
                : styles.sendBtn
            }
            // style={styles.sendBtn}
          >
            <Text style={styles.sendLabel}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  cameraWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 32,
    marginTop: 32,
  },
  camera: {
    alignItems: 'center',
    justifyContent: 'center',

    // aspectRatio: 4 / 3,
    height: 240,
  },
  notice: {
    alignSelf: 'center',
    color: 'red',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },

  photoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderColor: '#fff',
    borderWidth: 1,
  },
  snap: {
    color: '#fff',
  },
  snapContainer: {
    // marginTop: 140,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    // marginHorizontal: 30,
    height: 51,
    borderRadius: 100,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6C00',
  },
  buttonDisabled: {
    backgroundColor: 'grey',
  },

  sendLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderBottomColor: '#E8E8E8',
  },
});
