import { Timestamp, DocumentReference } from 'firebase/firestore'

// Interface for a question
interface Question {
    type: string;
    question: string;
    answers: string[];
    id: number;
}

// Interface for a quiz
interface Quiz {
    title: string;
    usercreator: string;
    difficulty: string;
    questions: Question[];
    timestamp: Timestamp;
    draft: boolean;
}

// Interface for a play session
interface Play {
    quiz: DocumentReference<Quiz>;
    users: string[];
    admin: string;
}

// Firestore collections
const collections = {
    quizzes: 'quizzes',
    questions: 'questions',
    plays: 'plays',
};

export { collections };
export type { Question, Quiz, Play };
