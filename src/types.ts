export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface Word {
  id: string;
  french: string;
  ipa: string;
  chinese: string;
  part_of_speech: string;
  example: string;
  example_chinese: string;
  audio: string; // "TTS"
  audio_mp3: string | null;
  level: Level;
  category: string;
  tags: string[];
  conjugation?: string | null;
  gender?: string | null;
  plural?: string | null;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Sentence {
  id: string;
  category: string;
  subcategory: string;
  french: string;
  ipa: string;
  chinese: string;
  audio: string;
  audio_mp3: string | null;
  level: Level;
  situation: string;
  alternative?: string[];
  notes?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  audio: string;
}

export interface Quiz {
  id: string;
  type: 'vocabulary_multiple_choice' | 'sentence_completion';
  category: string;
  level: Level;
  difficulty: number;
  question: string;
  question_audio: string;
  options: QuizOption[];
  correct_answer: string;
  explanation: string;
  time_limit?: number;
  points?: number;
  hint?: string;
  related_words?: string[];
}

export interface UserStats {
  totalQuestionsAttempted: number;
  correctAnswers: number;
  weakWords: string[]; // IDs
  quizHistory: {
    date: string;
    score: number;
    total: number;
    level: string;
  }[];
}

export type ViewState = 'words' | 'sentences' | 'quiz' | 'profile';