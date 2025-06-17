// firebase.js
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import 'tslib';
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
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth(app);


// Save user to Firestore
const saveUserToFirestore = async (user) => {
    try {
      if (!user.id) throw new Error('User ID is missing');
  
      // <-- Here user.id is used as the Firestore document key (primary key)
      const userRef = doc(db, 'users', user.id);
  
      await setDoc(userRef, {
        name: user.name || '',
        email: user.email || '',
        provider: user.provider || '',
        createdAt: new Date(),
      });
  
      console.log('✅ User saved to Firestore');
    } catch (error) {
      console.error('❌ Error saving user to Firestore:', error);
    }
  };
  

  export { db, saveUserToFirestore };
