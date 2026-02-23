import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6ZLmpf3aT-rUUXvjdkpR3SoNLBPy7_b0",
  authDomain: "trustlense-ai-987d6.firebaseapp.com",
  projectId: "trustlense-ai-987d6",
  storageBucket: "trustlense-ai-987d6.firebasestorage.app",
  messagingSenderId: "385654847822",
  appId: "1:385654847822:web:966bbc55aa309db2f2861f",
  measurementId: "G-9TWEJHRQFH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
