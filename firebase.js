// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBANb-EYa4XFRUxeJOm8gF7SfQdSyC0gnY",
  authDomain: "flashcardwithai.firebaseapp.com",
  projectId: "flashcardwithai",
  storageBucket: "flashcardwithai.appspot.com",
  messagingSenderId: "727727013750",
  appId: "1:727727013750:web:d73dcb4908224a31c44457",
  measurementId: "G-TS4ZDHB5Y7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);