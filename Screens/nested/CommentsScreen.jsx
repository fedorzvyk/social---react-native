import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { db } from '../../firebase/config';
import {
  doc,
  collection,
  addDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore/';
import { clearLogEntriesAsync } from 'expo-updates';

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;

  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [photo, setPhoto] = useState('http');

  const { login } = useSelector(state => state.auth);

  useEffect(() => {
    getAllPosts();
    getPhoto();
  }, []);

  const createPost = async () => {
    const docRef = doc(db, 'posts', postId);
    const colRef = collection(docRef, 'comments');
    addDoc(colRef, { comment, login });
  };

  const getAllPosts = async () => {
    const docRef = await doc(db, 'posts', postId);
    const colRef = await collection(docRef, 'comments');
    await onSnapshot(colRef, data =>
      setAllComments(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    );
  };

  const getPhoto = async () => {
    const docRef = await doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setPhoto(docSnap.data().photo);
    } else {
      console.log('No photo!');
    }
  };
  // console.log(photo);

  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: photo }} style={styles.image} />
      </View>
      <SafeAreaView style={styles.commentsContainer}>
        <FlatList
          data={allComments}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text>{item.login}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <TextInput
            placeholder="Comment..."
            style={styles.input}
            onChangeText={setComment}
          />
        </View>
        <TouchableOpacity onPress={createPost} style={styles.sendBtn}>
          {/* <Text style={styles.sendLabel}>add post</Text> */}
          <Ionicons name="arrow-up-circle" size={34} color="#FF6C00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    // justifyContent: 'center',
    paddingHorizontal: 16,
  },
  commentsContainer: {
    flex: 1,
  },
  commentContainer: {
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    width: '100%',
    marginBottom: 24,
  },
  comment: { color: '#212121', fontSize: 13, fontFamily: 'Roboto-Regular' },
  sendBtn: {
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    left: '100%',
    transform: [{ translateX: -42 }, { translateY: 8 }],
  },
  sendLabel: {
    color: '#20b2aa',
    fontSize: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
    marginTop: 31,
    // marginHorizontal: 10,
    // marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    // borderBottomColor: '#20b2aa',
    borderRadius: 100,
    padding: 16,
    color: '#212121',
    placeholderTextColor: '#BDBDBD',
  },
  image: {
    width: '100%',
    marginTop: 32,
    marginBottom: 32,
    // flex: 1,
    height: 240,
    borderRadius: 8,
  },
});

export default CommentsScreen;

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const CommentsScreen = () => (
//   <View style={styles.container}>
//     <Text>CommentsScreen</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default CommentsScreen;
