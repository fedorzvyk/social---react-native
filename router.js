import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//icons import
import { AntDesign, Feather } from '@expo/vector-icons';

import RegistrationScreen from './Screens/auth/RegistrationScreen';
import LoginScreen from './Screens/auth/LoginScreen';
import PostsScreen from './Screens/main/PostsScreen';
import CreatePostsScreen from './Screens/main/CreatePostsScreen';
import ProfileScreen from './Screens/main/ProfileScreen';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export default function useRoute(isAuth) {
  if (!isAuth) {
    return (
      <AuthStack.Navigator initialRouteName="LoginScreen">
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Registration"
          component={RegistrationScreen}
        />
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <MainTab.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          ),
        }}
        name="Posts"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="plus" size={size} color={color} />
          ),
        }}
        name="Create post"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
}
