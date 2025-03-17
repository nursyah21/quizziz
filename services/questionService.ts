import { db } from "@/lib/firebase";
import { Collections, Question } from "@/lib/schema";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

interface IQuestionService {
    createQuestion(quizId: string, question: Question): Promise<string>;
    updateQuestion(quizId: string, question: Question): Promise<void>;
    deleteQuestion(quizId: string, questionId: string): Promise<void>;
}

export class QuestionService implements IQuestionService {
    private async updateQuestionCount(quizId: string): Promise<void> {
        const questionsSnapshot = await getDocs(
            collection(db, Collections.quizzes, quizId, Collections.questions)
        );
        const count = questionsSnapshot.size;
        await updateDoc(doc(db, Collections.quizzes, quizId), { numberOfQuestion: count });
    }

    async updateQuestion(quizId: string, question: Question): Promise<void> {
        await updateDoc(doc(db, Collections.quizzes, quizId, Collections.questions, question.id), { ...question })
        await this.updateQuestionCount(quizId)
    }

    async createQuestion(quizId: string, question: Question): Promise<string> {
        const questionRef = await addDoc(
            collection(db, Collections.quizzes, quizId, Collections.questions),
            question
        );
        await this.updateQuestionCount(quizId)
        return questionRef.id;
    }

    async deleteQuestion(quizId: string, questionId: string): Promise<void> {
        await deleteDoc(doc(db, Collections.quizzes, quizId, "questions", questionId))
        await this.updateQuestionCount(quizId)
    }
}

export const questionService = new QuestionService()