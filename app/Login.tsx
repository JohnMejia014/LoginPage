import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GoogleAuthProvider, auth, createUserWithEmailAndPassword, saveUserToFirestore, signInWithCredential, signInWithEmailAndPassword } from '../firebase/firebase.client';
const {
  GOOGLE_WEB_CLIENT_ID,
  ANDROID_CLIENT_ID,
  IOS_CLIENT_ID,
} = Constants.expoConfig?.extra || {};


// ios: 351905340243-ukitr8ec5mcafkf4l982786e57rmr134.apps.googleusercontent.com
//web: 351905340243-nqcpk950c1kbhu341k65bdh9ssvrt6fs.apps.googleusercontent.com
 WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '351905340243-oinmcrtb79jk6dtdrvsckpnc0o7klcau.apps.googleusercontent.com',
    webClientId: '351905340243-nqcpk950c1kbhu341k65bdh9ssvrt6fs.apps.googleusercontent.com',
  });


  React.useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;
  
          // Save to Firestore
          await saveUserToFirestore({
            uid: user.uid,
            email: user.email,
            name: user.displayName || '',
            provider: 'google',
          });
  
          const userInfo = { uid: user.uid, email: user.email, name: user.displayName };
          await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
          setUserInfo(userInfo);
  
        } catch (error) {
          console.error('Google sign-in error:', error);
          Alert.alert('Google Sign-In Failed', error.message);
        }
      }
    };
  
    handleGoogleSignIn();
  }, [response]);
  

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

  const handleAppleSignIn = async () => {
    try {
      console.log('🚀 Starting Apple Sign-In flow');

      let credential;

      try {
        credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        console.log('✅ Apple Sign-In credential received:', credential);
      } catch (err) {
        console.error('AppleAuthentication.signInAsync failed:', err);
        Alert.alert('Apple Sign-In Error', err.message || 'Unknown error');
        return;
      }

      if (!credential.user) {
        console.warn('⚠️ Apple credential missing user identifier');
        throw new Error('Apple Sign-In failed: No user identifier returned');
      }

      const user = {
        uid: credential.user,
        name: credential.fullName?.givenName || '',
        email: credential.email || '',
        provider: 'apple',
      };

      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUserInfo(user);

      console.log('✅ Apple Sign-In (local only) success:', user);
    } catch (e: any) {
      console.error('❌ Apple Sign-In Error:', e);
      if (e.code === 'ERR_CANCELED') {
        console.warn('🛑 User canceled Apple Sign-In');
      } else {
        Alert.alert('Apple Sign-In failed', e.message);
      }
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
              {Platform.OS === 'ios' && (
          <View style={styles.button}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={5}
              style={{ width: 250, height: 44 }}
              onPress={handleAppleSignIn}
            />
          </View>
        )}
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

