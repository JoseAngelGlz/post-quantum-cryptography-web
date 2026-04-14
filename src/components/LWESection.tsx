import { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import InlineExercises, { type Exercise } from './InlineExercises';

const Q_DEMO = 23;

const lweExercises: Exercise[] = [
  {
    type: 'multiple-choice',
    question: 'En la ecuación b = A·s + e (mod q), ¿qué papel cumple el vector e?',
    options: [
      'Es la clave pública',
      'Es el ruido que protege el secreto s',
      'Es el mensaje cifrado',
      'Es la clave privada de Bob',
    ],
    correctIndex: 1,
    explanation:
      'El vector e es un ruido pequeño que impide recuperar s incluso conociendo A y b. Sin él, un atacante resolvería un simple sistema lineal.',
  },
  {
    type: 'multiple-choice',
    question: '¿Qué ocurre si el ruido e es demasiado grande?',
    options: [
      'La seguridad mejora y la comunicación sigue funcionando',
      'Ni el atacante ni el receptor legítimo pueden recuperar el mensaje',
      'Solo el atacante puede recuperar el mensaje',
      'No cambia nada',
    ],
    correctIndex: 1,
    explanation:
      'Si el ruido es excesivo, el redondeo del receptor falla y no puede recuperar el mensaje. El equilibrio entre seguridad y corrección es clave.',
  },
  {
    type: 'text',
    question: 'Si q = 23 y el valor sin ruido es 10, ¿cuál es b cuando e = 3? (calcula 10 + 3 mod 23)',
    acceptedAnswers: ['13'],
    explanation: 'b = (10 + 3) mod 23 = 13. El ruido desplaza el valor original en 3 unidades.',
  },
];

const LWESection: React.FC = () => {
  const [noiseLevel, setNoiseLevel] = useState(1);
  const [demoResult, setDemoResult] = useState<{
    A: number[][];
    s: number[];
    e: number[];
    b: number[];
    bClean: number[];
  } | null>(null);

  const mod = (v: number, q: number): number => ((v % q) + q) % q;

  const generateDemo = () => {
    const A = [
      [Math.floor(Math.random() * Q_DEMO), Math.floor(Math.random() * Q_DEMO)],
      [Math.floor(Math.random() * Q_DEMO), Math.floor(Math.random() * Q_DEMO)],
    ];
    const s = [
      Math.floor(Math.random() * 5) - 2,
      Math.floor(Math.random() * 5) - 2,
    ];
    const e = Array.from({ length: 2 }, () => {
      const range = noiseLevel;
      return Math.floor(Math.random() * (2 * range + 1)) - range;
    });
    const bClean = A.map((row) =>
      mod(row[0] * s[0] + row[1] * s[1], Q_DEMO),
    );
    const b = bClean.map((val, i) => mod(val + e[i], Q_DEMO));
    setDemoResult({ A, s, e, b, bClean });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          LWE — Aprendizaje con errores
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          El problema <strong>Learning With Errors</strong> (LWE) consiste en recuperar un vector
          secreto a partir de ecuaciones lineales <em>perturbadas con ruido</em>. Es la base de
          seguridad de ML-KEM y de numerosos esquemas criptográficos post-cuánticos.
        </p>
      </header>

      {/* Definición formal */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Formulación del problema
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Dado un sistema de ecuaciones lineales módulo un primo <em>q</em>:
        </p>
        <div className="flex justify-center py-3">
          <span className="font-mono text-lg bg-slate-100 dark:bg-slate-900/60 px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            b = A · s + e &nbsp;(mod q)
          </span>
        </div>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
          <li><strong>A</strong> es una matriz pública de dimensión <em>m × n</em> con entradas aleatorias módulo <em>q</em>.</li>
          <li><strong>s</strong> es el vector secreto de dimensión <em>n</em> que se desea ocultar.</li>
          <li><strong>e</strong> es un vector de ruido pequeño (cada componente está acotada, |e<sub>i</sub>| ≪ q).</li>
          <li><strong>b</strong> es el vector observado (público).</li>
        </ul>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          El objetivo del atacante es recuperar <strong>s</strong> conociendo <strong>A</strong> y <strong>b</strong>.
          Sin ruido, bastaría con resolver un sistema lineal (inversión de matriz). El ruido <strong>e</strong> convierte
          esta tarea trivial en un problema computacionalmente intratable incluso para ordenadores cuánticos.
        </p>
      </section>

      {/* El ruido controlado */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            El ruido controlado: clave de la seguridad
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          El ruido en LWE no es aleatorio cualquiera: se muestrea de una <strong>distribución acotada</strong> (típicamente
          una gaussiana discreta o binomial centrada). Esto garantiza dos propiedades fundamentales:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Seguridad</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              El ruido es suficiente para enmascarar el secreto <strong>s</strong>. Incluso con muchas
              muestras (pares A, b), el atacante no puede resolver el sistema porque cada ecuación
              tiene una perturbación desconocida.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Corrección</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              El ruido es lo bastante pequeño como para que el receptor legítimo (que conoce <strong>s</strong>)
              pueda «redondearlo» y recuperar el mensaje original. Si |e| &lt; q/4, el redondeo funciona.
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Este equilibrio entre seguridad y corrección es lo que hace del ruido un <strong>escudo controlado</strong>:
          protege al secreto sin impedir la comunicación legítima.
        </p>
      </section>

      {/* Demo interactiva de ruido */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Demostración: efecto del ruido
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ajusta la amplitud del ruido y observa cómo afecta al vector <strong>b</strong>.
          Con ruido bajo, <strong>b</strong> es casi idéntico al producto <strong>A·s</strong>.
          Con ruido alto, la relación queda completamente oculta.
        </p>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Amplitud del ruido: <strong>{noiseLevel}</strong>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={noiseLevel}
            onChange={(ev) => setNoiseLevel(Number(ev.target.value))}
            className="flex-1"
          />
          <button
            type="button"
            onClick={generateDemo}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Generar ejemplo
          </button>
        </div>

        {demoResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 font-mono text-xs space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-100">Matriz A (pública):</p>
              <p>[{demoResult.A[0].join(', ')}]</p>
              <p>[{demoResult.A[1].join(', ')}]</p>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-2">Secreto s (oculto):</p>
              <p>[{demoResult.s.join(', ')}]</p>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 font-mono text-xs space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-100">A·s (sin ruido):</p>
              <p>[{demoResult.bClean.join(', ')}]</p>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-2">Ruido e:</p>
              <p>[{demoResult.e.join(', ')}]</p>
              <p className="font-bold text-blue-600 dark:text-blue-400 mt-2">b = A·s + e (mod {Q_DEMO}):</p>
              <p className="text-blue-700 dark:text-blue-300">[{demoResult.b.join(', ')}]</p>
            </div>
          </div>
        )}

        {demoResult && noiseLevel === 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-300">
              <strong>Sin ruido:</strong> b = A·s exacto. Un atacante podría resolver el sistema lineal directamente
              e invertir A para obtener s. No hay seguridad.
            </p>
          </div>
        )}

        {demoResult && noiseLevel > 0 && noiseLevel <= 3 && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              <strong>Ruido controlado:</strong> b difiere ligeramente de A·s. El receptor legítimo puede
              redondear el error, pero un atacante no puede resolver el sistema. Este es el punto óptimo.
            </p>
          </div>
        )}

        {demoResult && noiseLevel > 3 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <strong>Ruido excesivo:</strong> la señal original queda totalmente enmascarada. Aunque
              la seguridad es máxima, ni siquiera el receptor legítimo podría recuperar el mensaje.
              En la práctica, se elige un ruido intermedio.
            </p>
          </div>
        )}
      </section>

      {/* Reducción a problemas de retículos */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Conexión con retículos
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Oded Regev demostró en 2005 que resolver LWE de forma eficiente implicaría poder resolver
          problemas sobre retículos en el peor caso (como variantes aproximadas de SVP).
          Esto significa que LWE hereda la dureza computacional de los problemas geométricos
          sobre retículos, incluyendo su resistencia frente a algoritmos cuánticos conocidos.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          En ML-KEM se utiliza una variante estructurada denominada <strong>Module-LWE</strong>,
          que opera sobre módulos de anillos de polinomios. Esta estructura permite tamaños de
          clave y tiempos de cómputo prácticos manteniendo garantías de seguridad demostrables.
        </p>
      </section>

      <InlineExercises exercises={lweExercises} />
    </div>
  );
};

export default LWESection;
