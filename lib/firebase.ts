import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { firebaseConfig } from "./firebaseConfig"

const firebase = initializeApp(firebaseConfig)
export const db = getFirestore(firebase)
export const auth = getAuth(firebase)
export const storage = getStorage(firebase)
