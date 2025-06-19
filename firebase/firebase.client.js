// firebase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getReactNativePersistence, initializeAuth, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} = Constants.expoConfig.extra;


const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
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

    const userRef = doc(db, 'users', user.uid);

    await setDoc(userRef, {
      name: user.displayName || user.name || '',
      email: user.email || '',
      provider: user.provider || 'email',
      createdAt: new Date(),
    });

    console.log('✅ User saved to Firestore');
  } catch (error) {
    console.error('❌ Error saving user to Firestore:', error);
  }
};

  
  export { GoogleAuthProvider, auth, createUserWithEmailAndPassword, db, onAuthStateChanged, saveUserToFirestore, signInWithCredential, signInWithEmailAndPassword };

