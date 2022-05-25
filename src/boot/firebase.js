import { boot } from "quasar/wrappers";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSrP7hyl8X3NJo204Bjkx2NAiEwnbfO38",
  authDomain: "balanco-quasar.firebaseapp.com",
  projectId: "balanco-quasar",
  storageBucket: "balanco-quasar.appspot.com",
  messagingSenderId: "922004298234",
  appId: "1:922004298234:web:850078641bf0aa46df2c43",
  measurementId: "G-DC25ZXCW9J",
};

// Inicialize Firebase Storage
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
var storage = firebase.storage();
const db = getFirestore(app);
const auth = getAuth(app);

export {
  storage,
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};

export default boot(async (/*{ db, setDoc }*/) => {
  // something to do
});
