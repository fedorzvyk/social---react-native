import { app } from '../../firebase/config';
import { updateUserProfile, authStateChange, authSignOut } from './authReducer';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';

const auth = getAuth(app);

export const authSignUpUser =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log(auth.currentUser);
      // const userName = auth.currentUser;
      // await userName.updateProfile({
      //   displayName: login,
      // });

      await updateProfile(auth.currentUser, { displayName: login });

      // user.displayName = login;

      const userUpdateProfile = {
        userId: user.uid,
        login: user.displayName,
      };

      dispatch(updateUserProfile(userUpdateProfile));
      // console.log(user);
    } catch (error) {
      // console.log(error);
      console.log(error.message);
    }
  };

export const authSignInUser =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    // console.log('email, password, login', email, password);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      // console.log(user);
    } catch (error) {
      // console.log(error);
      console.log(error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  await signOut(auth)
    .then(() => {})
    .catch(error => {
      alert(error);
    });
  dispatch(authSignOut());
};

export const authStateCahngeUser = () => async (dispatch, getState) => {
  await onAuthStateChanged(auth, user => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        login: user.displayName,
      };

      dispatch(updateUserProfile(userUpdateProfile));
      dispatch(authStateChange({ stateChange: true }));
    }

    //   console.log(user);
  });
};
