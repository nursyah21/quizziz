import { auth } from "@/lib/firebase"
import { useAuthStore } from "@/lib/store"
import { getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth"

const googleProvider = new GoogleAuthProvider()

export class AuthService {
  static async signInWithGoogleRedirect() {
    try {
      let user = null
      await signInWithRedirect(auth, googleProvider)
      const result = await getRedirectResult(auth)
      if (result) {
        user = result.user
      }
      useAuthStore.getState().setUser(user)
      return user
    } catch (error) {
      console.error('Error signing in with Google: ', error)
      throw error
    }
  }

  static async signInWithGooglePopUp() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const user = result.user
      useAuthStore.getState().setUser(user)
      return user
    } catch (error) {
      console.error('Error signing in with Google: ', error)
      throw error
    }
  }

  static async logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out: ', error)
      throw error
    }
  }
}