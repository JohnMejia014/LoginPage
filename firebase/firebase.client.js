// firebase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, getReactNativePersistence, initializeAuth, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_IOS_APP_ID,
  FIREBASE_WEB_APP_ID
} = Constants.expoConfig.extra;
const API_URL = 'http://192.168.1.113:8000'


const firebaseConfig = {
  apiKey: "AIzaSyAPdZ6NkxzNCW_DsvoQ4KyNzRZw3gIztds",
  authDomain: "login-example-cf97f.firebaseapp.com",
  projectId: "login-example-cf97f",
  storageBucket: "login-example-cf97f.appspot.com",
  messagingSenderId: "351905340243",
  appId: "1:351905340243:ios:5f1783ec851afcee3f1fa6",
};

console.log(firebaseConfig);
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Save user to Firestore
const saveUserToFirestore = async (user) => {
  try {
    if (!user.uid) throw new Error('User UID is missing');

    // ✅ Directly call your FastAPI backend to handle user creation
    const response = await axios.post(`${API_URL}/register_user`, {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || user.name || '',
        provider: user.provider || 'email',
        }
      );    
    if (response.data.success) {
      console.log('✅ User registered in backend (and presumably Firestore)');
    } else {
      console.warn('⚠️ Backend registration failed:', response.data.error_message);
    }

  } catch (error) {
    console.error('❌ Error registering user via backend:', error);
  }
};

  
  export { GoogleAuthProvider, OAuthProvider, auth, createUserWithEmailAndPassword, db, onAuthStateChanged, saveUserToFirestore, signInWithCredential, signInWithEmailAndPassword };

