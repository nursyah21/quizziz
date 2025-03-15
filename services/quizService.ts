import { db } from "@/lib/firebase"
import { collections, Quiz } from "@/lib/schema"
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"

interface IQuizService {
  addQuiz(quiz: Quiz): Promise<void>;
  getQuiz(id: string): Promise<Quiz | null>;
  updateQuiz(id: string, quiz: Partial<Quiz>): Promise<void>;
  deleteQuiz(id: string): Promise<void>;
}

export class QuizService implements IQuizService {
  async addQuiz(quiz: Quiz) {
    try {
      const docRef = await addDoc(collection(db, collections.quizzes), quiz)
    } catch (error) {
      console.error('Error adding quiz: ', error)
    }
  }

  async getQuiz(id: string) {
    try {
      const docRef = doc(db, collections.quizzes, id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as Quiz
      }
      throw ('No such document!')
    } catch (error) {
      console.error('Error getting quiz: ', error)
      return null
    }
  }

  async updateQuiz(id: string, quiz: Partial<Quiz>) {
    try {
      const docRef = doc(db, collections.quizzes, id)
      await updateDoc(docRef, quiz)
      console.log('Quiz updated')
    } catch (error) {
      console.error('Error updating quiz: ', error)
    }
  }

  async deleteQuiz(id: string) {
    try {
      const docRef = doc(db, collections.quizzes, id)
      await deleteDoc(docRef)
      console.log('Quiz deleted')
    } catch (error) {
      console.error('Error deleting quiz: ', error)
    }
  }
}

export const quizService = new QuizService()