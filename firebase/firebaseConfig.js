import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyA9lc113C4uqk-Xg2VYhTPIQBkH2UhMSpk",
  authDomain: "recipe-ai-app-a4eed.firebaseapp.com",
  projectId: "recipe-ai-app-a4eed",
  storageBucket: "recipe-ai-app-a4eed.firebasestorage.app",
  messagingSenderId: "315715680086",
  appId: "1:315715680086:web:b0aba637f9e08dd82888f7"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

