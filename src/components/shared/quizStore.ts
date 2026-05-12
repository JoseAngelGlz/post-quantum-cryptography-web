export interface QuizResult {
  quizId: string;
  title: string;
  routeId: string;
  score: number;
  total: number;
  answers: { questionIndex: number; selected: number; correct: number; isCorrect: boolean }[];
  completedAt: string;
}

const STORAGE_KEY = 'pqc-quiz-results';

const subscribers = new Set<() => void>();

const read = (): Record<string, QuizResult> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const write = (data: Record<string, QuizResult>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
  subscribers.forEach((s) => s());
};

export const saveQuizResult = (result: QuizResult) => {
  const all = read();
  all[result.quizId] = result;
  write(all);
};

export const getQuizResult = (quizId: string): QuizResult | null => {
  return read()[quizId] ?? null;
};

export const getAllQuizResults = (): QuizResult[] => {
  return Object.values(read()).sort((a, b) => a.completedAt.localeCompare(b.completedAt));
};

export const clearAllQuizResults = () => {
  write({});
};

export const subscribeToQuizResults = (fn: () => void) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};
