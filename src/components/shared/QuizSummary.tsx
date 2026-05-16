import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trash2, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  clearAllQuizResults,
  getAllQuizResults,
  subscribeToQuizResults,
  type QuizResult,
} from './quizStore';
import { useT, useI18n } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

const QuizSummary: React.FC = () => {
  const t = useT();
  const { locale } = useI18n();
  const [results, setResults] = useState<QuizResult[]>(() => getAllQuizResults());

  useEffect(() => {
    const unsub = subscribeToQuizResults(() => setResults(getAllQuizResults()));
    return () => {
      unsub();
    };
  }, []);

  const routeLabel = (routeId: string): string => {
    const key = `nav.${routeId}` as TranslationKey;
    return t(key) ?? routeId;
  };

  if (!results.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="card-quantum p-6 md:p-8 my-12 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-quantum-violet/10 text-quantum-violet mb-3">
          <BarChart3 size={22} />
        </div>
        <h3 className="font-display text-lg md:text-xl font-semibold text-quantum-fg-strong mb-1">
          {t('quizsum.empty.title')}
        </h3>
        <p className="text-sm text-quantum-fg-soft max-w-md mx-auto">
          {t('quizsum.empty.body')}
        </p>
      </motion.div>
    );
  }

  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const totalQuestions = results.reduce((acc, r) => acc + r.total, 0);
  const percent = Math.round((totalScore / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="card-quantum p-7 md:p-10 my-12 relative overflow-hidden"
      data-locale={locale}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-quantum-cyan/5 via-transparent to-quantum-violet/5 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-quantum-cyan/15 text-quantum-cyan">
            <Award size={26} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl md:text-2xl font-bold text-quantum-fg-strong">
              {t('quizsum.title')}
            </h3>
            <p className="text-sm text-quantum-fg-soft">{t('quizsum.lead')}</p>
          </div>
          <button
            onClick={() => clearAllQuizResults()}
            title={t('quizsum.clear')}
            className="p-2 rounded-lg text-quantum-fg-mute hover:text-quantum-rose hover:bg-quantum-rose/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-quantum-fg-mute mb-1">
              {t('quizsum.col.hits')}
            </div>
            <div className="font-display text-3xl font-bold text-gradient-quantum">
              {totalScore}
              <span className="text-quantum-fg-mute text-lg">/{totalQuestions}</span>
            </div>
          </div>
          <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-quantum-fg-mute mb-1">
              {t('quizsum.col.pct')}
            </div>
            <div
              className={`font-display text-3xl font-bold ${
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
          <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-quantum-fg-mute mb-1">
              {t('quizsum.col.tests')}
            </div>
            <div className="font-display text-3xl font-bold text-quantum-fg-strong">
              {results.length}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {results.map((r) => {
            const pct = Math.round((r.score / r.total) * 100);
            return (
              <div
                key={r.quizId}
                className="rounded-xl border border-quantum-border bg-quantum-panel/30 p-4 flex items-center gap-4"
              >
                <div className="shrink-0">
                  {pct === 100 ? (
                    <CheckCircle2 size={20} className="text-quantum-mint" />
                  ) : pct >= 50 ? (
                    <CheckCircle2 size={20} className="text-quantum-cyan" />
                  ) : (
                    <AlertCircle size={20} className="text-quantum-amber" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-widest text-quantum-violet font-mono">
                      {routeLabel(r.routeId)}
                    </span>
                    <span className="font-display text-sm font-semibold text-quantum-fg-strong truncate">
                      {r.titleKey ? t(r.titleKey as TranslationKey) : r.title}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-quantum-panel2/80 overflow-hidden">
                    <div
                      className={`h-full ${
                        pct >= 80
                          ? 'bg-quantum-mint'
                          : pct >= 50
                          ? 'bg-quantum-cyan'
                          : 'bg-quantum-amber'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-semibold text-quantum-fg-strong text-sm">
                    {r.score}/{r.total}
                  </div>
                  <div className="text-[10px] text-quantum-fg-mute">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizSummary;
