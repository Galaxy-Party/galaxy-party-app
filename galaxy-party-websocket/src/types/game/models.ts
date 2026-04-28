export interface Answer {
    id: string;
    answer: string;
}

export interface Question {
    id: string;
    label: string;
    displayAnswer: string | null;
    answers: Answer[];
}

export interface PlayerGameState {
    userId: string;
    timeRemaining: number;
}

export interface GameSession {
    roomId: string;
    ownerId: string;
    timer: number;
    questions: Question[];
    currentQuestionIndex: number;
    currentPlayerId: string;
    readyPlayers: Set<string>;
    players: Map<string, PlayerGameState>;
    turnStartedAt: number | null;
}
