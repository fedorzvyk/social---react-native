import React, { useState } from 'react';
import * as Location from 'expo-location';
// import * as Permissions from 'expo-permissions';
import { Camera, CameraType } from 'expo-camera';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function CreatePostsScreen({ navigation }) {
  // console.log(PermissionsAndroid.PERMISSIONS.CAMERA);
  Camera.requestCameraPermissionsAsync();
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState('');
  const [permission, requestPermission] = Camera.useCameraPermissions();
  // const [location, setLocation] = useState(null);

  const takePhoto = async () => {
    console.log(permission);
    if (permission.status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');
      console.log('no permission');
      return;
    }
    const photo = await camera.takePictureAsync();
    setPhoto(photo.uri);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');
      console.log('no location');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    requestPermission();
  };

  const sendPhoto = async () => {
    console.log(navigation);
    navigation.navigate('DefaultScreen', { photo });
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
});
