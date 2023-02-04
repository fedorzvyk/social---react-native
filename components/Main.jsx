import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import useRoute from '../router';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// import app from '../firebase/config';
import { authStateCahngeUser } from '../redux/auth/authOperations';

// const auth = getAuth(app);

export const Main = () => {
  const { stateChange } = useSelector(state => state.auth);
  console.log(stateChange);
  const dispatch = useDispatch();

  // const [user, setUser] = useState(null);

  // const state = useSelector(state => state);
  // console.log(state);

  // onAuthStateChanged(auth, user => setUser(user));

  useEffect(() => {
    dispatch(authStateCahngeUser());
  }, []);
  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
