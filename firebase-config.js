// src/firebase-config.js
import { initializeApp } from "firebase/app";

// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9vmRlUsHetjuD7L1l-DxtQwn7WPW6T7I",
  authDomain: "golden-green-recipe.firebaseapp.com",
  projectId: "golden-green-recipe",
  storageBucket: "golden-green-recipe.firebasestorage.app",
  messagingSenderId: "952103785525",
  appId: "1:952103785525:web:06a9eeb8d33364446e4d7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseConfig = {
  apiKey: "AIzaSyA9vmR1UsHetjuD7L11-Dxt...",
  authDomain: "golden-green-recipe.firebaseapp.com",
  projectId: "golden-green-recipe",
  storageBucket: "golden-green-recipe.appspot.com",
  messagingSenderId: "952103785525",
  appId: "1:952103785525:web:06a9eeb8d33364446e4d7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
