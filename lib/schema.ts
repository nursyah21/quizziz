import { Timestamp, DocumentReference } from 'firebase/firestore'

// Interface for a question
interface Question {
    type: string;
    question: string;
    answers: string[];
    correct: string;
    id: string;
}

// Interface for a quiz
interface Quiz {
    title: string;
    usercreator: string;
    difficulty: string;
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
const Collections = {
    quizzes: 'quizzes',
    questions: 'questions',
    plays: 'plays',
};

export { Collections };
export type { Question, Quiz, Play };
