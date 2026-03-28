export type CEFRLevel = "A1" | "A2" | "B1";

export type WordSet = {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  topic: string;
};

export type Flashcard = {
  id: string;
  setId: string;
  russian: string;
  turkish: string;
  example?: string;
};

export type ReviewState = {
  cardId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: number;
  lastReviewAt: number;
};

export type QuizAttempt = {
  id: string;
  setId: string;
  mode: "multiple-choice" | "writing";
  score: number;
  total: number;
  completedAt: number;
};

export type StoredProgress = {
  reviews: Record<string, ReviewState>;
  quizAttempts: QuizAttempt[];
  lastSetId?: string;
  autoPronounce: boolean;
};
