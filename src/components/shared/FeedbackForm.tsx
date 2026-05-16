import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check } from 'lucide-react';
import { useT } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

interface FeedbackFormProps {
  routeId: string;
  /** Legacy free-text name. If absent, uses the i18n key `feedback.route.<routeId>`. */
  routeName?: string;
}

const scaleLabels = ['😩', '😕', '😐', '🙂', '🤩'];

const FeedbackForm: React.FC<FeedbackFormProps> = ({ routeId, routeName }) => {
  const t = useT();
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
    setSent(true);
  };

  const Scale = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number | null;
    onChange: (n: number) => void;
  }) => (
    <div>
      <p className="text-sm text-quantum-fg mb-3">{label}</p>
      <div className="flex gap-2">
        {scaleLabels.map((emo, i) => {
          const v = i + 1;
          const active = value === v;
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              className={`flex-1 aspect-square rounded-xl border text-2xl transition-all ${
                active
                  ? 'border-quantum-cyan bg-quantum-cyan/10 scale-110'
                  : 'border-quantum-border bg-quantum-panel/40 hover:border-quantum-cyan/40'
              }`}
            >
              {emo}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (sent) {
    const sentBody = t('feedback.sent.body').replace('{name}', resolvedName);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-quantum p-10 text-center my-20"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="card-quantum p-8 md:p-10 my-20"
    >
      <h3 className="font-display text-2xl font-semibold text-quantum-fg-strong mb-2">
        {t('feedback.title')}
      </h3>
      <p className="text-quantum-fg-soft mb-8 text-sm">{lead}</p>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Scale label={t('feedback.q.difficulty')} value={difficulty} onChange={setDifficulty} />
        <Scale label={t('feedback.q.clarity')} value={clarity} onChange={setClarity} />
        <Scale label={t('feedback.q.recommend')} value={recommend} onChange={setRecommend} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('feedback.placeholder')}
        rows={3}
        className="w-full bg-quantum-panel/40 border border-quantum-border rounded-xl px-4 py-3 text-quantum-fg placeholder:text-quantum-fg-mute focus:outline-none focus:border-quantum-cyan/60 resize-none"
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={submit}
          disabled={!difficulty || !clarity || !recommend}
          className="btn-quantum disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} /> {t('feedback.send')}
        </button>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;
