import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBjxnPfkezduA2uoQ4WERWXJI0PoOMbJ1U",
  authDomain: "vinh-cv.firebaseapp.com",
  projectId: "vinh-cv",
  storageBucket: "vinh-cv.firebasestorage.app",
  messagingSenderId: "311344137548",
  appId: "1:311344137548:web:ebb01ec8487137e46ffbe9",
  measurementId: "G-MBL0MRVH5V",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
