import { db } from "@/lib/firebase"
import { Collections, Quiz } from "@/lib/schema"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, query, updateDoc } from "firebase/firestore"

interface IQuizService {
  addQuiz(quiz: Quiz): Promise<string | null>;
  getQuiz(id: string): Promise<Quiz | null>;
  updateQuiz(id: string, quiz: Partial<Quiz>): Promise<void>;
  deleteQuiz(id: string): Promise<void>;
  publishQuiz(id: string, draft: boolean): Promise<void>;
  listQuiz(size: number): Promise<Quiz[] | null>;
  totalQuiz(): Promise<number>;
}

export class QuizService implements IQuizService {
  async totalQuiz(): Promise<number> {
    return (await getDocs(collection(db, Collections.quizzes))).size
  }

  async listQuiz(size: number): Promise<Quiz[] | null> {
    try {
      const querySnapshot = await getDocs(query(collection(db, Collections.quizzes), limit(size)))
      const quizzes: Quiz[] = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as unknown as Quiz))
      return quizzes
    } catch (error) {
      console.error("Error listing quizzes: ", error)
      return null
    }
  }

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