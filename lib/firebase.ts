import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./firebaseConfig"
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth"
import { useAuthStore } from "./store"

const firebase = initializeApp(firebaseConfig)
export const db = getFirestore(firebase)
export const auth = getAuth(firebase)

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogleRedirect = async () => {
    try {
        let user = null
        await signInWithRedirect(auth, googleProvider)
        const result = await getRedirectResult(auth)
        if(result){
            user = result.user
        }
        useAuthStore.getState().setUser(user)
        return user
    } catch (error) {
        console.error('Error sigining in with google: ', error)
        throw error
    }
}

export const signInWithGooglePopUp = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider)
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential?.accessToken
        const user = result.user
        useAuthStore.getState().setUser(user)
        return user
    } catch (error) {
        console.error('Error sigining in with google: ', error)
        throw error
    }
}

export const logout = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error('Error signing out: ', error)
        throw error
    }
}

