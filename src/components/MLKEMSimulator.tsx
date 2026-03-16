import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, KeyRound, Lock, RefreshCw, ShieldAlert, Unlock, Zap } from 'lucide-react';

const Q = 17;
const N = 2;
const HALF_Q = Math.floor(Q / 2);
const NOISE_FAIL_THRESHOLD = 6;

type Matrix = number[][];
type Vector = number[];
type StepIndex = 0 | 1 | 2;
type DataTone = 'public' | 'private' | 'neutral';

interface KeyPair {
  A: Matrix;
  s: Vector;
  e: Vector;
  t: Vector;
}

interface Ciphertext {
  u: Vector;
  v: Vector;
  r: Vector;
  e1: Vector;
  e2: Vector;
}

interface DecapsulationResult {
  beforeThreshold: Vector;
  afterThreshold: Vector;
  failed: boolean;
}

interface StepGuide {
  title: string;
  story: string;
  explain: string;
}

const mod = (value: number, q: number): number => ((value % q) + q) % q;

const transpose = (matrix: Matrix): Matrix => matrix[0].map((_, col) => matrix.map((row) => row[col]));

const matVecMul = (matrix: Matrix, vector: Vector, q: number): Vector =>
  matrix.map((row) => mod(row.reduce((acc, matrixValue, i) => acc + matrixValue * vector[i], 0), q));

const vecAdd = (a: Vector, b: Vector, q: number): Vector =>
  a.map((value, i) => mod(value + b[i], q));

const vecSub = (a: Vector, b: Vector, q: number): Vector =>
  a.map((value, i) => mod(value - b[i], q));

const dot = (a: Vector, b: Vector): number => a.reduce((acc, value, i) => acc + value * b[i], 0);

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomMatrix = (size: number, q: number): Matrix =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => randomInt(0, q - 1)));

const randomSignedVector = (size: number, amplitude: number): Vector =>
  Array.from({ length: size }, () => randomInt(-amplitude, amplitude));

const randomMessage = (size: number): Vector =>
  Array.from({ length: size }, () => (Math.random() > 0.5 ? HALF_Q : 0));

const toModVector = (vector: Vector, q: number): Vector => vector.map((value) => mod(value, q));

const formatVector = (vector: Vector): string => `[${vector.join(', ')}]`;

const formatMatrix = (matrix: Matrix): string => matrix.map((row) => `[${row.join(', ')}]`).join(' · ');

const thresholdValue = (value: number): number => {
  const distToHalf = Math.min(Math.abs(value - HALF_Q), Q - Math.abs(value - HALF_Q));
  const distToZero = Math.min(value, Q - value);
  return distToHalf < distToZero ? HALF_Q : 0;
};

const decapsulate = (
  u: Vector,
  v: Vector,
  s: Vector,
  noiseLevel: number,
  noiseThreshold: number
): DecapsulationResult => {
  const sDotU = mod(dot(toModVector(s, Q), u), Q);
  const beforeThreshold = vecSub(v, [sDotU, sDotU], Q);
  let afterThreshold = beforeThreshold.map((value) => thresholdValue(value));
  const failed = noiseLevel > noiseThreshold;

  if (failed) {
    afterThreshold = [...afterThreshold];
    afterThreshold[0] = afterThreshold[0] === 0 ? HALF_Q : 0;
  }

  return { beforeThreshold, afterThreshold, failed };
};

interface DataBlockProps {
  name: string;
  value: string;
  tone: DataTone;
}

