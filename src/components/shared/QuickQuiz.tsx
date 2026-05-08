import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, RotateCcw } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuickQuizProps {
  questions: QuizQuestion[];
  title?: string;
}

const QuickQuiz: React.FC<QuickQuizProps> = ({ questions, title = 'Pon a prueba lo que has leído' }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[current];
  if (!q) return null;

  const choose = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setRevealed(false);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="card-quantum p-8 md:p-10 my-16 relative"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
          <Sparkles size={18} />
        </div>
        <h3 className="font-display text-xl font-semibold text-slate-100">{title}</h3>
        <span className="ml-auto text-xs text-slate-400 font-mono">
          {done ? `${score}/${questions.length}` : `${current + 1}/${questions.length}`}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg md:text-xl text-slate-100 mb-6 font-medium">
              {q.question}
            </p>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = revealed && i === q.correctIndex;
                const isWrong = revealed && i === selected && i !== q.correctIndex;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={revealed}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all flex items-start gap-3 ${
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
                        <Check size={18} />
                      ) : isWrong ? (
                        <X size={18} />
                      ) : (
                        <span className="inline-block w-5 h-5 rounded-full border border-current opacity-50" />
                      )}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {revealed && q.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-5 p-4 rounded-xl bg-quantum-panel2/40 border border-quantum-border text-sm text-slate-300 leading-relaxed"
              >
                {q.explanation}
              </motion.div>
            )}

            {revealed && (
              <div className="mt-6 flex justify-end">
                <button onClick={next} className="btn-quantum">
                  {current + 1 >= questions.length ? 'Ver resultado' : 'Siguiente'}
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-8"
          >
            <div className="text-6xl font-display font-bold text-gradient-quantum">
              {score}/{questions.length}
            </div>
            <p className="mt-4 text-slate-300 max-w-md mx-auto">
              {score === questions.length
                ? '¡Impecable! Tienes el concepto cogido al vuelo.'
                : score >= Math.ceil(questions.length / 2)
                ? 'Buen trabajo. Quedan matices, pero vas bien.'
                : 'Sin prisa: vuelve a la sección y repítelo, así se asienta.'}
            </p>
            <button onClick={reset} className="btn-ghost mt-6">
              <RotateCcw size={16} /> Repetir
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuickQuiz;
