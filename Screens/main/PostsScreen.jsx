import React from 'react';
import { Button, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Octicons } from '@expo/vector-icons';

import DefaultScreenPosts from '../nested/DefaultScreenPosts';
import CommentsScreen from '../nested/CommentsScreen';
import MapScreen from '../nested/MapScreen';

import { useDispatch } from 'react-redux';
import { authSignOutUser } from '../../redux/auth/authOperations';

const NestedScreen = createStackNavigator();

const PostsScreen = ({}) => {
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(authSignOutUser());
  };
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        // options={{ headerShown: false }}
        name="Posts"
        component={DefaultScreenPosts}
        options={{
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }} onPress={signOut}>
              <Octicons name="sign-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{ headerTitleAlign: 'center' }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{ headerTitleAlign: 'center' }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

// export default function PostsScreen({ route }) {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     if (route.params) {
//       setPosts(prev => [...prev, route.params]);
//     }
//   }, [route.params]);

//   console.log(posts);
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item, indx) => indx}
//         renderItem={({ item }) => (
//           <View style={{ marginBottom: 16 }}>
//             <Image
//               source={{ uri: item.photo }}
//               style={{ width: 300, height: 200 }}
//             />
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     color: 'green',
//     fontSize: 30,
//   },
// });
