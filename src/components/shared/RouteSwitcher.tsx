import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Cpu, FileSignature, Sigma } from 'lucide-react';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';

interface RouteCardData {
  id: RouteId;
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  icon: React.ReactNode;
  hue: string;
  primary?: boolean;
}

interface RouteSwitcherProps {
  current?: RouteId;
  onChange: (r: RouteId) => void;
  title?: string;
  subtitle?: string;
  cards?: RouteCardData[];
}

const RouteSwitcher: React.FC<RouteSwitcherProps> = ({
  current,
  onChange,
  title,
  subtitle,
  cards,
}) => {
  const t = useT();
  const defaultCards: RouteCardData[] = [
    {
      id: 'fundamentos',
      eyebrow: t('switcher.fund.eyebrow'),
      title: t('switcher.fund.title'),
      description: t('switcher.fund.desc'),
      highlight: t('switcher.fund.highlight'),
      icon: <Sigma size={28} />,
      hue: 'from-quantum-cyan/20 to-quantum-blue/10',
      primary: true,
    },
    {
      id: 'aplicaciones',
      eyebrow: t('switcher.apps.eyebrow'),
      title: t('switcher.apps.title'),
      description: t('switcher.apps.desc'),
      highlight: t('switcher.apps.highlight'),
      icon: <BookOpen size={28} />,
      hue: 'from-quantum-violet/20 to-quantum-pink/10',
    },
    {
      id: 'mlkem',
      eyebrow: t('switcher.mlkem.eyebrow'),
      title: t('switcher.mlkem.title'),
      description: t('switcher.mlkem.desc'),
      highlight: t('switcher.mlkem.highlight'),
      icon: <Cpu size={28} />,
      hue: 'from-quantum-pink/20 to-quantum-amber/10',
    },
    {
      id: 'mldsa',
      eyebrow: t('switcher.mldsa.eyebrow'),
      title: t('switcher.mldsa.title'),
      description: t('switcher.mldsa.desc'),
      highlight: t('switcher.mldsa.highlight'),
      icon: <FileSignature size={28} />,
      hue: 'from-quantum-violet/20 to-quantum-cyan/10',
    },
  ];

  const finalCards = cards ?? defaultCards;
  const finalTitle = title ?? t('switcher.title');
  const finalSubtitle = subtitle ?? t('switcher.subtitle');

  return (
    <section className="section-y px-6 md:px-10 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <div className="chip mb-4">{t('switcher.chip')}</div>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-quantum-fg-strong">
          {finalTitle}
        </h2>
        <p className="mt-4 text-quantum-fg-soft max-w-2xl mx-auto">{finalSubtitle}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {finalCards.map((card, idx) => {
          const isCurrent = current === card.id;
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => onChange(card.id)}
              disabled={isCurrent}
              className={`group relative text-left card-quantum p-7 ${
                card.primary ? 'glow-cyan' : ''
              } ${isCurrent ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.hue} opacity-60 pointer-events-none`}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div
                    className={`p-3 rounded-xl ${
                      card.primary
                        ? 'bg-quantum-cyan/15 text-quantum-cyan'
                        : 'bg-quantum-violet/15 text-quantum-violet'
                    }`}
                  >
                    {card.icon}
                  </div>
                  <span className="chip text-[10px]">{card.highlight}</span>
                </div>

                <div className="text-xs uppercase tracking-[0.25em] text-quantum-fg-mute mb-2">
                  {card.eyebrow}
                </div>
                <h3 className="font-display text-xl font-bold text-quantum-fg-strong mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-quantum-fg-soft leading-relaxed mb-6">
                  {card.description}
                </p>

                <div className="flex items-center gap-2 text-quantum-cyan font-medium text-sm group-hover:gap-3 transition-all">
                  {isCurrent ? t('switcher.youAreHere') : t('switcher.enter')}
                  {!isCurrent && <ArrowRight size={16} />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default RouteSwitcher;
