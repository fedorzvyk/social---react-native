import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Button,
  Text,
  TouchableOpacity,
} from 'react-native';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';

import { Ionicons, Feather } from '@expo/vector-icons';

const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  // const [comments, setComments] = useState([]);

  const getAllPost = async () => {
    const dbRef = await collection(db, 'posts');
    await onSnapshot(dbRef, data =>
      setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    );
  };

  // const getComments = async () => {
  //   // const docRef = await collection(db, 'posts');
  //   const q = query(collection(db, 'posts'));

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach(doc => {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id, ' => ', doc.data().postId);
  //   });
  // };

  // console.log(comments);

  useEffect(() => {
    getAllPost();
    // getComments();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={{ uri: item.photo }} style={styles.image} />

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
                  <Feather name="message-circle" size={18} color="#BDBDBD" />
                </TouchableOpacity>
                {/* <Text style={styles.locationText}>1</Text> */}
              </View>

              <View>
                <TouchableOpacity
                  style={styles.locationWrapper}
                  onPress={() =>
                    navigation.navigate('Map', { location: item.location })
                  }
                >
                  <Ionicons
                    name="ios-location-outline"
                    size={18}
                    color="#BDBDBD"
                  />
                  <Text style={styles.locationText}> {item.place}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  post: {
    marginBottom: 34,
    // justifyContent: 'center',
    alignItems: 'center',
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
  },
  image: {
    width: '100%',
    // flex: 1,
    height: 240,
    borderRadius: 8,
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
});

export default DefaultScreenPosts;
