import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, onSnapshot, query, collection, orderBy, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2wvbYM44kX-Lg4bkHfTCLAiDSWJEjB4I",
  authDomain: "info-6132-labs-26e88.firebaseapp.com",
  projectId: "info-6132-labs-26e88",
  storageBucket: "info-6132-labs-26e88.appspot.com",
  messagingSenderId: "550075977772",
  appId: "1:550075977772:web:c627e76653f1b515ff8189"
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
let auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
let db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, onSnapshot, query, collection, orderBy, addDoc, serverTimestamp, doc, updateDoc, deleteDoc };
