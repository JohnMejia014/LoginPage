import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';


export default function Login(){
  const [userInfo, setUserInfo] = React.useState(null)
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
    if (!token)return;
    try{
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me",
      {headers: {Authorization: `Bearer ${token}`},}
      );
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch(error){
      // comment here
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Text style={styles.subtitle}>Choose a sign-in method</Text>

      {/* <View style={styles.button}>
        <Button title="Email / Password" onPress={handleEmailSignIn} />
      </View> */}

      <View style={styles.button}>
        <Button
          title="Sign in with Google"
          onPress={() => promptAsync()}
          disabled={!request}
        />
        <Button 
          title="Delete Local Storage"
          onPress={() => AsyncStorage.removeItem("@user")}
        />
      </View>

      {/* {Platform.OS === 'ios' && (
        <View style={styles.button}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={handleAppleSignIn}
          />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    marginVertical: 8,
  },
});
