import { useState } from 'react';
import { ArrowLeft, ChevronRight, ExternalLink, Info } from 'lucide-react';

type LatticeProblemId = 'svp' | 'cvp' | 'lwe' | 'ntru';

interface LatticeProblem {
  id: LatticeProblemId;
  title: string;
  description: string;
}

const problems: LatticeProblem[] = [
  {
    id: 'svp',
    title: 'SVP (Shortest Vector Problem)',
    description:
      'Dado un retículo, encontrar el vector no nulo más corto. Es una base clásica de dureza criptográfica.',
  },
  {
    id: 'cvp',
    title: 'CVP (Closest Vector Problem)',
    description:
      'Dado un punto objetivo, hallar el punto del retículo más cercano. Es uno de los problemas geométricos más difíciles.',
  },
  {
    id: 'lwe',
    title: 'LWE (Learning With Errors)',
    description:
      'Recuperar un secreto oculto cuando las ecuaciones lineales incluyen ruido. Es central en ML-KEM.',
  },
  {
    id: 'ntru',
    title: 'NTRU / Ring-LWE (Anillos de polinomios)',
    description:
      'Versión estructurada para ganar eficiencia mediante polinomios y anillos modulares.',
  },
];

const problemDetail: Record<LatticeProblemId, { title: string; content: string[] }> = {
  svp: {
    title: 'SVP (Shortest Vector Problem)',
    content: [
      'Entrada: una base de un retículo en dimensión n.',
      'Objetivo: encontrar el vector no nulo de menor norma euclídea del retículo.',
      'Relevancia criptográfica: aproximaciones de SVP se relacionan con garantías de seguridad de construcciones basadas en retículos.',
    ],
  },
  cvp: {
    title: 'CVP (Closest Vector Problem)',
    content: [
      'Entrada: un retículo y un punto objetivo que normalmente no pertenece al retículo.',
      'Objetivo: encontrar el punto del retículo más cercano al objetivo.',
      'Relevancia criptográfica: CVP y variantes aproximadas modelan la dificultad geométrica de “corregir ruido” en espacios de alta dimensión.',
    ],
  },
  lwe: {
    title: 'LWE (Learning With Errors)',
    content: [
      'Modelo básico: b = A·s + e (mod q), donde s es secreto y e es ruido pequeño.',
      'Problema: distinguir o recuperar s a partir de muestras ruidosas (A, b).',
      'En ML-KEM se usa Module-LWE para mejorar eficiencia y mantener seguridad con estructuras algebraicas.',
    ],
  },
  ntru: {
    title: 'NTRU / Ring-LWE',
    content: [
      'Trabajan sobre anillos de polinomios, no sobre vectores completamente generales.',
      'Ventaja principal: operaciones más rápidas y tamaños prácticos para implementación real.',
      'Uso en estándares: FALCON se apoya en retículos NTRU y ML-KEM usa estructura módulo sobre anillos.',
    ],
  },
};

const Lattices: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<LatticeProblemId | null>(null);

  if (selectedProblem) {
    const detail = problemDetail[selectedProblem];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => setSelectedProblem(null)}
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={16} /> Volver a Lattices
        </button>

        <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{detail.title}</h2>
          <div className="mt-4 space-y-3">
            {detail.content.map((text) => (
              <p key={text} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {text}
              </p>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Retículos (Lattices)
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Un retículo es un conjunto discreto de puntos en el espacio n-dimensional con una
          estructura periódica. Formalmente, dado un conjunto de vectores base
          {' '}<span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">B = &#123;b₁, …, bₙ&#125;</span>,
          el retículo se define como todas las combinaciones enteras de esos vectores.
        </p>
      </header>

      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          ¿Qué es un retículo (Lattice) y por qué importa?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Antes de entrar en los problemas (SVP, CVP, LWE...), conviene fijar la intuición geométrica:
          un retículo es una malla regular de puntos en el espacio que nace de combinar una base con
          coeficientes enteros.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Base y dimensión</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              La base define la forma de la malla. En alta dimensión aparecen comportamientos difíciles de resolver.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Ruido controlado</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              En criptografía, el ruido convierte problemas lineales simples en problemas difíciles de invertir.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Aplicación práctica</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              ML-KEM y otros esquemas usan esta dureza para encapsular claves de forma eficiente y segura.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Visualización Interactiva de Retículos 2D
          </h3>
          <a
            href="https://www.geogebra.org/m/js4x7wfj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Abrir GeoGebra <ExternalLink size={14} />
          </a>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Mueve el punto objetivo y utiliza los controles del applet para observar cómo cambia
            el vector más cercano (CVP) y el vector más corto del retículo (SVP).
          </p>
        </div>

        <iframe
          title="GeoGebra SVP/CVP Applet"
          src="https://www.geogebra.org/material/iframe/id/js4x7wfj/width/1000/height/600/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/true/ctl/false"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
          style={{ height: '560px' }}
          loading="lazy"
          allowFullScreen
        />

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Fuente del recurso interactivo: GeoGebra Material <span className="font-mono">js4x7wfj</span>.
          Para documentación académica del TFG, cita explícitamente el autor/material original.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Problemas fundamentales sobre retículos (Lattice Problems)
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ahora que ya tienes la intuición de qué es un retículo, estos son los problemas
          computacionales difíciles que hacen posible la criptografía basada en esta estructura.
          Haz clic en cada tarjeta para ver el detalle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <button
              key={problem.id}
              type="button"
              onClick={() => setSelectedProblem(problem.id)}
              className="text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{problem.title}</h4>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{problem.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Lattices;
