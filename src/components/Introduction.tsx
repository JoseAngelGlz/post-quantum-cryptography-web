import { useState } from 'react';
import { ArrowLeft, ChevronRight, Lock, ShieldCheck, Zap } from 'lucide-react';

type IntroTopic = 'quantum-security' | 'nist-standard' | 'math-structures';

interface IntroCard {
  id: IntroTopic;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const introCards: IntroCard[] = [
  {
    id: 'quantum-security',
    title: 'Protección frente a la computación cuántica',
    description:
      'En lugar de fundamentarse en la factorización de enteros o en el logaritmo discreto, la criptografía post-cuántica se apoya en problemas matemáticos distintos.',
    icon: <ShieldCheck className="text-blue-500" size={22} />,
  },
  {
    id: 'nist-standard',
    title: 'Estándares NIST para la criptografía post-cuántica (FIPS 203–205)',
    description:
      'En 2024, el NIST publicó FIPS 203, 204 y 205 para estandarizar ML-KEM, ML-DSA y SLH-DSA.',
    icon: <Zap className="text-green-500" size={22} />,
  },
  {
    id: 'math-structures',
    title: 'Estructuras matemáticas',
    description:
      'Retículos, códigos correctores, funciones hash y polinomios multivariantes como base de la criptografía post-cuántica.',
    icon: <Lock className="text-purple-500" size={22} />,
  },
];

const topicContent: Record<IntroTopic, { title: string; body: string[] }> = {
  'quantum-security': {
    title: 'Protección frente a la computación cuántica',
    body: [
      'En lugar de fundamentarse en la factorización de enteros o en el problema del logaritmo discreto, como ocurre en RSA y ECC, la criptografía post-cuántica se apoya en problemas distintos, tales como Learning With Errors (LWE), el Shortest Vector Problem (SVP) y construcciones basadas en funciones hash resistentes.',
      'Una estrategia práctica es la migración híbrida: combinar algoritmos clásicos y post-cuánticos durante la transición de infraestructuras.',
    ],
  },
  'nist-standard': {
    title: 'Estándares NIST para la criptografía post-cuántica (FIPS 203–205)',
    body: [
      'El proceso del NIST evaluó seguridad, rendimiento e implementación real para seleccionar estándares robustos.',
      'FIPS 203 define ML-KEM (basado en retículos módulo), FIPS 204 define ML-DSA y FIPS 205 define SLH-DSA.',
      'El objetivo no es solo teoría: también interoperabilidad, despliegue en protocolos y guías de migración para la industria.',
    ],
  },
  'math-structures': {
    title: 'Estructuras matemáticas',
    body: [
      'Retículos: base de ML-KEM y ML-DSA mediante problemas como LWE / Module-LWE.',
      'Códigos correctores de errores: familia histórica en criptografía post-cuántica (ej. McEliece).',
      'Funciones hash: base de SLH-DSA y otras firmas resistentes.',
      'Polinomios multivariantes: sistemas algebraicos con ecuaciones no lineales sobre campos finitos.',
    ],
  },
};

const Introduction: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<IntroTopic | null>(null);

  if (selectedTopic) {
    const detail = topicContent[selectedTopic];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => setSelectedTopic(null)}
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={16} /> Volver a Introducción
        </button>

        <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{detail.title}</h2>
          <div className="mt-4 space-y-3">
            {detail.body.map((paragraph) => (
              <p key={paragraph} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero — title as protagonist */}
      <header>
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
          Criptografía<br />
          <span className="text-blue-600 dark:text-blue-400">Post-Cuántica</span>
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
          La llegada de los ordenadores cuánticos representa una amenaza directa a los sistemas
          criptográficos actuales. Esta aplicación explora las bases matemáticas y los algoritmos
          que formarán la criptografía del futuro.
        </p>
      </header>

      {/* Clickable cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {introCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelectedTopic(card.id)}
            className="text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {card.icon}
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{card.title}</h3>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Introduction;
