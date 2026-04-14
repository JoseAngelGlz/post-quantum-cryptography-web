import { ExternalLink, Info } from 'lucide-react';
import InlineExercises, { type Exercise } from './InlineExercises';

const latticeExercises: Exercise[] = [
  {
    type: 'multiple-choice',
    question:
      'Si la base de un retículo 2D es {(2, 0), (0, 3)}, ¿cuál de los siguientes puntos pertenece al retículo?',
    options: ['(3, 3)', '(4, 6)', '(2, 2)', '(1, 3)'],
    correctIndex: 1,
    explanation:
      '(4, 6) = 2·(2,0) + 2·(0,3). Los coeficientes deben ser enteros y el resultado es una combinación lineal entera de la base.',
  },
  {
    type: 'multiple-choice',
    question: '¿Por qué los problemas sobre retículos en alta dimensión son útiles para la criptografía?',
    options: [
      'Porque son fáciles de resolver con ordenadores cuánticos',
      'Porque se vuelven computacionalmente intratables y resisten ataques cuánticos',
      'Porque solo se pueden resolver con lápiz y papel',
      'Porque requieren bases ortogonales',
    ],
    correctIndex: 1,
    explanation:
      'En alta dimensión, los problemas como SVP y CVP son intratables tanto para algoritmos clásicos como cuánticos, lo que los convierte en una base segura para la criptografía.',
  },
  {
    type: 'text',
    question:
      'Si la base es {(1, 0), (0, 1)}, describe un vector del retículo que NO sea un vector base (escríbelo como (x, y)).',
    acceptedAnswers: ['(1, 1)', '(2, 0)', '(0, 2)', '(2, 1)', '(1, 2)', '(-1, 0)', '(0, -1)', '(-1, -1)', '(2, 2)', '(3, 0)', '(0, 3)'],
    explanation:
      'Cualquier punto con coordenadas enteras pertenece a este retículo. Por ejemplo, (1, 1) = 1·(1,0) + 1·(0,1).',
  },
];

const Lattices: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Retículos
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
          ¿Qué es un retículo y por qué importa?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Conviene fijar la intuición geométrica: un retículo es una malla regular de puntos
          en el espacio que nace de combinar una base con coeficientes enteros. Sobre esta
          estructura se definen problemas computacionales difíciles (SVP, CVP, LWE) que
          constituyen la base de la criptografía post-cuántica.
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

      {/* Definición formal */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Definición formal
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Dado un conjunto de vectores linealmente independientes{' '}
          <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">b₁, b₂, …, bₙ ∈ ℝⁿ</span>,
          el retículo generado por ellos es:
        </p>
        <div className="flex justify-center py-3">
          <span className="font-mono text-lg bg-slate-100 dark:bg-slate-900/60 px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            L(B) = {'{'} z₁b₁ + z₂b₂ + … + zₙbₙ : zᵢ ∈ ℤ {'}'}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Es decir, el conjunto de todas las combinaciones lineales <em>enteras</em> de los vectores base.
          Un mismo retículo puede tener muchas bases distintas, y la calidad de la base (cuán ortogonales
          sean los vectores) influye directamente en la dificultad de los problemas definidos sobre él.
        </p>
      </section>

      {/* Propiedades clave */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Propiedades relevantes para criptografía
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Dureza en alta dimensión</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Los problemas sobre retículos en dos o tres dimensiones son sencillos. En dimensiones
              del orden de cientos o miles, se vuelven computacionalmente intratables tanto para
              algoritmos clásicos como cuánticos.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Reducción de base</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Algoritmos como LLL y BKZ intentan encontrar bases «mejores» (más ortogonales).
              Aunque logran aproximaciones, no resuelven los problemas de forma exacta en alta
              dimensión, lo cual sustenta la seguridad criptográfica.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Determinante y volumen</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              El determinante del retículo (volumen del paralelepípedo fundamental) es un invariante
              que no depende de la base elegida. Influye en la longitud del vector más corto esperado.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Retículos estructurados</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              En la práctica (ML-KEM, ML-DSA), se usan retículos con estructura algebraica adicional
              (módulos de anillos de polinomios) para lograr tamaños de clave y velocidades prácticas.
            </p>
          </div>
        </div>
      </section>

      {/* Applet GeoGebra */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Visualización interactiva de retículos 2D
          </h3>
          <a
            href="https://www.geogebra.org/m/js4x7wfj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Abrir en GeoGebra <ExternalLink size={14} />
          </a>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Mueve los vectores base y observa cómo cambia la malla del retículo.
            Fíjate en cómo varía la densidad de puntos y la distancia al vector más
            corto según la orientación de la base.
          </p>
        </div>

        <iframe
          title="Applet de retículos 2D en GeoGebra"
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

      <InlineExercises exercises={latticeExercises} />
    </div>
  );
};

export default Lattices;
