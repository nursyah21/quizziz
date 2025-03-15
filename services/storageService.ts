import { storage } from "@/lib/firebase"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"


export class StorageService {
  static async uploadFile(file: File, path: string) {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log('File uploaded successfully:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }
}