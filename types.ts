export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface Word {
  id: string;
  french: string;
  ipa: string;
  chinese: string;
  part_of_speech: string;
  example: string;
  example_chinese: string;
  level: Level;
  category: string;
  tags: string[];
}

export interface Sentence {
  id: string;
  category: string;
  subcategory: string;
  french: string;
  ipa: string;
  chinese: string;
  level: Level;
  situation: string;
  notes?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface Quiz {
  id: string;
  type: 'vocabulary_multiple_choice' | 'sentence_completion';
  category: string;
  level: Level;
  question: string;
  options: QuizOption[];
  correct_answer: string;
  explanation: string;
  related_words?: string[];
}

export interface UserStats {
  totalQuestionsAttempted: number;
  correctAnswers: number;
  weakWords: string[]; // IDs of words/quizzes marked wrong
  quizHistory: {
    date: string;
    score: number;
    total: number;
  }[];
}

export type ViewState = 'words' | 'sentences' | 'quiz' | 'profile';