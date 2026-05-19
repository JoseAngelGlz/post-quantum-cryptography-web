export interface QuizResult {
  quizId: string;
  /** Resolved title at save time (kept for backward compatibility). */
  title: string;
  /** Optional i18n key so the summary can re-translate the title at render time. */
  titleKey?: string;
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
  try {
    localStorage.removeItem(REACTIONS_KEY);
  } catch {
    /* ignore */
  }
};

export const subscribeToQuizResults = (fn: () => void) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

/* ─── Reactions ─── per-quiz one-tap rating (1 = hard, 2 = ok, 3 = great) ── */

export type QuizReaction = 1 | 2 | 3;

const REACTIONS_KEY = 'pqc-quiz-reactions';

const readReactions = (): Record<string, QuizReaction> => {
  try {
    const raw = localStorage.getItem(REACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeReactions = (data: Record<string, QuizReaction>) => {
  try {
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  subscribers.forEach((s) => s());
};

export const saveQuizReaction = (quizId: string, reaction: QuizReaction) => {
  const all = readReactions();
  all[quizId] = reaction;
  writeReactions(all);
};

export const getQuizReaction = (quizId: string): QuizReaction | null => {
  return readReactions()[quizId] ?? null;
};

export const getAllQuizReactions = (): Record<string, QuizReaction> => readReactions();
