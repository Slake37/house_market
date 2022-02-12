import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA-o_jsa5VnFDZ88EZG9ThKx8HSdxW7Lbg",
  authDomain: "house-market-app-a23e8.firebaseapp.com",
  projectId: "house-market-app-a23e8",
  storageBucket: "house-market-app-a23e8.appspot.com",
  messagingSenderId: "176955383946",
  appId: "1:176955383946:web:fb01a99838d91e77810d73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore()