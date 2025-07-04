import 'dotenv/config';

export default () => ({
  expo: {
    name: "login-apple",
    slug: "login-apple",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "login-apple",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",  // 👈 This line is key
      infoPlist: {
        "ITSAppUsesNonExemptEncryption": false
      },
      bundleIdentifier: "com.login-example.dev",
      usesAppleSignIn: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "org.name.loginapp"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      ["expo-apple-authentication"],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
      IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,

      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_WEB_APP_ID: process.env.FIREBASE_WEB_APP_ID,
      FIREBASE_IOS_APP_ID: process.env.FIREBASE_IOS_APP_ID,

      router: {},
      eas: {
        projectId: "7144e535-822b-49c9-a2d7-b9527adfdf93",
      },
    },
  },
});
