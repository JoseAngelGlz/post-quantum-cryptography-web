import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { saveQuizResult } from './quizStore';
import { useT } from '../../i18n';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuickQuizProps {
  questions: QuizQuestion[];
  title?: string;
  /** Optional i18n key for the title so QuizSummary can re-translate later. */
  titleKey?: string;
  quizId: string;
  routeId: string;
}

interface ShuffledQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  originalCorrectIndex: number;
  explanation?: string;
  permutation: number[];
}

const shuffle = <T,>(arr: T[]): { items: T[]; permutation: number[] } => {
  const indices = arr.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    items: indices.map((i) => arr[i]),
    permutation: indices,
  };
};

const shuffleQuestion = (q: QuizQuestion): ShuffledQuestion => {
  const { items, permutation } = shuffle(q.options);
  const newCorrectIndex = permutation.indexOf(q.correctIndex);
  return {
    question: q.question,
    options: items,
    correctIndex: newCorrectIndex,
    originalCorrectIndex: q.correctIndex,
    explanation: q.explanation,
    permutation,
  };
};

const QuickQuiz: React.FC<QuickQuizProps> = ({
  questions,
  title,
  titleKey,
  quizId,
  routeId,
}) => {
  const t = useT();
  const resolvedTitle = title ?? t('quiz.title.default');
  const shuffled = useMemo(() => questions.map(shuffleQuestion), [questions]);

  const [current, setCurrent] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [done, setDone] = useState(false);

  const q = shuffled[current];
  if (!q) return null;

  const selected = selections[current];
  const revealed = selected !== null;

  const choose = (i: number) => {
    if (revealed) return;
    const next = [...selections];
    next[current] = i;
    setSelections(next);
  };

  const goBack = () => {
    if (current === 0) return;
    setCurrent((c) => c - 1);
  };

  const computeScore = () =>
    selections.reduce<number>(
      (acc, sel, idx) =>
        sel !== null && sel === shuffled[idx].correctIndex ? acc + 1 : acc,
      0,
    );

  const goNext = () => {
    if (current + 1 >= shuffled.length) {
      const score = computeScore();
      saveQuizResult({
        quizId,
        title: resolvedTitle,
        titleKey,
        routeId,
        score,
        total: shuffled.length,
        answers: selections.map((sel, idx) => ({
          questionIndex: idx,
          selected: sel ?? -1,
          correct: shuffled[idx].correctIndex,
          isCorrect: sel !== null && sel === shuffled[idx].correctIndex,
        })),
        completedAt: new Date().toISOString(),
      });
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
  };

  const reset = () => {
    setCurrent(0);
    setSelections(questions.map(() => null));
    setDone(false);
  };

  const score = computeScore();

  return (
    <div className="px-6 md:px-10 max-w-6xl mx-auto my-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="card-quantum p-6 md:p-8"
      >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-md bg-quantum-cyan/10 text-quantum-cyan">
          <Sparkles size={14} />
        </div>
        <h3 className="font-display text-base md:text-lg font-semibold text-slate-100">
          {resolvedTitle}
        </h3>
        <span className="ml-auto text-xs text-slate-400 font-mono">
          {done ? `${score}/${shuffled.length}` : `${current + 1} / ${shuffled.length}`}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-base md:text-lg text-slate-100 mb-5 font-medium leading-snug">
              {q.question}
            </p>

            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                const isCorrect = revealed && i === q.correctIndex;
                const isWrong = revealed && i === selected && i !== q.correctIndex;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={revealed}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm md:text-[15px] transition-all flex items-start gap-3 ${
                      isCorrect
                        ? 'border-quantum-mint/70 bg-quantum-mint/10 text-quantum-mint'
                        : isWrong
                        ? 'border-quantum-rose/70 bg-quantum-rose/10 text-quantum-rose'
                        : revealed
                        ? 'border-quantum-border bg-quantum-panel/30 text-slate-400'
                        : 'border-quantum-border bg-quantum-panel/40 text-slate-200 hover:border-quantum-cyan/60 hover:bg-quantum-cyan/5'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isCorrect ? (
                        <Check size={16} />
                      ) : isWrong ? (
                        <X size={16} />
                      ) : (
                        <span className="inline-block w-4 h-4 rounded-full border border-current opacity-50" />
                      )}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {revealed && q.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-lg bg-quantum-panel2/40 border border-quantum-border text-sm text-slate-300 leading-relaxed"
              >
                {q.explanation}
              </motion.div>
            )}

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                onClick={goBack}
                disabled={current === 0}
                className="px-4 py-2 rounded-md border border-quantum-border text-sm text-slate-300 hover:border-quantum-cyan/60 hover:text-quantum-cyan transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ChevronLeft size={15} /> {t('ui.previous')}
              </button>
              <button
                onClick={goNext}
                disabled={!revealed}
                className="px-4 py-2 rounded-md bg-quantum-cyan/15 border border-quantum-cyan/40 text-sm text-quantum-cyan hover:bg-quantum-cyan/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {current + 1 >= shuffled.length ? t('quiz.result') : t('quiz.next')}{' '}
                <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-quantum-cyan/10 text-quantum-cyan mb-3">
              <Trophy size={22} />
            </div>
            <div className="text-4xl font-display font-bold text-gradient-quantum">
              {score} / {shuffled.length}
            </div>
            <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
              {score === shuffled.length
                ? t('quiz.feedback.perfect')
                : score >= Math.ceil(shuffled.length / 2)
                ? t('quiz.feedback.good')
                : t('quiz.feedback.retry')}
            </p>
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-quantum-cyan transition-colors"
            >
              <RotateCcw size={14} /> {t('quiz.repeat')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default QuickQuiz;
