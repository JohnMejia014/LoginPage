import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import React from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GoogleAuthProvider, auth, createUserWithEmailAndPassword, saveUserToFirestore, signInWithCredential, signInWithEmailAndPassword } from '../firebase/firebase.client';
const {
  GOOGLE_WEB_CLIENT_ID,
  ANDROID_CLIENT_ID,
  IOS_CLIENT_ID,
} = Constants.expoConfig?.extra || {};

  

export default function Login() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  console.log(IOS_CLIENT_ID);

  
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'login-apple',  // from your app.config.js
    useProxy: false,         // because you’re using iosClientId
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    redirectUri,
  });
  
  
  console.log("🚨 Redirect URI being used:", redirectUri);
  
  
  React.useEffect(() => {
    if(response?.type == 'success'){
      const {id_token} = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response])

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Registered user:', user.email);
  
      try {
        // Try to save to Firestore
        await saveUserToFirestore({
          uid: user.uid,
          email: user.email,
          name: '',
          provider: 'email',
        });
  
        const userInfo = { uid: user.uid, email: user.email };
        await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
        setUserInfo(userInfo);
  
      } catch (firestoreError) {
        // If saving to Firestore fails, delete the user from Firebase Auth
        console.error('❌ Error saving to Firestore, deleting user from Auth...', firestoreError);
        await user.delete();
        Alert.alert('Registration failed', 'User creation failed due to a database error. Please try again.');
      }
  
    } catch (authError) {
      console.error('Registration error:', authError);
      Alert.alert('Registration failed', authError.message);
    }
  };
  

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in user:', user.email);

      const userInfo = { uid: user.uid, email: user.email };
      await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
      setUserInfo(userInfo);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', error.message);
    }
  };
  return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Welcome</Text>
          {userInfo ? (
            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>Signed in as:</Text>
              <Text style={styles.profileText}>{userInfo.name || userInfo.email}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>Sign in with Email</Text>
              <View style={styles.section}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                />
                <Button title="Login" onPress={handleLogin} />
                <View style={{ height: 10 }} />
                <Button title="Register" onPress={handleRegister} />
              <View style={styles.button}>
                <Button
                  title="Sign in with Google"
                  onPress={() => promptAsync()}
                  disabled={!request}
                />
              </View>
              </View>
            </>
          )}
  
          <View style={styles.button}>
            <Button
              title="Delete Local Storage"
              onPress={() => {
                AsyncStorage.removeItem('@user');
                setUserInfo(null);
              }}
              color="crimson"
            />
          </View>
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      color: '#555',
      marginBottom: 24,
    },
    section: {
      width: '100%',
      maxWidth: 320,
      marginVertical: 10,
    },
    button: {
      width: '100%',
      maxWidth: 320,
      marginVertical: 10,
      alignItems: 'center',
    },
    label: {
      marginBottom: 4,
      color: '#444',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 12,
      borderRadius: 5,
    },
    profileContainer: {
      alignItems: 'center',
      padding: 20,
    },
    profileText: {
      fontSize: 16,
      marginVertical: 2,
    },
  });

