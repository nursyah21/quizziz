import { Quiz } from "@/lib/schema";

interface IQuestionService {
    createQuestion(quiz: Quiz): string;
    deleteQuestion(questionId: string): void;
}

export class QuestionService implements IQuestionService {
    createQuestion(quiz: Quiz): string {
        throw new Error("Method not implemented.");
    }
    deleteQuestion(questionId: string): void {
        throw new Error("Method not implemented.");
    }
}

export const questionService = new QuestionService()