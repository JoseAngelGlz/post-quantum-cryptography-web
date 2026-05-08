import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Cpu, Sigma } from 'lucide-react';
import type { RouteId } from '../../routes';

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

const defaultCards: RouteCardData[] = [
  {
    id: 'fundamentos',
    eyebrow: 'Camino lineal',
    title: 'Fundamentos matemáticos',
    description:
      'Retículos, problemas SVP/CVP/LWE, anillo de polinomios, hashes y códigos correctores. La base sobre la que se sostiene todo lo demás.',
    highlight: 'Recomendado',
    icon: <Sigma size={28} />,
    hue: 'from-quantum-cyan/20 to-quantum-blue/10',
    primary: true,
  },
  {
    id: 'aplicaciones',
    eyebrow: 'Atajo',
    title: 'Aplicaciones criptográficas',
    description:
      'De RSA al algoritmo de Shor, las cinco familias post-cuánticas, IND-CPA / IND-CCA2 y la transformación Fujisaki-Okamoto.',
    highlight: 'Visión panorámica',
    icon: <BookOpen size={28} />,
    hue: 'from-quantum-violet/20 to-quantum-pink/10',
  },
  {
    id: 'mlkem',
    eyebrow: 'Salto directo',
    title: 'ML-KEM · teoría y simulador',
    description:
      'KeyGen, Encaps, Decaps paso a paso, la cancelación matemática y un simulador interactivo donde ver el algoritmo en acción.',
    highlight: 'El plato fuerte',
    icon: <Cpu size={28} />,
    hue: 'from-quantum-pink/20 to-quantum-amber/10',
  },
];

const RouteSwitcher: React.FC<RouteSwitcherProps> = ({
  current,
  onChange,
  title = 'Elige cómo continuar',
  subtitle = 'A partir de aquí puedes seguir el camino lineal o saltar al bloque que más te interese. Siempre podrás volver.',
  cards = defaultCards,
}) => {
  return (
    <section className="section-y px-6 md:px-10 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <div className="chip mb-4">Bifurcación</div>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-100">
          {title}
        </h2>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const isCurrent = current === card.id;
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => onChange(card.id)}
              disabled={isCurrent}
              className={`group relative text-left card-quantum p-7 ${
                card.primary ? 'md:scale-[1.02] glow-cyan' : ''
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

                <div className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
                  {card.eyebrow}
                </div>
                <h3 className="font-display text-xl font-bold text-slate-100 mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {card.description}
                </p>

                <div className="flex items-center gap-2 text-quantum-cyan font-medium text-sm group-hover:gap-3 transition-all">
                  {isCurrent ? 'Estás aquí' : 'Entrar'}
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
