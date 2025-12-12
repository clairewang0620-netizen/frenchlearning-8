import { UserStats } from '../types';

const STORAGE_KEY = 'lumiere_french_progress';

const INITIAL_STATS: UserStats = {
  totalQuestionsAttempted: 0,
  correctAnswers: 0,
  weakWords: [],
  quizHistory: []
};

export const getUserStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_STATS;
};

export const saveUserStats = (stats: UserStats): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const recordQuizResult = (correct: number, total: number, wrongIds: string[]) => {
  const stats = getUserStats();
  stats.totalQuestionsAttempted += total;
  stats.correctAnswers += correct;
  
  // Add unique wrong IDs
  const newWeakWords = new Set([...stats.weakWords, ...wrongIds]);
  stats.weakWords = Array.from(newWeakWords);

  stats.quizHistory.push({
    date: new Date().toISOString().split('T')[0],
    score: correct,
    total: total
  });

  saveUserStats(stats);
};

export const removeWeakWord = (id: string) => {
  const stats = getUserStats();
  stats.weakWords = stats.weakWords.filter(wId => wId !== id);
  saveUserStats(stats);
};