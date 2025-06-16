import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    Alert,
    Button,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { saveUserToFirestore } from './firebase/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function Login(){
  const [userInfo, setUserInfo] = React.useState(null)
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "625140642199-0b7r6dbn726jamunbjj4ap1ssmajkeu2.apps.googleusercontent.com",
    iosClientId: "625140642199-1c2f913ielsuaeur2b16589q9ca8goeb.apps.googleusercontent.com",
    webClientId: "625140642199-u0uq2jd95gm448burtu49ek1jkt78f5d.apps.googleusercontent.com",
  })

  async function handleGoogleSignIn() {
    const user = await AsyncStorage.getItem("@user");
    if (!user){
      if(response?.type === 'success'){
        await getUserInfo(response.authentication?.accessToken)
      }
    }else{
      setUserInfo(JSON.parse(user));
    }
  }

  React.useEffect(() => {
    handleGoogleSignIn();
  }, [response])

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      console.log('Google User Info:', user);
  
      // Save to AsyncStorage & state
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
  
      // Save user to Firestore with unique id and provider
      await saveUserToFirestore({
        id: user.id,           // unique Google user ID
        name: user.name,
        email: user.email,
        provider: 'google',    // indicate provider
      });
  
    } catch (error) {
      console.log("Google fetch user error", error);
    }
  };
  
  
  const handlenothing = async () => {
    console.log('nothing')
  }
  
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
  
      let storedUser = await AsyncStorage.getItem('@user');
      let prevUser = JSON.parse(storedUser || '{}');
  
      let user = {
        id: credential.user,  // unique Apple user ID
        name: credential.fullName?.givenName ?? prevUser.name ?? '',
        email: credential.email ?? prevUser.email ?? '',
        provider: 'apple',    // indicate provider
      };
  
      console.log('Apple Credential:', credential);
      console.log('Apple User Info:', user);
  
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUserInfo(user);
  
      // Save user to Firestore with unique id and provider
      await saveUserToFirestore(user);
  
    } catch (e) {
      console.log('Apple Sign-In Error:', e);
      if (e.code !== 'ERR_CANCELED') {
        Alert.alert('Apple Sign-In failed');
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
        <Text style={styles.subtitle}>Choose a sign-in method</Text>

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
          <Button title="Sign in with Email" onPress={handlenothing} />
        </View>

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
    justifyContent: 'center', // centers vertically
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
