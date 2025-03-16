import { db } from "@/lib/firebase";
import { Collections, Question, Quiz } from "@/lib/schema";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface IQuestionService {
    createQuestion(quizId: string, question: Question): Promise<string>;
    updateQuestion(quizId: string, question: Question): Promise<void>;
    deleteQuestion(quizId: string, questionId: string): Promise<void>;
}

export class QuestionService implements IQuestionService {
    async updateQuestion(quizId: string, question: Question): Promise<void> {
        await updateDoc(doc(db, Collections.quizzes, quizId, Collections.questions, question.id), { ...question })
    }

    async createQuestion(quizId: string, question: Question): Promise<string> {
        const questionRef = await addDoc(
            collection(db, Collections.quizzes, quizId, Collections.questions), 
            question
        );
        return questionRef.id;
    }
    
    async deleteQuestion(quizId: string, questionId: string): Promise<void> {
        await deleteDoc(doc(db, Collections.quizzes, quizId, "questions", questionId))
    }
}

export const questionService = new QuestionService()