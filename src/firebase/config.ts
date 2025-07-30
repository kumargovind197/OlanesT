// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getDocs, getFirestore,} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcDVJIRTYNN3rnWaCNeaNAbEGabzCAa54",
  authDomain: "olanest-caecd.firebaseapp.com",
  databaseURL: "https://olanest-caecd-default-rtdb.firebaseio.com",
  projectId: "olanest-caecd",
  storageBucket: "olanest-caecd.firebasestorage.app",
  messagingSenderId: "962424488918",
  appId: "1:962424488918:web:e58a77a9ba95ae6d7b1a77",
  measurementId: "G-YDWVC05LMH"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export {getDocs}
export {onAuthStateChanged}
