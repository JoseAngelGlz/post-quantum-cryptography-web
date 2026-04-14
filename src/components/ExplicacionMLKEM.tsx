import { ArrowRight, Key, Lock, Shield, Unlock } from 'lucide-react';
import InlineExercises, { type Exercise } from './InlineExercises';

const mlkemExercises: Exercise[] = [
  {
    type: 'multiple-choice',
    question: '¿Cuál es la finalidad de un KEM (Key Encapsulation Mechanism)?',
    options: [
      'Cifrar mensajes directamente',
      'Generar y compartir un secreto que luego se usa como clave simétrica',
      'Firmar documentos digitalmente',
      'Almacenar contraseñas de forma segura',
    ],
    correctIndex: 1,
    explanation:
      'Un KEM no cifra mensajes. Genera un secreto compartido aleatorio que después se usa como clave para un cifrado simétrico (AES, ChaCha20…).',
  },
  {
    type: 'multiple-choice',
    question: 'En el paso de desencapsulado, ¿qué ocurre si el ruido acumulado supera el umbral q/4?',
    options: [
      'El receptor recupera el mensaje correctamente',
      'El mensaje se cifra de nuevo automáticamente',
      'El redondeo falla y se decodifica un bit incorrecto',
      'El atacante puede leer el mensaje',
    ],
    correctIndex: 2,
    explanation:
      'Si el ruido acumulado es demasiado grande, el valor cruza la frontera de decisión y el redondeo (thresholding) decodifica un bit erróneo.',
  },
  {
    type: 'text',
    question: '¿Cuántos pasos principales tiene ML-KEM? (escribe el número)',
    acceptedAnswers: ['3', 'tres'],
    explanation: 'ML-KEM tiene 3 pasos: Generación de claves (KeyGen), Encapsulado (Encaps) y Desencapsulado (Decaps).',
  },
];
const ExplicacionMLKEM: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          ¿Qué es ML-KEM (CRYSTALS-Kyber)?
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          ML-KEM es el estándar del NIST (FIPS 203) para el <strong>encapsulamiento de claves</strong>{' '}
          post-cuántico. Basado en el problema Module-LWE, permite a dos partes establecer un
          secreto compartido de forma segura incluso frente a un atacante con ordenador cuántico.
        </p>
      </header>

      {/* ¿Qué es un KEM? */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            ¿Qué es un KEM (Key Encapsulation Mechanism)?
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Un KEM no cifra un mensaje arbitrario. En su lugar, genera un <em>secreto compartido</em>{' '}
          aleatorio y lo «encapsula» de forma que solo el destinatario pueda recuperarlo. Piensa en
          una caja fuerte especial: cualquiera puede meter un secreto aleatorio usando la clave pública,
          pero solo quien tiene la clave privada puede abrirla.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Ese secreto compartido se usa después como clave simétrica (AES, ChaCha20…) para cifrar
          la comunicación real. Es el mismo principio que usa TLS hoy con ECDH, pero resistente a
          ataques cuánticos.
        </p>

        {/* KEM flow diagram */}
        <div className="mt-4 flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center gap-1 text-center flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Key size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Alice</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Genera claves</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">pk, sk</p>
          </div>

          <ArrowRight size={20} className="text-slate-400 shrink-0 rotate-90 md:rotate-0" />

          <div className="flex flex-col items-center gap-1 text-center flex-1">
            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <Lock size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Bob</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Encapsula con pk</p>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-mono">ct, K</p>
          </div>

          <ArrowRight size={20} className="text-slate-400 shrink-0 rotate-90 md:rotate-0" />

          <div className="flex flex-col items-center gap-1 text-center flex-1">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Unlock size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Alice</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Desencapsula con sk</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">K</p>
          </div>
        </div>
      </section>

      {/* De Kyber a ML-KEM */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          De CRYSTALS-Kyber a ML-KEM
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          CRYSTALS-Kyber fue el algoritmo propuesto originalmente al proceso del NIST. Tras años de
          análisis y revisiones, se publicó como <strong>ML-KEM</strong> (Module-Lattice Key Encapsulation
          Mechanism) en el estándar <strong>FIPS 203</strong>.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          El prefijo «Module-Lattice» indica que opera sobre <em>módulos</em> de anillos de polinomios,
          una forma estructurada de retículo que equilibra seguridad y eficiencia en tamaños de
          clave y tiempos de cómputo.
        </p>
      </section>

      {/* El papel del ruido */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="text-amber-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            El papel del ruido (Learning With Errors)
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          La seguridad de ML-KEM descansa sobre el problema <strong>LWE</strong>: dada la ecuación
        </p>
        <div className="flex justify-center py-3">
          <span className="font-mono text-lg bg-slate-100 dark:bg-slate-900/60 px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            t = A · s + e &nbsp;(mod q)
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          conociendo <strong>A</strong> y <strong>t</strong>, pero <em>no</em> el ruido pequeño <strong>e</strong>,
          resulta computacionalmente intratable recuperar el secreto <strong>s</strong>. Sin el ruido,
          bastaría con resolver un sistema de ecuaciones lineales.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          El ruido es, por tanto, un <strong>escudo</strong>: protege el secreto. Pero durante el
          desencapsulado, ese mismo ruido se acumula. Si se mantiene por debajo de un umbral, el
          receptor puede «redondearlo» y recuperar el mensaje original. Si crece demasiado, el
          redondeo falla.
        </p>
      </section>

      {/* Los tres pasos */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-5">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Los tres pasos de ML-KEM
        </h3>

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Generación (KeyGen)</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Alice elige una matriz pública <strong>A</strong>, un secreto <strong>s</strong> y un
                ruido pequeño <strong>e</strong>. Calcula <span className="font-mono">t = A·s + e</span>.
                Publica <span className="font-mono">(A, t)</span> y guarda <span className="font-mono">s</span>.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400">2</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Encapsulado (Encaps)</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Bob toma la clave pública y codifica un secreto. Añade <em>más ruido</em>{' '}
                intencionado para mantener la seguridad del criptograma <span className="font-mono">(u, v)</span>.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">3</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Desencapsulado (Decaps)</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Alice usa su clave privada <strong>s</strong> para calcular{' '}
                <span className="font-mono">v − sᵀu</span>, obteniendo el secreto más ruido acumulado.
                Aplica un <strong>redondeo</strong> (thresholding): si el valor está más cerca de 0,
                decodifica 0; si está más cerca de <span className="font-mono">q/2</span>, decodifica 1.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Thresholding preview */}
      <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          El momento clave: el redondeo (Thresholding)
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Imagina una recta numérica de 0 a <span className="font-mono">q−1</span>. Los valores
          cercanos a 0 representan el bit «0» y los cercanos a <span className="font-mono">q/2</span>{' '}
          representan el bit «1». Si el ruido acumulado es pequeño, el valor cae dentro de la zona
          correcta y se decodifica bien. Si el ruido es excesivo, el valor cruza la frontera de
          decisión y se decodifica un bit incorrecto.
        </p>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 text-xs">
            <div className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-2 text-center text-emerald-700 dark:text-emerald-300 font-semibold">
              Zona → 0
            </div>
            <div className="flex-[2] bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 text-center text-blue-700 dark:text-blue-300 font-semibold">
              Zona → q/2
            </div>
            <div className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-2 text-center text-emerald-700 dark:text-emerald-300 font-semibold">
              Zona → 0
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
            Esquema simplificado de las zonas de redondeo para q = 17
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          En el <strong>simulador Baby-Kyber</strong> de la siguiente sección podrás ajustar el nivel
          de ruido y visualizar exactamente cómo los valores caen (o no) en la zona correcta.
        </p>
      </section>

      <InlineExercises exercises={mlkemExercises} />
    </div>
  );
};

export default ExplicacionMLKEM;
