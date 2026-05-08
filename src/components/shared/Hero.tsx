import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ParticleField from './ParticleField';

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  hueA?: number;
  hueB?: number;
  scrollHint?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  eyebrow,
  title,
  subtitle,
  hueA = 175,
  hueB = 265,
  scrollHint = true,
}) => {
  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center items-center overflow-hidden">
      {/* animated radial gradient bg */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(94,234,212,0.20), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(167,139,250,0.25), transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(96,165,250,0.10), transparent 60%)',
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-50" />
      </div>

      <ParticleField hueA={hueA} hueB={hueB} density={90} />

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
            className="mt-8 text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed"
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
          <span className="text-xs tracking-[0.3em] uppercase">scroll</span>
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
