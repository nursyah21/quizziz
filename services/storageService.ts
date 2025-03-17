import { storage } from "@/lib/firebase"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"

interface IStorageService {
  uploadFile(file: File, path: string): Promise<string | null>
}

export class StorageService implements IStorageService{
  async uploadFile(file: File, path: string) {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    }
  }
}

export const storageService = new StorageService()