const DataBlock = ({ name, value, tone }: DataBlockProps) => {
  const toneClass =
    tone === 'public'
      ? 'border-blue-300/70 bg-blue-500/10 text-blue-900 dark:text-blue-100'
      : tone === 'private'
      ? 'border-orange-300/70 bg-orange-500/10 text-orange-900 dark:text-orange-100'
      : 'border-slate-300/70 bg-slate-500/10 text-slate-900 dark:text-slate-100';

  return (
    <div className={`rounded-xl border px-4 py-3 backdrop-blur-md ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide opacity-75">{name}</p>
      <p className="mt-2 font-mono text-sm break-all">{value}</p>
    </div>
  );
};

const guideContent: StepGuide[] = [
  {
    title: '1. Generación',
    story:
      'Alice crea dos cosas: una parte pública que puede compartir y una parte secreta que nunca sale de su equipo.',
    explain:
      'La parte pública se construye mezclando la matriz A con la clave secreta s y un pequeño ruido e. Ese ruido protege el secreto.',
  },
  {
    title: '2. Encapsulado',
    story:
      'Bob usa la clave pública de Alice para encapsular un secreto y construir el criptograma (u, v).',
    explain:
      'El ruido vuelve a aparecer durante el encapsulado. Si es razonable, Alice podrá corregirlo al final.',
  },
  {
    title: '3. Desencapsulado',
    story:
      'Alice usa su clave secreta para recuperar una versión ruidosa del mensaje y luego aplica un redondeo.',
    explain:
      'Ese redondeo (thresholding) decide si cada valor está más cerca de 0 o de q/2. Con ruido alto, el resultado puede caer del lado incorrecto.',
  },
];

const MLKEMSimulator = () => {
  const [activeStep, setActiveStep] = useState<StepIndex>(0);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [ciphertext, setCiphertext] = useState<Ciphertext | null>(null);
  const [message, setMessage] = useState<Vector | null>(null);
  const [noiseLevel, setNoiseLevel] = useState<number>(3);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentToAlice, setSentToAlice] = useState<boolean>(false);
  const [result, setResult] = useState<DecapsulationResult | null>(null);
  const [showDetails, setShowDetails] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
  });
  const [showHelp, setShowHelp] = useState<boolean>(true);

  const noisePercent = useMemo(() => Math.round((noiseLevel / 10) * 100), [noiseLevel]);
  const activeGuide = guideContent[activeStep];

  const handleGenerateKeys = () => {
    const A = randomMatrix(N, Q);
    const s = randomSignedVector(N, 2);
    const e = randomSignedVector(N, 2);
    const t = vecAdd(matVecMul(A, toModVector(s, Q), Q), toModVector(e, Q), Q);

    setKeyPair({ A, s, e, t });
    setCiphertext(null);
    setMessage(null);
    setResult(null);
    setSentToAlice(false);
  };

  const handleCreateCiphertext = () => {
    if (!keyPair) return;

    const r = randomSignedVector(N, Math.max(1, Math.floor(noiseLevel / 2)));
    const e1 = randomSignedVector(N, noiseLevel);
    const e2 = randomSignedVector(N, noiseLevel);
    const m = randomMessage(N);

    const AT = transpose(keyPair.A);
    const u = vecAdd(matVecMul(AT, toModVector(r, Q), Q), toModVector(e1, Q), Q);

    const tDotR = mod(dot(keyPair.t, toModVector(r, Q)), Q);
    const vBase = [tDotR, tDotR];
    const v = vecAdd(vecAdd(vBase, toModVector(e2, Q), Q), m, Q);

    setCiphertext({ u, v, r, e1, e2 });
    setMessage(m);
    setResult(null);
    setSentToAlice(false);
  };

  const handleSendCiphertext = () => {
    if (!ciphertext || isSending) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentToAlice(true);
      setActiveStep(2);
    }, 1300);
  };

  const handleDecapsulate = () => {
    if (!keyPair || !ciphertext) return;
    setResult(decapsulate(ciphertext.u, ciphertext.v, keyPair.s, noiseLevel, NOISE_FAIL_THRESHOLD));
  };

  const handleReset = () => {
    setActiveStep(0);
    setKeyPair(null);
    setCiphertext(null);
    setMessage(null);
    setNoiseLevel(3);
    setResult(null);
    setIsSending(false);
    setSentToAlice(false);
    setShowDetails({ 0: false, 1: false, 2: false });
    setShowHelp(true);
  };

  const decryptionSuccess =
    result !== null && message !== null && result.afterThreshold.every((value, i) => value === message[i]);

  const stepMeta = [
    { label: '1. Generación', icon: KeyRound },
    { label: '2. Encapsulado', icon: Lock },
    { label: '3. Desencapsulado', icon: Unlock },
  ];

  const toggleDetail = (step: StepIndex) => {
    setShowDetails((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 text-slate-900 dark:text-slate-100">
      <div className="rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45">
        <h2 className="text-3xl font-bold">ML-KEM (CRYSTALS-Kyber) y simulador</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Antes del modo interactivo: ML-KEM es la versión estandarizada por NIST (FIPS 203) de
          CRYSTALS-Kyber, basada en el problema Module-LWE.
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Modo guiado: menos fórmulas al principio, más historia e interacción para entender el flujo.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-300/70 bg-slate-500/10 p-4">
            <p className="text-sm font-semibold">¿Qué cambia al aumentar el ruido?</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
              <li>La clave pública y la clave secreta no cambian si no vuelves a generarlas.</li>
              <li>Lo que sí cambia es el criptograma (u, v): se vuelve más inestable.</li>
              <li>Sube la probabilidad de error al desencapsular por redondeo incorrecto.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-300/70 bg-slate-500/10 p-4">
            <p className="text-sm font-semibold">Relación teoría ↔ simulador</p>
            <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
              Primero se genera material de clave, luego Bob encapsula, y finalmente Alice desencapsula.
              El control de ruido te deja ver cuándo la corrección deja de funcionar.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {stepMeta.map((step, index) => {
            const Icon = step.icon;
            const selected = activeStep === index;
            const completed = activeStep > index || (index === 2 && result !== null);
            return (
              <button
                key={step.label}
                type="button"
                onClick={() => setActiveStep(index as StepIndex)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                  selected
                    ? 'border-blue-400 bg-blue-500/15'
                    : completed
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-300/70 bg-white/50 dark:border-slate-700 dark:bg-slate-900/35'
                }`}
              >
                <Icon size={16} />
                {step.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-cyan-300/60 bg-cyan-500/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">Guía del paso actual</p>
            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              className="rounded-lg border border-cyan-400/70 px-3 py-1 text-xs font-medium hover:bg-cyan-500/10"
            >
              {showHelp ? 'Ocultar ayuda' : 'Mostrar ayuda'}
            </button>
          </div>
          {showHelp && (
            <div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <p>
                <span className="font-semibold">{activeGuide.title}:</span> {activeGuide.story}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{activeGuide.explain}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">Ruido e</p>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              Ajusta interferencia para ver cuándo el descifrado falla.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
            <Zap size={16} />
            Nivel {noiseLevel}/10
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={noiseLevel}
          onChange={(event) => setNoiseLevel(Number(event.target.value))}
          className="mt-3 w-full accent-red-500"
        />
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-300/60 dark:bg-slate-700/70">
          <motion.div
            className="h-full rounded-full bg-red-500"
            animate={{ width: `${noisePercent}%` }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          Umbral de corrección: {NOISE_FAIL_THRESHOLD}/10
        </p>
      </div>

      <AnimatePresence mode="wait">
        {activeStep === 0 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <h3 className="text-xl font-semibold">Paso 1 · Generación</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Alice genera su material criptográfico. Datos públicos en azul, privados en naranja.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleDetail(0)}
                className="rounded-lg border border-blue-300/70 px-3 py-1 text-xs font-medium hover:bg-blue-500/10"
              >
                {showDetails[0] ? 'Ocultar detalle técnico' : '¿Qué está pasando aquí?'}
              </button>
            </div>

            {showDetails[0] && (
              <div className="rounded-xl border border-slate-300/70 bg-slate-500/10 p-3 text-xs text-slate-700 dark:text-slate-200">
                Cálculo técnico: t = A·s + e (mod {Q}). El ruido e dificulta deducir s a partir de A y t.
              </div>
            )}

            {keyPair && (
              <div className="grid gap-3 md:grid-cols-2">
                <DataBlock name="Matriz pública A" value={formatMatrix(keyPair.A)} tone="public" />
                <DataBlock name="Clave pública t = A·s + e" value={formatVector(keyPair.t)} tone="public" />
                <DataBlock name="Clave secreta s" value={formatVector(keyPair.s)} tone="private" />
                <DataBlock name="Ruido interno e" value={formatVector(keyPair.e)} tone="private" />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGenerateKeys}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Generar claves
              </button>
              <button
                type="button"
                disabled={!keyPair}
                onClick={() => setActiveStep(1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Continuar al encapsulado
              </button>
            </div>
          </motion.div>
        )}

        {activeStep === 1 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <h3 className="text-xl font-semibold">Paso 2 · Encapsulado</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Bob usa la clave pública de Alice para encapsular y construir el criptograma (u, v).
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleDetail(1)}
                className="rounded-lg border border-violet-300/70 px-3 py-1 text-xs font-medium hover:bg-violet-500/10"
              >
                {showDetails[1] ? 'Ocultar detalle técnico' : '¿Cómo se forma (u, v)?'}
              </button>
            </div>

            {showDetails[1] && (
              <div className="rounded-xl border border-slate-300/70 bg-slate-500/10 p-3 text-xs text-slate-700 dark:text-slate-200">
                Cálculo técnico: u = Aᵀr + e₁ y v = tᵀr + e₂ + m (mod {Q}).
              </div>
            )}

            {ciphertext && message && (
              <div className="grid gap-3 md:grid-cols-2">
                <DataBlock name="Mensaje m" value={formatVector(message)} tone="neutral" />
                <DataBlock name="Vector efímero r" value={formatVector(ciphertext.r)} tone="private" />
                <DataBlock name="Criptograma u" value={formatVector(ciphertext.u)} tone="public" />
                <DataBlock name="Criptograma v" value={formatVector(ciphertext.v)} tone="public" />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!keyPair}
                onClick={handleCreateCiphertext}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Crear criptograma
              </button>
              <button
                type="button"
                disabled={!ciphertext || isSending}
                onClick={handleSendCiphertext}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSending ? 'Enviando...' : 'Enviar (u, v) a Alice'}
              </button>
            </div>

            {(ciphertext || isSending || sentToAlice) && (
              <div className="rounded-xl border border-cyan-300/70 bg-cyan-500/10 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Bob</span>
                  <span>Alice</span>
                </div>
                <div className="relative mt-3 h-8 rounded-full bg-slate-200/70 dark:bg-slate-800/70">
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 text-cyan-600"
                    animate={
                      isSending
                        ? { left: ['4%', '82%'], opacity: [1, 1] }
                        : sentToAlice
                        ? { left: '82%', opacity: 1 }
                        : { left: '4%', opacity: 0.8 }
                    }
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                  >
                    <ArrowRight />
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeStep === 2 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <h3 className="text-xl font-semibold">Paso 3 · Desencapsulado</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Alice calcula m&apos; antes del thresholding y después redondea a 0 o {HALF_Q}.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleDetail(2)}
                className="rounded-lg border border-emerald-300/70 px-3 py-1 text-xs font-medium hover:bg-emerald-500/10"
              >
                {showDetails[2] ? 'Ocultar detalle técnico' : 'Ver cálculo de decapsulado'}
              </button>
            </div>

            {showDetails[2] && (
              <div className="rounded-xl border border-slate-300/70 bg-slate-500/10 p-3 text-xs text-slate-700 dark:text-slate-200">
                Se calcula m&apos; = v - sᵀu (mod {Q}) y luego se aplica thresholding para mapear cada valor a 0 o {HALF_Q}.
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <DataBlock
                name="Fórmula"
                value={`m' = v - sᵀu (mod ${Q}) · threshold → {0, ${HALF_Q}}`}
                tone="neutral"
              />
              <DataBlock
                name="Estado del canal"
                value={noiseLevel > NOISE_FAIL_THRESHOLD ? 'Interferencia crítica' : 'Interferencia tolerable'}
                tone={noiseLevel > NOISE_FAIL_THRESHOLD ? 'private' : 'public'}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!keyPair || !ciphertext}
                onClick={handleDecapsulate}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Ejecutar decapsulate(u, v, s)
              </button>
            </div>

            {result && (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <DataBlock
                    name="Antes de thresholding"
                    value={formatVector(result.beforeThreshold)}
                    tone="neutral"
                  />
                  <DataBlock
                    name="Después de thresholding"
                    value={formatVector(result.afterThreshold)}
                    tone="public"
                  />
                  <DataBlock name="Mensaje original m" value={message ? formatVector(message) : 'N/A'} tone="neutral" />
                </div>

                {result.failed ? (
                  <div className="flex items-center gap-2 rounded-xl border border-red-400/80 bg-red-500/15 p-4 text-sm text-red-700 dark:text-red-200">
                    <ShieldAlert size={16} />
                    ¡El ruido corrompió el mensaje! El descifrado falló.
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
                      decryptionSuccess
                        ? 'border-emerald-400/80 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200'
                        : 'border-amber-400/80 bg-amber-500/15 text-amber-700 dark:text-amber-200'
                    }`}
                  >
                    {decryptionSuccess ? <Unlock size={16} /> : <Lock size={16} />}
                    {decryptionSuccess
                      ? 'Descifrado correcto: m\' coincide con m.'
                      : 'Resultado inestable: revisa el nivel de ruido y vuelve a intentarlo.'}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveStep((current) => (current > 0 ? ((current - 1) as StepIndex) : 0))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Paso anterior
        </button>
        <button
          type="button"
          onClick={() => setActiveStep((current) => (current < 2 ? ((current + 1) as StepIndex) : 2))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Paso siguiente
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
        >
          <RefreshCw size={14} />
          Reiniciar simulador
        </button>
      </div>
    </section>
  );
};

export default MLKEMSimulator;