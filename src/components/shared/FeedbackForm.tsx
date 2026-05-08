import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check } from 'lucide-react';

interface FeedbackFormProps {
  routeId: string;
  routeName: string;
}

const scaleLabels = ['😩', '😕', '😐', '🙂', '🤩'];

const FeedbackForm: React.FC<FeedbackFormProps> = ({ routeId, routeName }) => {
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [clarity, setClarity] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    const payload = {
      routeId,
      routeName,
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
      <p className="text-sm text-slate-300 mb-3">{label}</p>
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
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-quantum p-10 text-center my-20"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-quantum-mint/15 text-quantum-mint mb-4">
          <Check size={28} />
        </div>
        <h3 className="font-display text-2xl font-semibold text-slate-100 mb-2">¡Gracias!</h3>
        <p className="text-slate-300">Tu opinión sobre <span className="text-quantum-cyan">{routeName}</span> queda guardada localmente.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="card-quantum p-8 md:p-10 my-20"
    >
      <h3 className="font-display text-2xl font-semibold text-slate-100 mb-2">
        ¿Qué te ha parecido?
      </h3>
      <p className="text-slate-400 mb-8 text-sm">
        Una opinión rápida sobre <span className="text-quantum-cyan">{routeName}</span> ayuda a mejorar el material.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Scale label="¿Cómo de fácil te ha resultado?" value={difficulty} onChange={setDifficulty} />
        <Scale label="¿Sientes que estás aprendiendo?" value={clarity} onChange={setClarity} />
        <Scale label="¿Lo recomendarías?" value={recommend} onChange={setRecommend} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentario libre (opcional)…"
        rows={3}
        className="w-full bg-quantum-panel/40 border border-quantum-border rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-quantum-cyan/60 resize-none"
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={submit}
          disabled={!difficulty || !clarity || !recommend}
          className="btn-quantum disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} /> Enviar opinión
        </button>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;
