import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { authSignOutUser } from '../../redux/auth/authOperations';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Octicons } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';

const ProfileScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const { userId, login } = useSelector(state => state.auth);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const postsRef = await collection(db, 'posts');
    const q = await query(postsRef, where('userId', '==', userId));
    await onSnapshot(q, data =>
      setUserPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    );
  };
  const signOut = () => {
    dispatch(authSignOutUser());
  };

  console.log(userPosts);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/Photo_BG.png')}
        style={styles.imageBack}
      >
        <View style={styles.wrapper}>
          <TouchableOpacity style={styles.btn} onPress={signOut}>
            <Octicons name="sign-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <View>
            <View style={styles.login}>
              <Text style={styles.loginTitle}>{login}</Text>
            </View>
            <FlatList
              data={userPosts}
              keyExtractor={(item, indx) => indx.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={{ uri: item.photo }}
                    style={{ width: '100%', height: 240, borderRadius: 8 }}
                  />
                  <View style={styles.title}>
                    <Text style={styles.titleText}>{item.title}</Text>
                  </View>

                  <View style={styles.btnsWrapper}>
                    <View>
                      <TouchableOpacity
                        // title="go to Comments"
                        onPress={() =>
                          navigation.navigate('Comments', { postId: item.id })
                        }
                      >
                        <Feather
                          name="message-circle"
                          size={18}
                          color="#BDBDBD"
                        />
                      </TouchableOpacity>
                      {/* <Text style={styles.locationText}>1</Text> */}
                    </View>

                    <View>
                      <TouchableOpacity
                        style={styles.locationWrapper}
                        onPress={() =>
                          navigation.navigate('Map', {
                            location: item.location,
                          })
                        }
                      >
                        <Ionicons
                          name="ios-location-outline"
                          size={18}
                          color="#BDBDBD"
                        />
                        <Text style={styles.locationText}>{item.place}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
          <View style={styles.avatar}>
            <Image
              // style={styles.tinyLogo}
              source={require('../../assets/images/avatar.png')}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
    height: 549,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingBottom: 150,

    // position: 'relative',
  },
  login: {},
  loginTitle: {
    marginTop: 48,
    marginBottom: 32,
    fontSize: 30,
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
  },
  imageBack: {
    flex: 1,
    // resizeMode: 'cover',
    justifyContent: 'flex-end',

    // alignItems: 'center',
  },
  btn: {
    marginTop: 24,
    marginRight: 16,
    marginLeft: 'auto',
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
  title: {
    marginTop: 8,
    width: '100%',
    justifyContent: 'flex-start',
  },
  titleText: {
    color: '#212121',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  locationText: {
    color: '#212121',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textDecorationLine: 'underline',
  },
  locationWrapper: { display: 'flex', flexDirection: 'row' },
  btnsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
    width: '100%',
    marginTop: 8,
    marginBottom: 34,
  },
});

export default ProfileScreen;
