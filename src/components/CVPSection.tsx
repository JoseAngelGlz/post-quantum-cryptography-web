import { Crosshair, ExternalLink, Info } from 'lucide-react';
import InlineExercises, { type Exercise } from './InlineExercises';

const cvpExercises: Exercise[] = [
  {
    type: 'multiple-choice',
    question:
      'En un retículo con base {(2, 0), (0, 2)}, ¿cuál es el punto del retículo más cercano al punto objetivo (3, 1)?',
    options: ['(2, 0)', '(4, 2)', '(2, 2)', '(4, 0)'],
    correctIndex: 2,
    explanation:
      'La distancia de (3,1) a (2,2) es √2 ≈ 1.41, menor que a (2,0) con √2, (4,0) con √2, y (4,2) con √2. En este caso hay empate, pero (2,2) es un punto válido del retículo (1·(2,0) + 1·(0,2)).',
  },
  {
    type: 'multiple-choice',
    question: '¿Cómo se relaciona CVP con el problema LWE?',
    options: [
      'No tienen relación',
      'Resolver LWE equivale a encontrar el punto del retículo más cercano al vector ruidoso b',
      'CVP es más fácil que LWE',
      'LWE no usa retículos',
    ],
    correctIndex: 1,
    explanation:
      'Dado b = A·s + e, encontrar s equivale a encontrar el punto A·s del retículo más cercano a b, es decir, resolver CVP.',
  },
  {
    type: 'text',
    question: '¿Qué operación realiza el receptor en ML-KEM para eliminar el ruido y recuperar el mensaje?',
    acceptedAnswers: ['redondeo', 'thresholding', 'redondear', 'rounding'],
    explanation:
      'El receptor aplica un redondeo (thresholding): si el valor está cerca de 0, decodifica 0; si está cerca de q/2, decodifica 1.',
  },
];
const CVPSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          CVP — Problema del vector más cercano
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          El <strong>Closest Vector Problem</strong> (CVP) consiste en, dado un retículo y un
          punto objetivo que generalmente no pertenece al retículo, encontrar el punto del
          retículo más cercano. Es uno de los problemas geométricos más difíciles y tiene una
          conexión directa con la decodificación del ruido en LWE.
        </p>
      </header>

      {/* Definición formal */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Crosshair className="text-purple-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Definición formal
          </h3>
        </div>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
          <li><strong>Entrada:</strong> una base <em>B</em> de un retículo L y un punto objetivo <em>t ∈ ℝⁿ</em>.</li>
          <li><strong>Objetivo:</strong> encontrar el vector <em>v ∈ L</em> que minimice la distancia ‖t − v‖.</li>
          <li><strong>Variante aproximada (γ-CVP):</strong> encontrar un vector del retículo cuya distancia al objetivo sea a lo sumo γ veces la distancia óptima.</li>
        </ul>
      </section>

      {/* Relación con SVP */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Relación con SVP
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          CVP es al menos tan difícil como SVP: existe una reducción que muestra que si
          pudiéramos resolver CVP eficientemente, también podríamos resolver SVP. De hecho,
          CVP se considera estrictamente más difícil en muchos contextos teóricos.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Intuitivamente, en SVP buscamos el punto más cercano <em>al origen</em> (un caso
          especial), mientras que en CVP el punto objetivo puede estar en cualquier posición.
          Esto hace que las técnicas de búsqueda sean más complejas.
        </p>
      </section>

      {/* Conexión con LWE */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Conexión con LWE y la decodificación del ruido
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Resolver una instancia LWE puede interpretarse como un caso de CVP: dado el vector
          ruidoso <strong>b = A·s + e</strong>, encontrar el punto del retículo generado por las
          columnas de A que está más cerca de b equivale a «eliminar el ruido» y recuperar
          el secreto s.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          En el desencapsulado de ML-KEM, el receptor realiza exactamente una operación de este tipo:
          usa su clave privada para acercarse al punto correcto del retículo y después aplica un
          redondeo para eliminar el ruido residual. Si el ruido es suficientemente pequeño,
          el redondeo acierta y el mensaje se recupera correctamente.
        </p>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 text-xs">
            <div className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-2 text-center text-emerald-700 dark:text-emerald-300 font-semibold">
              Punto del retículo (señal)
            </div>
            <div className="flex-[0.5] bg-amber-100 dark:bg-amber-900/30 rounded-lg p-2 text-center text-amber-700 dark:text-amber-300 font-semibold">
              + ruido
            </div>
            <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 text-center text-blue-700 dark:text-blue-300 font-semibold">
              = punto observado (b)
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
            CVP = encontrar el punto del retículo más cercano a b
          </p>
        </div>
      </section>

      {/* Complejidad */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Complejidad computacional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">CVP exacto</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Es NP-difícil (van Emde Boas, 1981). Los mejores algoritmos tienen coste
              exponencial en la dimensión del retículo.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Algoritmo de Babai</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Una heurística clásica que redondea las coordenadas en una base reducida. Funciona
              cuando el punto está cerca del retículo, pero falla en general para bases malas.
            </p>
          </div>
        </div>
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
            Mueve el punto objetivo (fuera del retículo) y observa cuál es el punto del retículo
            más cercano. En alta dimensión, esta búsqueda se vuelve intratable.
          </p>
        </div>

        <iframe
          title="Applet CVP en retículo 2D"
          src="https://www.geogebra.org/material/iframe/id/js4x7wfj/width/1000/height/600/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/true/ctl/false"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
          style={{ height: '560px' }}
          loading="lazy"
          allowFullScreen
        />
      </section>

      <InlineExercises exercises={cvpExercises} />
    </div>
  );
};

export default CVPSection;
