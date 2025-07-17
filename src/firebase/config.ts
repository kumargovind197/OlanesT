// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0Rwi0JVUnpyietFnNCdh_-pG0kySHlJM",
  authDomain: "olanest.firebaseapp.com",
  databaseURL: "https://olanest-default-rtdb.firebaseio.com",
  projectId: "olanest",
  storageBucket: "olanest.firebasestorage.app",
  messagingSenderId: "679069537292",
  appId: "1:679069537292:web:865bf6a065215b5ca38a29"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
