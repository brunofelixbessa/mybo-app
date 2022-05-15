import { boot } from "quasar/wrappers";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, setDoc, doc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSrP7hyl8X3NJo204Bjkx2NAiEwnbfO38",
  authDomain: "balanco-quasar.firebaseapp.com",
  projectId: "balanco-quasar",
  storageBucket: "balanco-quasar.appspot.com",
  messagingSenderId: "922004298234",
  appId: "1:922004298234:web:850078641bf0aa46df2c43",
  measurementId: "G-DC25ZXCW9J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, setDoc, doc };

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/*{ db, setDoc }*/) => {
  // something to do
});
