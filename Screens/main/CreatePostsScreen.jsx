import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebase/config';

import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

// import * as Permissions from 'expo-permissions';
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
  Camera.requestCameraPermissionsAsync();

  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState('');
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState(null);

  const [permission, requestPermission] = Camera.useCameraPermissions();
  // requestPermission();
  console.log(permission);
  const { userId, login } = useSelector(state => state.auth);

  const takePhoto = async () => {
    console.log(permission);
    if (permission.status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');
      console.log('no permission');
      return;
    } else {
      const image = await camera.takePictureAsync();
      setPhoto(image.uri);
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');
      console.log('no location');
      return;
    }
    setLocation(await Location.getCurrentPositionAsync({}));

    // setLocation(location);
    await requestPermission();
  };

  const sendPhoto = async () => {
    // console.log(location);
    // console.log(comment);
    // console.log(navigation);
    navigation.navigate('DefaultScreen', { photo });
    uploadPostToServer();
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    console.log(photo);

    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        photo,
        comment,
        location: location.coords,
        userId,
        login,
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
              style={{ height: 200, width: 200 }}
            />
          </View>
        )}
        <TouchableOpacity onPress={takePhoto} style={styles.snapContainer}>
          <Text style={styles.snap}>SNAP</Text>
        </TouchableOpacity>
      </Camera>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} onChangeText={setComment} />
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
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  cameraWrapper: {},
  camera: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 10,

    height: '70%',
    // marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 20,
    // backgroundColor: '#F6F6F6',
  },
  photoContainer: {
    position: 'absolute',
    top: 50,
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
    borderWidth: 1,
    borderColor: '#ff0000',
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    marginHorizontal: 30,
    height: 40,
    borderWidth: 2,
    borderColor: '#20b2aa',
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendLabel: {
    color: '#20b2aa',
    fontSize: 20,
  },
  inputContainer: {
    marginHorizontal: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderBottomColor: '#20b2aa',
  },
});
