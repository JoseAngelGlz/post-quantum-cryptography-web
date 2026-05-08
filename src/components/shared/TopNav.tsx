import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { RouteId } from '../../routes';

interface TopNavProps {
  current: RouteId;
  onChange: (r: RouteId) => void;
}

const routeLabels: Record<RouteId, string> = {
  intro: 'Introducción',
  fundamentos: 'Fundamentos',
  aplicaciones: 'Aplicaciones',
  mlkem: 'ML-KEM',
};

const order: RouteId[] = ['intro', 'fundamentos', 'aplicaciones', 'mlkem'];

const TopNav: React.FC<TopNavProps> = ({ current, onChange }) => {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-quantum-bg/60 border-b border-quantum-border/60"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <button
          onClick={() => onChange('intro')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-quantum-cyan to-quantum-violet flex items-center justify-center font-bold text-quantum-bg text-sm">
            Q
          </div>
          <span className="font-display font-semibold text-slate-100 group-hover:text-quantum-cyan transition-colors hidden sm:block">
            PQC · TFG
          </span>
        </button>

        <nav className="flex items-center gap-1 text-sm">
          {order.map((r) => (
            <button
              key={r}
              onClick={() => onChange(r)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                current === r
                  ? 'text-quantum-cyan bg-quantum-cyan/10'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {routeLabels[r]}
            </button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export default TopNav;

export const BackToIntro: React.FC<{ onChange: (r: RouteId) => void }> = ({ onChange }) => (
  <button
    onClick={() => onChange('intro')}
    className="btn-ghost text-sm"
  >
    <ArrowLeft size={14} /> Volver al inicio
  </button>
);
