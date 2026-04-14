import { Target, ExternalLink, Info } from 'lucide-react';
import InlineExercises, { type Exercise } from './InlineExercises';

const svpExercises: Exercise[] = [
  {
    type: 'multiple-choice',
    question:
      'En un retículo con base {(3, 1), (1, 3)}, ¿cuál es el vector más corto (no nulo)?',
    options: ['(3, 1)', '(1, 3)', '(2, -2)', '(4, 4)'],
    correctIndex: 2,
    explanation:
      '(2, -2) = (3,1) − (1,3). Su norma es √8 ≈ 2.83, menor que la de (3,1) con norma √10 ≈ 3.16.',
  },
  {
    type: 'multiple-choice',
    question: '¿Por qué SVP es relevante para la criptografía post-cuántica?',
    options: [
      'Porque es fácil de resolver con un ordenador cuántico',
      'Porque su dificultad en alta dimensión sustenta la seguridad de esquemas como ML-KEM',
      'Porque solo se puede resolver con reducción de base LLL',
      'Porque no tiene relación con LWE',
    ],
    correctIndex: 1,
    explanation:
      'LWE se reduce a variantes aproximadas de SVP. Si SVP fuera fácil, LWE también lo sería y la seguridad de ML-KEM se rompería.',
  },
  {
    type: 'text',
    question: '¿Cómo se llama la variante de SVP donde basta encontrar un vector cuya norma sea a lo sumo γ veces la del óptimo?',
    acceptedAnswers: ['γ-SVP', 'gamma-SVP', 'SVP aproximado', 'approximate SVP', 'γ-svp', 'gamma-svp'],
    explanation: 'Se denomina γ-SVP (SVP aproximado). Es la variante en la que se basan las reducciones de seguridad criptográfica.',
  },
];
const SVPSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          SVP — Problema del vector más corto
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          El <strong>Shortest Vector Problem</strong> (SVP) consiste en, dado un retículo, encontrar
          el vector no nulo de menor norma euclídea. Es uno de los problemas fundamentales de la
          geometría de retículos y una pieza central en la seguridad de la criptografía post-cuántica.
        </p>
      </header>

      {/* Definición formal */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Definición formal
          </h3>
        </div>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
          <li><strong>Entrada:</strong> una base <em>B = {'{'} b₁, …, bₙ {'}'}</em> de un retículo L en ℤⁿ.</li>
          <li><strong>Objetivo:</strong> encontrar un vector <em>v ∈ L</em>, con <em>v ≠ 0</em>, que minimice ‖v‖.</li>
          <li><strong>Variante aproximada (γ-SVP):</strong> encontrar un vector cuya norma sea a lo sumo γ veces la del vector más corto óptimo.</li>
        </ul>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          En dimensión baja (2D, 3D) el problema es visualizable e incluso resoluble. Sin embargo,
          a medida que la dimensión crece, la dificultad escala exponencialmente. No se conocen
          algoritmos eficientes —ni clásicos ni cuánticos— para resolver SVP exacto en alta dimensión.
        </p>
      </section>

      {/* Intuición geométrica */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Intuición geométrica
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Imagina una malla regular de puntos en el plano. El vector más corto es la menor distancia
          entre el origen y cualquier otro punto de la malla. En 2D es fácil encontrarlo visualmente,
          pero en cientos de dimensiones, la «malla» se vuelve enormemente compleja y la búsqueda
          exhaustiva resulta inviable.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          La base del retículo influye enormemente: una base «buena» (casi ortogonal) hace
          el problema más sencillo, mientras que una base «mala» (sesgada) lo dificulta.
          Los algoritmos de reducción de base —como LLL o BKZ— intentan mejorar la base,
          pero incluso ellos solo consiguen aproximaciones en dimensiones altas.
        </p>
      </section>

      {/* Complejidad computacional */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Complejidad computacional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Caso exacto</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              SVP exacto es NP-difícil bajo reducciones aleatorias (Ajtai, 1998). Los mejores
              algoritmos conocidos tienen coste exponencial en la dimensión.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Caso aproximado</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              γ-SVP con factores de aproximación polinómicos sigue siendo difícil. Los esquemas
              criptográficos se basan en que incluso la versión aproximada es intratable.
            </p>
          </div>
        </div>
      </section>

      {/* Relevancia criptográfica */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Relevancia criptográfica
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          La seguridad de los esquemas basados en retículos (ML-KEM, ML-DSA) se reduce
          a la dificultad de resolver variantes aproximadas de SVP. Es decir, romper estos
          esquemas equivaldría a resolver SVP de forma eficiente, algo que se cree imposible
          tanto para ordenadores clásicos como cuánticos.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          La conexión es indirecta: los esquemas se basan en LWE, y Regev demostró que resolver
          LWE implicaría resolver SVP aproximado en el peor caso. Esta cadena de reducciones
          proporciona garantías teóricas sólidas.
        </p>
      </section>

      {/* Applet */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Visualización interactiva
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
            Utiliza el applet para mover los vectores base y observar cómo cambia el vector
            más corto del retículo. Cuanto más sesgada sea la base, más difícil resulta identificarlo.
          </p>
        </div>

        <iframe
          title="Applet SVP en retículo 2D"
          src="https://www.geogebra.org/material/iframe/id/js4x7wfj/width/1000/height/600/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/true/ctl/false"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
          style={{ height: '560px' }}
          loading="lazy"
          allowFullScreen
        />
      </section>

      <InlineExercises exercises={svpExercises} />
    </div>
  );
};

export default SVPSection;
