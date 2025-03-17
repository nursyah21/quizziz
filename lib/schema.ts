import { Timestamp } from 'firebase/firestore';

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
    id?: string;
    title: string;
    usercreator: string;
    difficulty: string;
    timestamp: Timestamp;
    draft: boolean;
    numberOfQuestion: number;
}


// Interface for a play session
interface Play {
    quizId: string;
    users: {
        id: string;
        score: number;
    };
    admin: string;
}

// Firestore collections
const Collections = {
    quizzes: 'quizzes',
    questions: 'questions',
    plays: 'plays',
};

export { Collections };
export type { Play, Question, Quiz };

