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

// Conjunto de callbacks registrados para notificar cambios en los resultados
const subscribers = new Set<() => void>();

// Lee todos los resultados de quiz desde localStorage; devuelve {} si hay error
const read = (): Record<string, QuizResult> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Persiste los resultados en localStorage y notifica a todos los suscriptores
const write = (data: Record<string, QuizResult>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
  subscribers.forEach((s) => s());
};

// Guarda o sobreescribe el resultado de un quiz concreto
export const saveQuizResult = (result: QuizResult) => {
  const all = read();
  all[result.quizId] = result;
  write(all);
};

// Devuelve el resultado de un quiz por ID, o null si no existe
export const getQuizResult = (quizId: string): QuizResult | null => {
  return read()[quizId] ?? null;
};

// Devuelve todos los resultados ordenados cronológicamente
export const getAllQuizResults = (): QuizResult[] => {
  return Object.values(read()).sort((a, b) => a.completedAt.localeCompare(b.completedAt));
};

// Borra todos los resultados y las reacciones guardadas
export const clearAllQuizResults = () => {
  write({});
  try {
    localStorage.removeItem(REACTIONS_KEY);
  } catch {
    /* ignore */
  }
};

// Registra un listener que se ejecuta al modificarse los resultados; devuelve la función de baja
export const subscribeToQuizResults = (fn: () => void) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

/* ─── Reactions ─── per-quiz one-tap rating (1 = hard, 2 = ok, 3 = great) ── */

export type QuizReaction = 1 | 2 | 3;

const REACTIONS_KEY = 'pqc-quiz-reactions';

// Lee las reacciones de todos los quizzes desde localStorage
const readReactions = (): Record<string, QuizReaction> => {
  try {
    const raw = localStorage.getItem(REACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Persiste las reacciones y notifica suscriptores
const writeReactions = (data: Record<string, QuizReaction>) => {
  try {
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  subscribers.forEach((s) => s());
};

// Guarda la reacción (1-3) para un quiz concreto
export const saveQuizReaction = (quizId: string, reaction: QuizReaction) => {
  const all = readReactions();
  all[quizId] = reaction;
  writeReactions(all);
};

// Devuelve la reacción almacenada para un quiz, o null si no existe
export const getQuizReaction = (quizId: string): QuizReaction | null => {
  return readReactions()[quizId] ?? null;
};

// Devuelve todas las reacciones indexadas por quizId
export const getAllQuizReactions = (): Record<string, QuizReaction> => readReactions();
