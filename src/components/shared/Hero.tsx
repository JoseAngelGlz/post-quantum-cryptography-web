import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useT } from '../../i18n';

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** kept for backwards compatibility, ignored now that the constellation is global */
  hueA?: number;
  hueB?: number;
  scrollHint?: boolean;
  /** If provided, shows a back button that calls this handler */
  onBack?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  eyebrow,
  title,
  subtitle,
  scrollHint = true,
  onBack,
}) => {
  const t = useT();

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center items-center overflow-hidden">
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={onBack}
          className="absolute top-24 left-6 md:left-10 flex items-center gap-2 text-sm text-quantum-fg-soft hover:text-quantum-cyan transition-colors group z-10"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('ui.backSection')}
        </motion.button>
      )}

      <div className="relative z-10 max-w-5xl px-6 text-center">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="chip mb-6"
          >
            {eyebrow}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-8 text-lg md:text-xl text-quantum-fg-soft max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {scrollHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-xs tracking-[0.3em] uppercase">{t('ui.scrollHint')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
