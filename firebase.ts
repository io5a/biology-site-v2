// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const test =process.env
/**
 * VITE_APP_FIREBASE_API_KEY="AIzaSyCXlusii8lsCWG6BfTNPOHsvh4a-LMzERU"
VITE_APP_FIREBASE_AUTH_DOMAIN="biolab-a42c4.firebaseapp.com"
VITE_APP_FIREBASE_PROJECT_ID="biolab-a42c4"
VITE_APP_FIREBASE_STORAGE_BUCKET="biolab-a42c4.firebasestorage.app"
VITE_APP_FIREBASE_MESSAGING_SENDER_ID="183531018432"
VITE_APP_FIREBASE_APP_ID="1:183531018432:web:3c2e56aada42f24bea3525"
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)