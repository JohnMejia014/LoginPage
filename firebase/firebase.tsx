// firebase.ts
// web: 625140642199-u0uq2jd95gm448burtu49ek1jkt78f5d.apps.googleusercontent.com
// ios: 625140642199-1c2f913ielsuaeur2b16589q9ca8goeb.apps.googleusercontent.com
// android: 625140642199-0b7r6dbn726jamunbjj4ap1ssmajkeu2.apps.googleusercontent.com
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth
} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
};

const app = initializeApp(firebaseConfig);

// Initialize auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
