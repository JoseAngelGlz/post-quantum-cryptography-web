import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check } from 'lucide-react';
import { useT } from '../../i18n';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { TranslationKey } from '../../i18n/translations';
import QubitScale from './QubitScale';

interface FeedbackFormProps {
  routeId: string;
  /** Legacy free-text name. If absent, uses the i18n key `feedback.route.<routeId>`. */
  routeName?: string;
  /** When true, drop the outer card/margins so the form fits inside a modal. */
  embed?: boolean;
  /** Called when the user successfully submits feedback. */
  onSent?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ routeId, routeName, embed = false, onSent }) => {
  const t = useT();
  const { feedbackSent } = useAnalytics();
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [clarity, setClarity] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const resolvedName =
    routeName ?? t(`feedback.route.${routeId}` as TranslationKey);

  const submit = () => {
    const payload = {
      routeId,
      routeName: resolvedName,
      difficulty,
      clarity,
      recommend,
      comment,
      ts: new Date().toISOString(),
    };
    try {
      const prev = JSON.parse(localStorage.getItem('pqc-feedback') || '[]');
      prev.push(payload);
      localStorage.setItem('pqc-feedback', JSON.stringify(prev));
    } catch {
      /* ignore */
    }
    if (difficulty && clarity && recommend) {
      feedbackSent(routeId, difficulty, clarity, recommend, comment.trim().length > 0);
    }
    setSent(true);
    onSent?.();
  };

  if (sent) {
    const sentBody = t('feedback.sent.body').replace('{name}', resolvedName);
    const wrapperClass = embed
      ? 'text-center py-4'
      : 'card-quantum p-10 text-center my-20';
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={wrapperClass}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-quantum-mint/15 text-quantum-mint mb-4">
          <Check size={28} />
        </div>
        <h3 className="font-display text-2xl font-semibold text-quantum-fg-strong mb-2">
          {t('feedback.sent.title')}
        </h3>
        <p className="text-quantum-fg">{sentBody}</p>
      </motion.div>
    );
  }

  const lead = t('feedback.lead').replace('{name}', resolvedName);

  const body = (
    <>
      <h3
        className={`font-display font-semibold text-quantum-fg-strong mb-1 ${
          embed ? 'text-lg' : 'text-2xl mb-2'
        }`}
      >
        {t('feedback.title')}
      </h3>
      <p className={`text-quantum-fg-soft text-sm ${embed ? 'mb-6' : 'mb-8'}`}>
        {lead}
      </p>

      <div className={`${
        embed
          ? 'space-y-6 mb-4'
          : 'grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6'
      }`}>
        <QubitScale
          label={t('feedback.q.difficulty')}
          value={difficulty}
          onChange={setDifficulty}
          compact={embed}
          emoji={['😤', '😕', '😐', '😊', '😄']}
        />
        <QubitScale
          label={t('feedback.q.clarity')}
          value={clarity}
          onChange={setClarity}
          compact={embed}
          emoji={['😤', '😕', '😐', '😊', '😄']}
        />
        <QubitScale
          label={t('feedback.q.recommend')}
          value={recommend}
          onChange={setRecommend}
          compact={embed}
          emoji={['😤', '😕', '😐', '😊', '😄']}
        />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('feedback.placeholder')}
        rows={embed ? 2 : 3}
        className="w-full bg-quantum-panel/40 border border-quantum-border rounded-xl px-4 py-2.5 text-quantum-fg placeholder:text-quantum-fg-mute focus:outline-none focus:border-quantum-cyan/60 resize-none text-sm"
      />

      <div className={`flex justify-end ${embed ? 'mt-4' : 'mt-6'}`}>
        <button
          onClick={submit}
          disabled={!difficulty || !clarity || !recommend}
          className={`btn-quantum disabled:opacity-40 disabled:cursor-not-allowed ${
            embed ? 'text-sm py-2 px-4' : ''
          }`}
        >
          <Send size={16} /> {t('feedback.send')}
        </button>
      </div>
    </>
  );

  if (embed) {
    return <div>{body}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="card-quantum p-8 md:p-10 my-20"
    >
      {body}
    </motion.div>
  );
};

export default FeedbackForm;
