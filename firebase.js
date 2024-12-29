// firebase.js for Firebase v9+
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmjW-VkMdT1VNOHOAn6cuGtQ6RZCRk4bo",
  authDomain: "nexusx-1b359.firebaseapp.com",
  projectId: "nexusx-1b359",
  storageBucket: "nexusx-1b359.appspot.com",
  messagingSenderId: "489062102350",
  appId: "1:489062102350:web:8b58f30cfb08b6c5429a1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export auth, provider, and db all together in one export statement
export { auth, provider, db };
