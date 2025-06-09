// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4B2CtMAt02IuEYTzcKVYyLw8BR1KykQY",
  authDomain: "zebrabrowserprint.firebaseapp.com",
  projectId: "zebrabrowserprint",
  storageBucket: "zebrabrowserprint.firebasestorage.app",
  messagingSenderId: "698311785274",
  appId: "1:698311785274:web:be807d94df7da164846e03",
  measurementId: "G-F8YDJ3Q71Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);