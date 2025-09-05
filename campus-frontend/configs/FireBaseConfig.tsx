// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARJDOzqzV4j9LYjOqRfpAl6Uwr7beZFmY",
  authDomain: "joluplex-e0459.firebaseapp.com",
  projectId: "joluplex-e0459",
  storageBucket: "joluplex-e0459.firebasestorage.app",
  messagingSenderId: "927084107462",
  appId: "1:927084107462:web:1e37d24f3f433e616929c7",
  measurementId: "G-G26Y3ZJBL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=initializeAuth(app,{
    persistence:getReactNativePersistence(ReactNativeAsyncStorage),
});