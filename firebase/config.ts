// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSlfum83iE0Jt5aWnbZDsYEyt0q07WE24",
  authDomain: "debugd1vas.firebaseapp.com",
  projectId: "debugd1vas",
  storageBucket: "debugd1vas.appspot.com",
  messagingSenderId: "369240950110",
  appId: "1:369240950110:web:f7d12eaed5949794037bcf",
  measurementId: "G-0NL13946LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const authentication = getAuth(app)

export {db, app, authentication}