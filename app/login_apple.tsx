import * as AppleAuthentication from 'expo-apple-authentication';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function LoginWithApple() {
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    user: string;
  }>(null);

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      setUser({
        name:
          credential.fullName?.givenName ??
          'User',
        email: credential.email ?? 'Email not shared',
        user: credential.user,
      });

      console.log('Apple Credential:', credential);
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // User cancelled the sign-in
        Alert.alert('Cancelled', 'Apple sign-in was cancelled');
      } else {
        Alert.alert('Error', 'Apple sign-in failed');
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in with Apple</Text>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={{ width: 250, height: 44 }}
        onPress={handleAppleSignIn}
      />

      {user && (
        <View style={styles.userInfo}>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>User ID: {user.user}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  userInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
});
