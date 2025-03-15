import { db } from "@/lib/firebase"
import { collections, Quiz } from "@/lib/schema"
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"


export class QuizService {
  static async addQuiz(quiz: Quiz) {
    try {
      const docRef = await addDoc(collection(db, collections.quizzes), quiz)
      console.log('Quiz added with ID: ', docRef.id)
    } catch (error) {
      console.error('Error adding quiz: ', error)
    }
  }

  static async getQuiz(id: string) {
    try {
      const docRef = doc(db, collections.quizzes, id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as Quiz
      } else {
        console.log('No such document!')
      }
    } catch (error) {
      console.error('Error getting quiz: ', error)
    }
  }

  static async updateQuiz(id: string, quiz: Partial<Quiz>) {
    try {
      const docRef = doc(db, collections.quizzes, id)
      await updateDoc(docRef, quiz)
      console.log('Quiz updated')
    } catch (error) {
      console.error('Error updating quiz: ', error)
    }
  }

  static async deleteQuiz(id: string) {
    try {
      const docRef = doc(db, collections.quizzes, id)
      await deleteDoc(docRef)
      console.log('Quiz deleted')
    } catch (error) {
      console.error('Error deleting quiz: ', error)
    }
  }
}