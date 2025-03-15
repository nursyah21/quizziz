import { auth } from "@/lib/firebase"
import { useAuthStore } from "@/lib/store"
import { getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, User } from "firebase/auth"

const googleProvider = new GoogleAuthProvider()

interface IAuthService {
  signInWithGoogleRedirect(): Promise<User |null>;
  signInWithGooglePopUp(): Promise<User |null>;
  logout(): Promise<void>;
}

export class AuthService implements IAuthService {
  async signInWithGoogleRedirect() {
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

  async signInWithGooglePopUp() {
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

  async logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out: ', error)
      throw error
    }
  }
}

export const authService = new AuthService()