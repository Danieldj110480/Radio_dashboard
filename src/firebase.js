import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-AISE_u7rQ7RZRFI2nIbpheccN2iT_sc",
  authDomain: "radio-dashboard-3bfb7.firebaseapp.com",
  projectId: "radio-dashboard-3bfb7",
  storageBucket: "radio-dashboard-3bfb7.firebasestorage.app",
  messagingSenderId: "143759846600",
  appId: "1:143759846600:web:07d196a12b750edf9989fd",
  measurementId: "G-QGTTKC2G1J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
