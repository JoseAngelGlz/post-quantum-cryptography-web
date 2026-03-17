import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronRight, GitBranch, Lock, ShieldCheck, Zap } from 'lucide-react';

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
    title: 'Seguridad cuántica',
    description:
      'Los algoritmos PQC resisten ataques clásicos y cuánticos apoyándose en problemas matemáticos intratables.',
    icon: <ShieldCheck className="text-blue-500" size={22} />,
  },
  {
    id: 'nist-standard',
    title: 'Estándar NIST',
    description:
      'En 2024, el NIST publicó FIPS 203, 204 y 205 para estandarizar ML-KEM, ML-DSA y SLH-DSA.',
    icon: <Zap className="text-green-500" size={22} />,
  },
  {
    id: 'math-structures',
    title: 'Estructuras matemáticas',
    description:
      'Retículos, códigos correctores, funciones hash y polinomios multivariantes como base de la PQC.',
    icon: <Lock className="text-purple-500" size={22} />,
  },
];

const topicContent: Record<IntroTopic, { title: string; body: string[] }> = {
  'quantum-security': {
    title: 'Seguridad cuántica',
    body: [
      'La seguridad post-cuántica busca que los sistemas sigan siendo seguros cuando existan ordenadores cuánticos criptográficamente relevantes.',
      'En lugar de basarse en factorización o logaritmo discreto (como RSA o ECC), se apoya en problemas como LWE, SVP o funciones hash resistentes.',
      'Una estrategia práctica es la migración híbrida: combinar algoritmos clásicos y PQC durante la transición de infraestructuras.',
    ],
  },
  'nist-standard': {
    title: 'Estándar NIST',
    body: [
      'El proceso del NIST evaluó seguridad, rendimiento e implementación real para seleccionar estándares robustos.',
      'FIPS 203 define ML-KEM (basado en retículos módulo), FIPS 204 define ML-DSA y FIPS 205 define SLH-DSA.',
      'El objetivo no es solo teoría: también interoperabilidad, despliegue en protocolos y guías de migración para industria.',
    ],
  },
  'math-structures': {
    title: 'Estructuras matemáticas',
    body: [
      'Retículos (Lattices): base de ML-KEM y ML-DSA mediante problemas como LWE / Module-LWE.',
      'Códigos correctores de errores (Error-Correcting Codes): familia histórica en criptografía post-cuántica (ej. McEliece).',
      'Funciones hash (Hash-Based Signatures): base de SLH-DSA y otras firmas resistentes.',
      'Polinomios multivariantes (Multivariate Polynomials): sistemas algebraicos con ecuaciones no lineales sobre campos finitos.',
    ],
  },
};

/* ── Timeline data for interactive tree ─────────────────────── */
interface TimelineNode {
  id: string;
  year: string;
  title: string;
  summary: string;
  details: string[];
}

const timelineNodes: TimelineNode[] = [
  {
    id: '2016',
    year: '2016',
    title: 'Convocatoria',
    summary: 'NIST abre la llamada internacional para proponer algoritmos PQC.',
    details: [
      'Se publica el documento «Submission Requirements and Evaluation Criteria for the Post-Quantum Cryptography Standardization Process».',
      'Objetivo: identificar algoritmos de clave pública resistentes a ataques cuánticos.',
    ],
  },
  {
    id: '2017',
    year: '2017',
    title: 'Ronda inicial',
    summary: '69 propuestas entran en evaluación criptográfica y de implementación.',
    details: [
      'Propuestas de todo el mundo cubriendo retículos, códigos, hashes, isogenias y multivariantes.',
      'Se inician análisis de seguridad, rendimiento y tamaño de claves.',
    ],
  },
  {
    id: '2019-20',
    year: '2019-2020',
    title: 'Rondas intermedias',
    summary: 'Se filtran candidatos y se consolidan familias con mejor equilibrio seguridad/rendimiento.',
    details: [
      'Se reduce de 69 a 26 candidatos (Ronda 2) y luego a 7 finalistas + 8 alternativas (Ronda 3).',
      'Los retículos (Kyber, Dilithium, NTRU, FALCON) dominan como familia más eficiente.',
    ],
  },
  {
    id: '2022',
    year: '2022',
    title: 'Selección principal',
    summary: 'NIST anuncia Kyber, Dilithium, FALCON y SPHINCS+ como algoritmos seleccionados.',
    details: [
      'CRYSTALS-Kyber: KEM basado en Module-LWE (retículos).',
      'CRYSTALS-Dilithium: firma digital basada en Module-LWE.',
      'FALCON: firma basada en retículos NTRU con muestreo gaussiano.',
      'SPHINCS+: firma basada en funciones hash (sin retículos).',
    ],
  },
  {
    id: '2024',
    year: '2024',
    title: 'Estandarización',
    summary: 'Publicación de FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) y FIPS 205 (SLH-DSA).',
    details: [
      'ML-KEM (antes Kyber) definido en FIPS 203 con niveles 512, 768 y 1024.',
      'ML-DSA (antes Dilithium) definido en FIPS 204.',
      'SLH-DSA (antes SPHINCS+) definido en FIPS 205.',
    ],
  },
  {
    id: 'next',
    year: 'Siguiente fase',
    title: 'Migración práctica',
    summary: 'Despliegue gradual en protocolos, bibliotecas y sistemas productivos.',
    details: [
      'TLS 1.3 ya experimenta con esquemas híbridos (ej. X25519 + ML-KEM-768).',
      'Organismos como ANSSI, BSI y NSA publican guías de migración.',
      'Se evalúan candidatos adicionales para firmas (HQC, BIKE…).',
    ],
  },
];

const Introduction: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<IntroTopic | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

      {/* Interactive Timeline Tree */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch size={18} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Cronología del Proceso NIST PQC
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Haz clic en cada nodo para expandir los detalles del proceso de estandarización.
        </p>

        <div className="relative ml-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-3 pt-2">
          {timelineNodes.map((node) => {
            const isOpen = expandedNodes.has(node.id);
            return (
              <div key={node.id} className="relative pl-6">
                {/* Dot on the line */}
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800" />

                <button
                  type="button"
                  onClick={() => toggleNode(node.id)}
                  className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 p-3 transition-all hover:shadow-sm bg-slate-50 dark:bg-slate-900/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {node.year}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {node.title}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {node.summary}
                  </p>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-2 ml-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside pb-1">
                        {node.details.map((d) => (
                          <li key={d} className="leading-relaxed">{d}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Introduction;
