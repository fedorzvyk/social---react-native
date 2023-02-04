import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
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
export const app = initializeApp(firebaseConfig);

// export default app;
export const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// rules_version = '2';
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if false;
//     }
//   }
// }
