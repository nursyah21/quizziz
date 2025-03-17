import { db } from "@/lib/firebase";
import { Collections, Quiz } from "@/lib/schema";
import { useAuthStore } from "@/lib/store";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";

interface IQuizService {
  addQuiz({ quiz }: { quiz: Quiz }): Promise<string | null>;
  getQuiz({ id }: { id: string }): Promise<Quiz | null>;
  updateQuiz({ id, quiz }: { id: string; quiz: Partial<Quiz> }): Promise<void>;
  deleteQuiz({ id }: { id: string }): Promise<void>;
  publishQuiz({ id, draft }: { id: string; draft: boolean }): Promise<void>;
  listQuiz({ size, isOwn }: { size?: number; isOwn?: boolean }): Promise<Quiz[] | null>;
  totalQuiz({ draft, isOwn }: { draft?: boolean; isOwn?: boolean }): Promise<number>;
  searchQuiz({ title }: { title: string }): Promise<Quiz[] | null>;
}

export class QuizService implements IQuizService {
  async searchQuiz({ title }: { title: string }): Promise<Quiz[] | null> {
    throw new Error("Method not implemented.");
  }

  async totalQuiz({ draft = false, isOwn = false }: { draft?: boolean; isOwn?: boolean } = {}): Promise<number> {
    if (isOwn) {
      const user = useAuthStore.getState().user
      return (await getDocs(query(collection(db, Collections.quizzes), where('usercreator', '==', user?.uid)))).size;
    }
    return (await getDocs(query(collection(db, Collections.quizzes), where('draft', '==', draft)))).size;
  }

  async listQuiz({ size, isOwn }: { size: number; isOwn?: boolean }): Promise<Quiz[] | null> {
    try {
      let querySnapshot: QuerySnapshot;
      if (isOwn) {
        const user = useAuthStore.getState().user;
        querySnapshot = await getDocs(
          query(
            collection(db, Collections.quizzes),
            where('usercreator', '==', user?.uid ?? ""),
            limit(size)
          )
        );
      } else {
        querySnapshot = await getDocs(
          query(
            collection(db, Collections.quizzes),
            where('draft', '==', false),
            limit(size)
          )
        );
      }
      const quizzes: Quiz[] = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as unknown as Quiz));
      return quizzes;
    } catch (error) {
      console.error("Error listing quizzes: ", error);
      return null;
    }
  }

  async publishQuiz({ id, draft }: { id: string; draft: boolean }): Promise<void> {
    await updateDoc(doc(db, Collections.quizzes, id), { draft });
  }

  async addQuiz({ quiz }: { quiz: Quiz }): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, Collections.quizzes), quiz);
      return docRef.id;
    } catch (error) {
      console.error('Error adding quiz: ', error);
      return null;
    }
  }

  async getQuiz({ id }: { id: string }): Promise<Quiz | null> {
    try {
      const docSnap = await getDoc(doc(db, Collections.quizzes, id));
      if (docSnap.exists()) {
        return docSnap.data() as Quiz;
      }
      throw ('No such document!');
    } catch (error) {
      console.error('Error getting quiz: ', error);
      return null;
    }
  }

  async updateQuiz({ id, quiz }: { id: string; quiz: Partial<Quiz> }): Promise<void> {
    try {
      await updateDoc(doc(db, Collections.quizzes, id), quiz);
    } catch (error) {
      console.error('Error updating quiz: ', error);
    }
  }

  async deleteQuiz({ id }: { id: string }): Promise<void> {
    try {
      await deleteDoc(doc(db, Collections.quizzes, id));
    } catch (error) {
      console.error('Error deleting quiz: ', error);
    }
  }

}

export const quizService = new QuizService()