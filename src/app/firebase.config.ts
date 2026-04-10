import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-Y-6jEJ5jlcxHuDaK5ppOpTbr4KGiWmA",
  authDomain: "timetracker-fe296.firebaseapp.com",
  projectId: "timetracker-fe296",
  storageBucket: "timetracker-fe296.firebasestorage.app",
  messagingSenderId: "793202159114",
  appId: "1:793202159114:web:b5e6be13ed9a5ea3e779f3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
