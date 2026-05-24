import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Award, BarChart3, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';
import {
  clearAllQuizResults,
  getAllQuizResults,
  getAllQuizReactions,
  subscribeToQuizResults,
  type QuizResult,
  type QuizReaction,
} from './quizStore';
import { useT } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';
import Modal from './Modal';
import FeedbackForm from './FeedbackForm';

const reactionEmoji = (r: QuizReaction | undefined): string => {
  if (r === 1) return '😕';
  if (r === 2) return '🙂';
  if (r === 3) return '🤩';
  return '';
};

/** Total number of mini-tests across the entire tour. Update if more are added. */
const TOTAL_QUIZZES = 6;

const ProgressBadge: React.FC = () => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [results, setResults] = useState<QuizResult[]>(() => getAllQuizResults());
  const [reactions, setReactions] = useState<Record<string, QuizReaction>>(
    () => getAllQuizReactions(),
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = subscribeToQuizResults(() => {
      setResults(getAllQuizResults());
      setReactions(getAllQuizReactions());
    });
    return () => {
      unsub();
    };
  }, []);

  // close on outside click / escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const completed = results.length;
  const ratio = Math.min(completed / TOTAL_QUIZZES, 1);

  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const totalQuestions = results.reduce((acc, r) => acc + r.total, 0);
  const percent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  // ring geometry
  const SIZE = 36;
  const STROKE = 2.5;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - ratio);

  const routeLabel = (routeId: string): string => {
    const key = `nav.${routeId}` as TranslationKey;
    return t(key) ?? routeId;
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('progress.aria')}
        title={t('progress.aria')}
        className="relative flex items-center justify-center rounded-full hover:bg-quantum-panel/60 transition-colors p-0.5"
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="block">
          {/* track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgb(var(--border))"
            strokeWidth={STROKE}
          />
          {/* progress arc */}
          {ratio > 0 && (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="url(#progress-grad)"
              strokeWidth={STROKE}
              strokeDasharray={C}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{ transition: 'stroke-dashoffset 400ms ease-out' }}
            />
          )}
          <defs>
            <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--cyan))" />
              <stop offset="100%" stopColor="rgb(var(--violet))" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-quantum-fg-strong leading-none">
          {completed}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-2rem)] origin-top-right card-quantum p-5 shadow-2xl z-50"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-quantum-cyan/15 text-quantum-cyan shrink-0">
                <Award size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-bold text-quantum-fg-strong">
                  {t('progress.title')}
                </h3>
                <p className="text-xs text-quantum-fg-soft mt-0.5">
                  {t('progress.lead')}
                </p>
              </div>
              {completed > 0 && (
                <button
                  onClick={() => clearAllQuizResults()}
                  title={t('quizsum.clear')}
                  className="p-1.5 rounded-md text-quantum-fg-mute hover:text-quantum-rose hover:bg-quantum-rose/10 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {completed === 0 ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-quantum-violet/10 text-quantum-violet mb-2">
                  <BarChart3 size={18} />
                </div>
                <p className="text-sm text-quantum-fg-strong font-medium mb-1">
                  {t('progress.empty.title')}
                </p>
                <p className="text-xs text-quantum-fg-soft">
                  {t('progress.empty.body')}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-2.5 text-center">
                    <div className="text-[9px] uppercase tracking-widest text-quantum-fg-mute">
                      {t('quizsum.col.hits')}
                    </div>
                    <div className="font-display text-lg font-bold text-gradient-quantum leading-tight">
                      {totalScore}
                      <span className="text-quantum-fg-mute text-xs">/{totalQuestions}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-2.5 text-center">
                    <div className="text-[9px] uppercase tracking-widest text-quantum-fg-mute">
                      {t('quizsum.col.pct')}
                    </div>
                    <div
                      className={`font-display text-lg font-bold leading-tight ${
                        percent >= 80
                          ? 'text-quantum-mint'
                          : percent >= 50
                          ? 'text-quantum-cyan'
                          : 'text-quantum-amber'
                      }`}
                    >
                      {percent}%
                    </div>
                  </div>
                  <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-2.5 text-center">
                    <div className="text-[9px] uppercase tracking-widest text-quantum-fg-mute">
                      {t('quizsum.col.tests')}
                    </div>
                    <div className="font-display text-lg font-bold text-quantum-fg-strong leading-tight">
                      {completed}
                      <span className="text-quantum-fg-mute text-xs">/{TOTAL_QUIZZES}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {results.map((r) => {
                    const pct = Math.round((r.score / r.total) * 100);
                    const displayTitle = r.titleKey
                      ? t(r.titleKey as TranslationKey)
                      : r.title;
                    return (
                      <div
                        key={r.quizId}
                        className="rounded-lg border border-quantum-border bg-quantum-panel/30 p-2.5 flex items-center gap-2.5"
                      >
                        <div className="shrink-0">
                          {pct === 100 ? (
                            <CheckCircle2 size={16} className="text-quantum-mint" />
                          ) : pct >= 50 ? (
                            <CheckCircle2 size={16} className="text-quantum-cyan" />
                          ) : (
                            <AlertCircle size={16} className="text-quantum-amber" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] uppercase tracking-widest text-quantum-violet font-mono">
                            {routeLabel(r.routeId)}
                          </div>
                          <div className="text-xs font-medium text-quantum-fg-strong truncate">
                            {displayTitle}
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-1.5">
                          {reactions[r.quizId] && (
                            <span className="text-base" title={t('quiz.reaction.thanks')}>
                              {reactionEmoji(reactions[r.quizId])}
                            </span>
                          )}
                          <div className="font-mono text-xs font-semibold text-quantum-fg-strong">
                            {r.score}/{r.total}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* footer: open generic feedback */}
            <div className="mt-4 pt-3 border-t border-quantum-border/50">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setFeedbackOpen(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border border-quantum-border bg-quantum-panel/40 text-quantum-fg-soft hover:text-quantum-cyan hover:border-quantum-cyan/50 transition-all"
              >
                <MessageSquare size={13} />
                {t('progress.giveFeedback')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback modal — site-wide opinion */}
      <Modal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="max-w-2xl">
        <FeedbackForm
          routeId="progreso"
          embed
          onSent={() => {
            // close shortly after sending so the confirmation is seen
            setTimeout(() => setFeedbackOpen(false), 1800);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProgressBadge;
