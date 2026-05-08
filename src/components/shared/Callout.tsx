import type { ReactNode } from 'react';
import { Info, AlertTriangle, Lightbulb, Quote } from 'lucide-react';

type CalloutVariant = 'info' | 'warning' | 'tip' | 'quote';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantStyles: Record<CalloutVariant, { border: string; bg: string; text: string; icon: ReactNode }> = {
  info: {
    border: 'border-quantum-blue/40',
    bg: 'bg-quantum-blue/5',
    text: 'text-quantum-blue',
    icon: <Info size={18} />,
  },
  warning: {
    border: 'border-quantum-rose/40',
    bg: 'bg-quantum-rose/5',
    text: 'text-quantum-rose',
    icon: <AlertTriangle size={18} />,
  },
  tip: {
    border: 'border-quantum-mint/40',
    bg: 'bg-quantum-mint/5',
    text: 'text-quantum-mint',
    icon: <Lightbulb size={18} />,
  },
  quote: {
    border: 'border-quantum-violet/40',
    bg: 'bg-quantum-violet/5',
    text: 'text-quantum-violet',
    icon: <Quote size={18} />,
  },
};

const Callout: React.FC<CalloutProps> = ({ variant = 'info', title, children }) => {
  const v = variantStyles[variant];
  return (
    <div className={`my-6 rounded-xl border ${v.border} ${v.bg} p-5 flex gap-4`}>
      <div className={`shrink-0 ${v.text} mt-0.5`}>{v.icon}</div>
      <div className="flex-1">
        {title && <p className={`font-semibold ${v.text} mb-1`}>{title}</p>}
        <div className="text-slate-300 leading-relaxed text-[15px]">{children}</div>
      </div>
    </div>
  );
};

export default Callout;
