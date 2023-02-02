// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD8UMFbsTjBqOExtSHqPf7Y8ZD_nRgPUEE',
  authDomain: 'socialapp-rnative.firebaseapp.com',
  projectId: 'socialapp-rnative',
  storageBucket: 'socialapp-rnative.appspot.com',
  messagingSenderId: '606358012929',
  appId: '1:606358012929:web:70cf63e1809c36bf776c00',
  measurementId: 'G-T1L5HZTKNH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
