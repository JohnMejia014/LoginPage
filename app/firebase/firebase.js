// firebase.js
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import 'tslib';
const firebaseConfig = {
    apiKey: "AIzaSyCYUNj_NrudkKgISXRwE-rIWlwyznF9_u8",
    authDomain: "login-a4c7b.firebaseapp.com", // usually in the format: <project-id>.firebaseapp.com
    projectId: "login-a4c7b",
    storageBucket: "login-a4c7b.appspot.com",  // inferred, Firebase usually creates this automatically
    messagingSenderId: "527626776810",         // this is often the same as the Project Number
    appId: "1:527626776810:web:8509dd15ff8c795351a793"
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
