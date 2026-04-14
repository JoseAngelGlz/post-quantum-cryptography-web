import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

/* ───────── Types ───────── */

export interface MultipleChoiceQuestion {
  type: 'multiple-choice';
  question: string;
  options: string[];
  /** Index (0-based) of the correct option */
  correctIndex: number;
  explanation: string;
}

export interface TextQuestion {
  type: 'text';
  question: string;
  /** Accepted answers (case-insensitive, trimmed) */
  acceptedAnswers: string[];
  explanation: string;
}

export type Exercise = MultipleChoiceQuestion | TextQuestion;

interface Props {
  title?: string;
  exercises: Exercise[];
}

/* ───────── Score label ───────── */

function scoreLabel(correct: number, total: number): { text: string; color: string } {
  if (total === 0) return { text: '', color: '' };
  const ratio = correct / total;
  if (ratio === 1) return { text: '4 — Excelente', color: 'text-emerald-600 dark:text-emerald-400' };
  if (ratio >= 0.75) return { text: '3 — Notable', color: 'text-blue-600 dark:text-blue-400' };
  if (ratio >= 0.5) return { text: '2 — Aprobado', color: 'text-amber-600 dark:text-amber-400' };
  return { text: '1 — Necesita refuerzo', color: 'text-red-600 dark:text-red-400' };
}

/* ───────── Component ───────── */

const InlineExercises: React.FC<Props> = ({ title = 'Autoevaluación', exercises }) => {
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleCheck = (idx: number) => {
    const ex = exercises[idx];
    let correct = false;
    if (ex.type === 'multiple-choice') {
      correct = answers[idx] === ex.correctIndex;
    } else {
      const userAnswer = String(answers[idx] ?? '').trim().toLowerCase();
      correct = ex.acceptedAnswers.some((a) => a.toLowerCase() === userAnswer);
    }
    setChecked((prev) => ({ ...prev, [idx]: true }));
    setResults((prev) => ({ ...prev, [idx]: correct }));
  };

  const handleReset = () => {
    setAnswers({});
    setChecked({});
    setResults({});
  };

  const totalChecked = Object.keys(checked).length;
  const totalCorrect = Object.values(results).filter(Boolean).length;
  const allDone = totalChecked === exercises.length;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        {totalChecked > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            <RotateCcw size={13} /> Reiniciar
          </button>
        )}
      </div>

      {exercises.map((ex, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-3"
        >
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {idx + 1}. {ex.question}
          </p>

          {ex.type === 'multiple-choice' ? (
            <div className="space-y-2">
              {ex.options.map((opt, oi) => {
                const selected = answers[idx] === oi;
                const isChecked = checked[idx];
                const isCorrectOption = oi === ex.correctIndex;
                let optClasses =
                  'w-full text-left px-3 py-2 rounded-lg text-sm border transition ';
                if (isChecked && isCorrectOption) {
                  optClasses +=
                    'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
                } else if (isChecked && selected && !isCorrectOption) {
                  optClasses +=
                    'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
                } else if (selected) {
                  optClasses +=
                    'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
                } else {
                  optClasses +=
                    'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={!!isChecked}
                    onClick={() => setAnswers((prev) => ({ ...prev, [idx]: oi }))}
                    className={optClasses}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              disabled={!!checked[idx]}
              placeholder="Escribe tu respuesta…"
              value={String(answers[idx] ?? '')}
              onChange={(ev) =>
                setAnswers((prev) => ({ ...prev, [idx]: ev.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          {!checked[idx] && answers[idx] !== undefined && answers[idx] !== '' && (
            <button
              type="button"
              onClick={() => handleCheck(idx)}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
            >
              Comprobar
            </button>
          )}

          {checked[idx] && (
            <div
              className={`flex items-start gap-2 text-xs rounded-lg p-3 ${
                results[idx]
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              }`}
            >
              {results[idx] ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> : <XCircle size={14} className="shrink-0 mt-0.5" />}
              <span>{ex.explanation}</span>
            </div>
          )}
        </div>
      ))}

      {allDone && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 text-center space-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Resultado: {totalCorrect} / {exercises.length}
          </p>
          <p className={`text-sm font-bold ${scoreLabel(totalCorrect, exercises.length).color}`}>
            {scoreLabel(totalCorrect, exercises.length).text}
          </p>
        </div>
      )}
    </section>
  );
};

export default InlineExercises;
