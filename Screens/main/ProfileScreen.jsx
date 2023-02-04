import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { authSignOutUser } from '../../redux/auth/authOperations';
import { useDispatch } from 'react-redux';

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
      <Button title="signout" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'green',
    fontSize: 30,
  },
});
