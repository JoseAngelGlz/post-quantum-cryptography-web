import { useState } from 'react';
import { ArrowLeft, ChevronRight, GitBranch, Info, Lock, ShieldCheck, Zap } from 'lucide-react';

type IntroTopic = 'quantum-security' | 'nist-standard' | 'algorithm-families';

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
    id: 'algorithm-families',
    title: 'Familias de algoritmos',
    description:
      'En esta app se presentan como estructuras matemáticas: retículos, códigos, hashes y sistemas multivariantes.',
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
  'algorithm-families': {
    title: 'Familias de algoritmos y estructuras matemáticas',
    body: [
      'Retículos (Lattices): base de ML-KEM y ML-DSA mediante problemas como LWE / Module-LWE.',
      'Códigos correctores de errores (Error-Correcting Codes): familia histórica en criptografía post-cuántica.',
      'Funciones hash (Hash-Based Signatures): base de SLH-DSA y otras firmas resistentes.',
      'Polinomios multivariantes (Multivariate Polynomials): sistemas algebraicos con ecuaciones no lineales sobre campos finitos.',
    ],
  },
};

const Introduction: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<IntroTopic | null>(null);
  const [showTimelineMap, setShowTimelineMap] = useState(false);

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

  if (showTimelineMap) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => setShowTimelineMap(false)}
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={16} /> Volver a Introducción
        </button>

        <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Cronología NIST PQC · Mapa mental</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Vista en árbol del proceso de estandarización de criptografía post-cuántica del NIST.
          </p>

          <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-sm font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
                <GitBranch size={14} /> Proceso NIST PQC
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  year: '2016',
                  title: 'Convocatoria',
                  detail: 'NIST abre la llamada internacional para proponer algoritmos PQC.',
                },
                {
                  year: '2017',
                  title: 'Ronda inicial',
                  detail: '69 propuestas entran en evaluación criptográfica y de implementación.',
                },
                {
                  year: '2019-2020',
                  title: 'Rondas intermedias',
                  detail: 'Se filtran candidatos y se consolidan familias con mejor equilibrio seguridad/rendimiento.',
                },
                {
                  year: '2022',
                  title: 'Selección principal',
                  detail: 'NIST anuncia Kyber, Dilithium, FALCON y SPHINCS+ como algoritmos seleccionados.',
                },
                {
                  year: '2024',
                  title: 'Estandarización',
                  detail: 'Publicación de FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) y FIPS 205 (SLH-DSA).',
                },
                {
                  year: 'Siguiente fase',
                  title: 'Migración práctica',
                  detail: 'Despliegue gradual en protocolos, bibliotecas y sistemas productivos.',
                },
              ].map((node) => (
                <div
                  key={node.year + node.title}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40"
                >
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{node.year}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">{node.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{node.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Introducción a la Criptografía Post-Cuántica
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          La llegada de los ordenadores cuánticos representa una amenaza directa a los sistemas
          criptográficos actuales. Esta aplicación explora las bases matemáticas y los algoritmos
          que formarán la criptografía del futuro.
        </p>
      </header>

      <div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-xl">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Contexto inicial</p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            El algoritmo de Shor, ejecutado en un ordenador cuántico suficientemente potente,
            podría romper RSA, ECDSA y Diffie-Hellman en tiempo polinomial, comprometiendo
            la mayor parte de la infraestructura de clave pública actual.
          </p>
        </div>
      </div>

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

      <button
        type="button"
        onClick={() => setShowTimelineMap(true)}
        className="w-full text-left bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Cronología del Proceso NIST PQC
          </h3>
          <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
            Abrir mapa mental <ChevronRight size={14} />
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Haz click para ver la evolución completa del proceso en formato árbol.
        </p>
      </button>
    </div>
  );
};

export default Introduction;
