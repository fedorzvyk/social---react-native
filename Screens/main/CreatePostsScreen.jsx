import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebase/config';

import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';

import { Camera, CameraType } from 'expo-camera';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
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
  const [galleryPermission, setGalleryPermission] = useState(null);

  const { userId, login } = useSelector(state => state.auth);

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
    }
    setLocation(await Location.getCurrentPositionAsync({}));
  };

  const sendPhoto = async () => {
    navigation.navigate('Posts', { photo });
    uploadPostToServer();
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    console.log(photo);

    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        photo,
        title,
        location: location.coords,
        userId,
        login,
        place,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
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
    console.log(processedPhoto);
    return processedPhoto;
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.cameraWrapper}> */}
      <Camera style={styles.camera} ref={setCamera}>
        {photo && (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: photo }}
              style={{ height: 100, width: 100 }}
            />
          </View>
        )}
        <TouchableOpacity onPress={takePhoto} style={styles.snapContainer}>
          <FontAwesome name="camera" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Camera>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Title..."
          style={styles.input}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Location..."
          style={styles.input}
          onChangeText={setPlace}
        />
      </View>

      <View>
        <TouchableOpacity onPress={sendPhoto} style={styles.sendBtn}>
          <Text style={styles.sendLabel}>SEND</Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  cameraWrapper: {},
  camera: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 32,

    height: 240,
    // marginTop: 32,
    // marginHorizontal: 16,
    borderRadius: 20,
    // backgroundColor: '#F6F6F6',
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
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6C00',
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
