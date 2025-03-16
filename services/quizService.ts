import { db } from "@/lib/firebase"
import { Collections, Quiz } from "@/lib/schema"
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"

interface IQuizService {
  addQuiz(quiz: Quiz): Promise<string | null>;
  getQuiz(id: string): Promise<Quiz | null>;
  updateQuiz(id: string, quiz: Partial<Quiz>): Promise<void>;
  deleteQuiz(id: string): Promise<void>;
  publishQuiz(id: string, draft: boolean): Promise<void>;
}

export class QuizService implements IQuizService {
  async publishQuiz(id: string, draft: boolean = false): Promise<void> {
    await updateDoc(doc(db, Collections.quizzes, id), { draft })
  }

  async addQuiz(quiz: Quiz) {
    try {
      const docRef = await addDoc(collection(db, Collections.quizzes), quiz)
      return docRef.id
    } catch (error) {
      console.error('Error adding quiz: ', error)
      return null
    }
  }

  async getQuiz(id: string) {
    try {
      const docSnap = await getDoc(doc(db, Collections.quizzes, id))
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
      await updateDoc(doc(db, Collections.quizzes, id), quiz)
    } catch (error) {
      console.error('Error updating quiz: ', error)
    }
  }

  async deleteQuiz(id: string) {
    try {
      await deleteDoc(doc(db, Collections.quizzes, id))
    } catch (error) {
      console.error('Error deleting quiz: ', error)
    }
  }
}

export const quizService = new QuizService()