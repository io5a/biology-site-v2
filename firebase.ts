// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXlusii8lsCWG6BfTNPOHsvh4a-LMzERU",
  authDomain: "biolab-a42c4.firebaseapp.com",
  projectId: "biolab-a42c4",
  storageBucket: "biolab-a42c4.firebasestorage.app",
  messagingSenderId: "183531018432",
  appId: "1:183531018432:web:3c2e56aada42f24bea3525"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)