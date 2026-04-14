import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  KeyRound,
  Lock,
  RefreshCw,
  Send,
  ShieldAlert,
  Unlock,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Baby-Kyber  –  q = 23, n = 2
   q=23 guarantees correct decryption with small noise (max ±5 < q/4 ≈ 5.75)
   so the demo always works. Security is shown via "spy mode" instead.
   ═══════════════════════════════════════════════════════════════ */

const Q = 23;
const N = 2;
const HALF_Q = Math.floor(Q / 2); // 11

/* ─── Types ──────────────────────────────────────── */
type Matrix = number[][];
type Vector = number[];

interface KeyPair {
  A: Matrix;
  s: Vector;
  e: Vector;
  t: Vector;
}

interface Cipher {
  u: Vector;
  v: Vector;
  r: Vector;
  e1: Vector;
  e2: Vector;
}

/* ─── Math helpers ───────────────────────────────── */
const mod = (v: number, q: number): number => ((v % q) + q) % q;

const transpose = (m: Matrix): Matrix =>
  m[0].map((_, c) => m.map((r) => r[c]));

const matVecMul = (m: Matrix, v: Vector, q: number): Vector =>
  m.map((row) => mod(row.reduce((s, val, i) => s + val * v[i], 0), q));

const vecAdd = (a: Vector, b: Vector, q: number): Vector =>
  a.map((v, i) => mod(v + b[i], q));

const dot = (a: Vector, b: Vector): number =>
  a.reduce((s, v, i) => s + v * b[i], 0);

const randomInt = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;

const randomMatrix = (size: number, q: number): Matrix =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => randomInt(0, q - 1)),
  );

const randomSmallVec = (size: number, amp: number): Vector =>
  Array.from({ length: size }, () => randomInt(-amp, amp));

const toMod = (v: Vector, q: number): Vector => v.map((x) => mod(x, q));

const threshold = (value: number): number => {
  const dHalf = Math.min(
    Math.abs(value - HALF_Q),
    Q - Math.abs(value - HALF_Q),
  );
  const dZero = Math.min(value, Q - value);
  return dHalf < dZero ? HALF_Q : 0;
};

/* ─── Secret definitions (emojis) ────────────────── */
const SECRETS = [
  { emoji: '🔑', label: 'Llave', bits: [0, 0] as Vector, hue: 45 },
  { emoji: '⭐', label: 'Estrella', bits: [0, HALF_Q] as Vector, hue: 210 },
  { emoji: '❤️', label: 'Corazón', bits: [HALF_Q, 0] as Vector, hue: 0 },
  { emoji: '🎵', label: 'Música', bits: [HALF_Q, HALF_Q] as Vector, hue: 280 },
];

const bitsToSecretIdx = (bits: Vector): number =>
  SECRETS.findIndex((s) => s.bits[0] === bits[0] && s.bits[1] === bits[1]);

/* ═══════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════ */

/** Single heatmap cell with color intensity based on value */
const HeatCell = ({
  value,
  hue,
  delay = 0,
}: {
  value: number;
  hue: number;
  delay?: number;
}) => {
  const lightness = 88 - (mod(value, Q) / (Q - 1)) * 42;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
      className="w-11 h-11 rounded-lg flex items-center justify-center font-mono text-xs font-bold border border-black/10 dark:border-white/10"
      style={{
        backgroundColor: `hsl(${hue}, 65%, ${lightness}%)`,
        color: lightness < 62 ? 'white' : '#1e293b',
      }}
    >
      {value}
    </motion.div>
  );
};

/** Matrix displayed as heatmap grid */
const MatrixHeatmap = ({
  label,
  matrix,
  hue,
}: {
  label: string;
  matrix: Matrix;
  hue: number;
}) => (
  <div className="text-center space-y-1.5">
    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {label}
    </p>
    <div className="inline-grid grid-cols-2 gap-1">
      {matrix.flat().map((v, i) => (
        <HeatCell key={i} value={mod(v, Q)} hue={hue} delay={i * 0.07} />
      ))}
    </div>
  </div>
);

/** Vector displayed as heatmap row */
const VectorHeat = ({
  label,
  vector,
  hue,
  baseDelay = 0,
}: {
  label: string;
  vector: Vector;
  hue: number;
  baseDelay?: number;
}) => (
  <div className="text-center space-y-1.5">
    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {label}
    </p>
    <div className="inline-flex gap-1">
      {vector.map((v, i) => (
        <HeatCell
          key={i}
          value={mod(v, Q)}
          hue={hue}
          delay={baseDelay + i * 0.07}
        />
      ))}
    </div>
  </div>
);

/** Expandable math detail */
const MathDetail = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
      >
        <Eye size={14} />
        {open ? 'Ocultar detalle matemático' : 'Ver detalle matemático'}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Character avatar badge */
const Avatar = ({
  name,
  emoji,
  color,
}: {
  name: string;
  emoji: string;
  color: string;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${color}`}
    >
      {emoji}
    </div>
    <span className="text-sm font-bold">{name}</span>
  </div>
);

/* ═══════════════════════════════════════════════════
   Phase definitions
   ═══════════════════════════════════════════════════ */
type Phase = 'intro' | 'keygen' | 'encaps' | 'decaps' | 'result';

const PHASES: { id: Phase; label: string; icon: typeof KeyRound }[] = [
  { id: 'intro', label: 'Inicio', icon: Eye },
  { id: 'keygen', label: 'Generación', icon: KeyRound },
  { id: 'encaps', label: 'Encapsulado', icon: Lock },
  { id: 'decaps', label: 'Desencapsulado', icon: Unlock },
  { id: 'result', label: 'Resultado', icon: ShieldAlert },
];

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */
const MLKEMSimulator: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [selectedSecret, setSelectedSecret] = useState(0);
  const [cipher, setCipher] = useState<Cipher | null>(null);
  const [message, setMessage] = useState<Vector | null>(null);
  const [decryptedBits, setDecryptedBits] = useState<Vector | null>(null);
  const [showDecrypt, setShowDecrypt] = useState(false);
  const [spyBits, setSpyBits] = useState<Vector | null>(null);
  const [spyKey, setSpyKey] = useState<Vector | null>(null);

  const phaseIdx = PHASES.findIndex((p) => p.id === phase);

  /* ── Handlers ──────────────────────────────────── */

  const handleGenerate = () => {
    const A = randomMatrix(N, Q);
    const s = randomSmallVec(N, 1);
    const e = randomSmallVec(N, 1);
    const t = vecAdd(matVecMul(A, toMod(s, Q), Q), toMod(e, Q), Q);
    setKeyPair({ A, s, e, t });
    setCipher(null);
    setMessage(null);
    setDecryptedBits(null);
    setShowDecrypt(false);
    setSpyBits(null);
  };

  const handleEncapsulate = () => {
    if (!keyPair) return;
    const m = SECRETS[selectedSecret].bits;
    const r = randomSmallVec(N, 1);
    const e1 = randomSmallVec(N, 1);
    const e2 = randomSmallVec(N, 1);

    const AT = transpose(keyPair.A);
    const u = vecAdd(matVecMul(AT, toMod(r, Q), Q), toMod(e1, Q), Q);
    const tDotR = mod(dot(keyPair.t, toMod(r, Q)), Q);
    const vBase = [tDotR, tDotR];
    const v = vecAdd(vecAdd(vBase, toMod(e2, Q), Q), m, Q);

    setCipher({ u, v, r, e1, e2 });
    setMessage(m);
    setDecryptedBits(null);
    setShowDecrypt(false);
    setSpyBits(null);
  };

  const handleDecapsulate = () => {
    if (!keyPair || !cipher) return;
    const sDotU = mod(dot(toMod(keyPair.s, Q), cipher.u), Q);
    const raw = cipher.v.map((vi) => mod(vi - sDotU, Q));
    setDecryptedBits(raw.map((v) => threshold(v)));
    setShowDecrypt(true);
  };

  const handleSpyAttempt = () => {
    if (!cipher || !keyPair) return;
    let sEve: Vector;
    do {
      sEve = randomSmallVec(N, 3);
    } while (sEve[0] === keyPair.s[0] && sEve[1] === keyPair.s[1]);

    const sDotU = mod(dot(toMod(sEve, Q), cipher.u), Q);
    const raw = cipher.v.map((vi) => mod(vi - sDotU, Q));
    setSpyBits(raw.map((v) => threshold(v)));
    setSpyKey(sEve);
  };

  const handleReset = () => {
    setPhase('intro');
    setKeyPair(null);
    setCipher(null);
    setMessage(null);
    setDecryptedBits(null);
    setShowDecrypt(false);
    setSpyBits(null);
    setSpyKey(null);
    setSelectedSecret(0);
  };

  const goNext = () => {
    const next = PHASES[phaseIdx + 1];
    if (next) setPhase(next.id);
  };

  /* derived */
  const decryptedIdx = decryptedBits ? bitsToSecretIdx(decryptedBits) : -1;
  const spyIdx = spyBits ? bitsToSecretIdx(spyBits) : -1;
  const isCorrect = decryptedIdx === selectedSecret;

  /* ═══════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════ */
  return (
    <section className="mx-auto max-w-4xl space-y-6 text-slate-900 dark:text-slate-100">
      {/* ── Progress indicator ────────────────────── */}
      <nav className="flex items-center justify-center gap-0 overflow-x-auto pb-1">
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          const current = i === phaseIdx;
          const done = i < phaseIdx;
          return (
            <div key={p.id} className="flex items-center">
              {i > 0 && (
                <div
                  className={`h-0.5 w-6 sm:w-10 transition-colors ${
                    done ? 'bg-blue-400' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              )}
              <button
                type="button"
                onClick={() => {
                  if (done) setPhase(p.id);
                }}
                disabled={!done && !current}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                  current
                    ? 'bg-blue-500 text-white shadow-md'
                    : done
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* ── Phase content ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* ────────── INTRO ────────── */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <div>
              <h2 className="text-3xl font-bold">
                ML-KEM: Guía Visual Interactiva
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Vas a recorrer paso a paso el protocolo <strong>ML-KEM</strong> (CRYSTALS-Kyber)
                poniéndote en la piel de Alice y Bob. Elige un secreto, cifra, descifra…
                y descubre por qué un espía no puede hacer lo mismo.
              </p>
            </div>

            {/* Characters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 space-y-2">
                <Avatar
                  name="Alice"
                  emoji="👩‍💻"
                  color="bg-blue-200 dark:bg-blue-800"
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Genera las claves y después desencapsula el secreto que Bob le envíe.
                  Tiene la <strong>clave privada</strong>.
                </p>
              </div>
              <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-4 space-y-2">
                <Avatar
                  name="Bob"
                  emoji="👨‍💻"
                  color="bg-violet-200 dark:bg-violet-800"
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Elige un secreto y lo encapsula usando la <strong>clave pública</strong> de Alice.
                  Solo Alice podrá recuperarlo.
                </p>
              </div>
            </div>

            {/* Flow preview */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Alice genera claves
              </span>
              <span>→</span>
              <span className="font-semibold text-violet-600 dark:text-violet-400">
                Bob encapsula
              </span>
              <span>→</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Alice desencapsula
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-4 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p>
                <strong>Parámetros Baby-Kyber:</strong>{' '}
                <span className="font-mono">q = {Q}</span>,{' '}
                <span className="font-mono">n = {N}</span>{' '}
                (versión simplificada para aprender; el real usa dimensiones mucho mayores).
              </p>
              <p>
                En cada paso podrás expandir el <em>detalle matemático</em> para ver los
                cálculos reales que ocurren tras la visualización.
              </p>
            </div>

            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Comenzar →
            </button>
          </motion.div>
        )}

        {/* ────────── KEYGEN ────────── */}
        {phase === 'keygen' && (
          <motion.div
            key="keygen"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <Avatar
              name="Sé Alice – Genera tus claves"
              emoji="👩‍💻"
              color="bg-blue-200 dark:bg-blue-800"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Alice crea una <strong>clave pública</strong> (que compartirá) y una{' '}
              <strong>clave privada</strong> (que guarda). La clave pública se construye
              mezclando una matriz aleatoria con un secreto, de forma que sea imposible
              recuperar el secreto solo viendo el resultado.
            </p>

            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              {keyPair ? '🔄 Regenerar claves' : '🔐 Generar claves'}
            </button>

            {keyPair && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Visual equation with heatmaps */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-xs font-bold text-center text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
                    Clave pública: t = A × s + e (mod {Q})
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <MatrixHeatmap label="A (pública)" matrix={keyPair.A} hue={210} />
                    <span className="text-2xl font-bold text-slate-300">×</span>
                    <VectorHeat label="s (secreto)" vector={keyPair.s} hue={35} />
                    <span className="text-2xl font-bold text-slate-300">+</span>
                    <VectorHeat
                      label="e (error)"
                      vector={keyPair.e}
                      hue={35}
                      baseDelay={0.3}
                    />
                    <span className="text-2xl font-bold text-slate-300">=</span>
                    <VectorHeat
                      label="t (pública)"
                      vector={keyPair.t}
                      hue={210}
                      baseDelay={0.5}
                    />
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: 'hsl(210,65%,70%)' }}
                    />
                    <span className="text-slate-600 dark:text-slate-400">
                      Público – cualquiera puede verlo
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: 'hsl(35,65%,70%)' }}
                    />
                    <span className="text-slate-600 dark:text-slate-400">
                      Privado – solo Alice lo conoce
                    </span>
                  </div>
                </div>

                <MathDetail>
                  <p>
                    A = [{keyPair.A[0].join(', ')}] [{keyPair.A[1].join(', ')}]
                  </p>
                  <p>s = [{keyPair.s.join(', ')}]</p>
                  <p>e = [{keyPair.e.join(', ')}]</p>
                  <p>
                    t = A·s + e mod {Q} = [{keyPair.t.join(', ')}]
                  </p>
                  <p className="text-slate-500 mt-1">
                    Un atacante ve A y t, pero no puede deducir s porque el error e
                    «ensucia» la relación lineal.
                  </p>
                </MathDetail>

                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Continuar al encapsulado →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ────────── ENCAPS ────────── */}
        {phase === 'encaps' && (
          <motion.div
            key="encaps"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <Avatar
              name="Sé Bob – Elige y encapsula un secreto"
              emoji="👨‍💻"
              color="bg-violet-200 dark:bg-violet-800"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Ahora eres Bob. Elige un <strong>secreto</strong> (un emoji) y utiliza la
              clave pública de Alice para cifrarlo. El resultado es un{' '}
              <strong>criptograma (u, v)</strong> que solo Alice podrá abrir.
            </p>

            {/* Secret picker */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Tu secreto:
              </p>
              <div className="flex flex-wrap gap-3">
                {SECRETS.map((s, idx) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setSelectedSecret(idx);
                      setCipher(null);
                      setDecryptedBits(null);
                      setShowDecrypt(false);
                      setSpyBits(null);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 border-2 transition ${
                      selectedSecret === idx
                        ? 'border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/30 shadow-md scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-3xl">{s.emoji}</span>
                    <span className="text-[10px] font-medium">{s.label}</span>
                    <span className="text-[9px] font-mono text-slate-400">
                      [{s.bits.join(', ')}]
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!keyPair}
              onClick={handleEncapsulate}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🔒 Encapsular secreto
            </button>

            {cipher && message && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Sealed package visualization */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-5 text-center space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Criptograma generado
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl"
                      >
                        {SECRETS[selectedSecret].emoji}
                      </motion.div>
                      <span className="text-[10px] text-slate-500">Tu secreto</span>
                    </div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl text-slate-300"
                    >
                      →
                    </motion.span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-2xl text-white shadow-lg">
                        🔒
                      </div>
                      <span className="text-[10px] text-slate-500">Cifrado (u, v)</span>
                    </motion.div>
                  </div>
                </div>

                {/* Ciphertext values */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <VectorHeat label="u (criptograma)" vector={cipher.u} hue={150} />
                  <VectorHeat
                    label="v (criptograma)"
                    vector={cipher.v}
                    hue={150}
                    baseDelay={0.2}
                  />
                </div>

                <MathDetail>
                  <p>r (efímero) = [{cipher.r.join(', ')}]</p>
                  <p>
                    e₁ = [{cipher.e1.join(', ')}], e₂ = [{cipher.e2.join(', ')}]
                  </p>
                  <p>
                    u = Aᵀr + e₁ mod {Q} = [{cipher.u.join(', ')}]
                  </p>
                  <p>
                    v = tᵀr + e₂ + m mod {Q} = [{cipher.v.join(', ')}]
                  </p>
                  <p className="text-slate-500 mt-1">
                    El secreto m = [{message.join(', ')}] queda mezclado con la clave
                    pública y errores adicionales.
                  </p>
                </MathDetail>

                {/* Send animation */}
                <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>👨‍💻 Bob</span>
                    <span>👩‍💻 Alice</span>
                  </div>
                  <div className="relative h-8">
                    <div className="absolute inset-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 text-xl"
                      animate={{ left: ['5%', '85%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      📨
                    </motion.div>
                  </div>
                  <p className="text-center text-[10px] text-slate-500 dark:text-slate-400">
                    Solo se envían (u, v) por el canal público. El secreto nunca viaja en
                    claro.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Enviar a Alice →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ────────── DECAPS ────────── */}
        {phase === 'decaps' && (
          <motion.div
            key="decaps"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <Avatar
              name="Sé Alice – Desencapsula el secreto"
              emoji="👩‍💻"
              color="bg-emerald-200 dark:bg-emerald-800"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Alice ha recibido el criptograma{' '}
              <span className="font-mono">(u, v)</span>. Usando su{' '}
              <strong>clave privada s</strong>, puede eliminar la «capa» que envuelve
              el secreto y recuperar el emoji original.
            </p>

            {/* Mystery box before decryption */}
            {!showDecrypt && (
              <div className="flex flex-col items-center gap-3 py-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-4xl shadow-inner"
                >
                  🔒
                </motion.div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ¿Qué secreto habrá dentro?
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={!keyPair || !cipher || showDecrypt}
              onClick={handleDecapsulate}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🔓 Desencapsular
            </button>

            {/* Reveal animation */}
            {showDecrypt && decryptedBits && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center gap-3 py-4">
                  <motion.div
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 flex items-center justify-center text-5xl shadow-lg border-2 border-emerald-300 dark:border-emerald-700"
                  >
                    {decryptedIdx >= 0 ? SECRETS[decryptedIdx].emoji : '❓'}
                  </motion.div>
                  {isCorrect ? (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg font-bold text-emerald-600 dark:text-emerald-400"
                    >
                      ✅ ¡Alice recuperó «{SECRETS[selectedSecret].label}»
                      correctamente!
                    </motion.p>
                  ) : (
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      ⚠️ Resultado inesperado
                    </p>
                  )}
                </div>

                <MathDetail>
                  <p>
                    m&apos; = v − sᵀu mod {Q} = [{decryptedBits.join(', ')}]
                  </p>
                  <p>
                    Cada valor se «redondea» al más cercano entre 0 y {HALF_Q}:
                  </p>
                  <p>→ Resultado: [{decryptedBits.join(', ')}]</p>
                  <p className="text-slate-500 mt-1">
                    El error acumulado es lo suficientemente pequeño para que el
                    redondeo dé el valor correcto.
                  </p>
                </MathDetail>

                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Ver resultado y modo espía →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ────────── RESULT + SPY MODE ────────── */}
        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-2xl border border-white/30 bg-white/55 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/45"
          >
            <h3 className="text-xl font-bold">Resultado del intercambio</h3>

            {/* Success summary */}
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                    Bob envió
                  </p>
                  <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {SECRETS[selectedSecret].emoji}
                  </div>
                  <p className="text-xs mt-1 font-medium">
                    {SECRETS[selectedSecret].label}
                  </p>
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-3xl"
                >
                  {isCorrect ? '✅' : '❌'}
                </motion.span>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                    Alice recibió
                  </p>
                  <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {decryptedIdx >= 0 ? SECRETS[decryptedIdx].emoji : '❓'}
                  </div>
                  <p className="text-xs mt-1 font-medium">
                    {decryptedIdx >= 0
                      ? SECRETS[decryptedIdx].label
                      : 'Desconocido'}
                  </p>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-4">
                {isCorrect
                  ? 'El secreto se transmitió correctamente a través de un canal público.'
                  : 'Hubo un problema en la transmisión.'}
              </p>
            </div>

            {/* ── SPY MODE ── */}
            <div className="rounded-xl border-2 border-dashed border-red-300 dark:border-red-700 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-red-500" />
                <h4 className="text-lg font-bold text-red-700 dark:text-red-300">
                  ¿Y si alguien intenta espiar?
                </h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Eva interceptó el criptograma{' '}
                <span className="font-mono">(u, v)</span> y la información pública{' '}
                <span className="font-mono">(A, t)</span>. Pero{' '}
                <strong>no conoce la clave privada s</strong> de Alice. Veamos qué
                pasa cuando intenta desencapsular con una clave inventada:
              </p>

              <button
                type="button"
                onClick={handleSpyAttempt}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                🕵️ Eva intenta descifrar
              </button>

              {spyBits && spyKey && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Side-by-side comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Alice's result */}
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center space-y-2">
                      <Avatar
                        name="Alice"
                        emoji="👩‍💻"
                        color="bg-emerald-200 dark:bg-emerald-800"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Con clave privada correcta
                      </p>
                      <div className="text-4xl py-2">
                        {decryptedIdx >= 0
                          ? SECRETS[decryptedIdx].emoji
                          : '❓'}
                      </div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        ✅{' '}
                        {decryptedIdx >= 0
                          ? SECRETS[decryptedIdx].label
                          : '?'}
                      </p>
                      {keyPair && (
                        <p className="text-[10px] font-mono text-slate-400">
                          s = [{keyPair.s.join(', ')}]
                        </p>
                      )}
                    </div>

                    {/* Eve's result */}
                    <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-center space-y-2">
                      <Avatar
                        name="Eva (espía)"
                        emoji="🕵️"
                        color="bg-red-200 dark:bg-red-800"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Con clave inventada
                      </p>
                      <div className="text-4xl py-2">
                        {spyIdx >= 0 ? SECRETS[spyIdx].emoji : '❓'}
                      </div>
                      <p
                        className={`text-xs font-bold ${
                          spyIdx === selectedSecret
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-700 dark:text-red-300'
                        }`}
                      >
                        {spyIdx === selectedSecret
                          ? '⚠️ Coincidencia por azar (1 de 4)'
                          : `❌ ${
                              spyIdx >= 0 ? SECRETS[spyIdx].label : '?'
                            } — ¡incorrecto!`}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        s&apos; = [{spyKey.join(', ')}]
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p>
                      <strong>¿Por qué Eva no puede descifrar?</strong> Sin la
                      clave privada <span className="font-mono">s</span>, la
                      operación{' '}
                      <span className="font-mono">v − s&apos;ᵀu</span> produce un
                      resultado aleatorio. Incluso si acierta por azar (probabilidad
                      del 25%),{' '}
                      <em>no sabe que ha acertado</em>.
                    </p>
                    <p>
                      En ML-KEM real (n = 256), la probabilidad de acertar por
                      fuerza bruta es de 1 entre 2²⁵⁶ — prácticamente imposible.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSpyAttempt}
                    className="rounded-lg border border-red-300 dark:border-red-700 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    🕵️ Otro intento de Eva (clave diferente)
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom navigation ─────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {phaseIdx > 0 && (
          <button
            type="button"
            onClick={() => {
              const prev = PHASES[phaseIdx - 1];
              if (prev) setPhase(prev.id);
            }}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ← Paso anterior
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
        >
          <RefreshCw size={14} />
          Reiniciar
        </button>
      </div>

      {/* ── Feedback form (only after result) ─────── */}
      {phase === 'result' && <FeedbackForm />}
    </section>
  );
};

/* ═══════ Feedback Form ═══════ */
const FEEDBACK_QUESTIONS = [
  {
    id: 'clarity',
    label: '¿Las explicaciones del simulador fueron claras?',
    options: ['Muy claras', 'Bastante claras', 'Algo confusas', 'Muy confusas'],
  },
  {
    id: 'difficulty',
    label: '¿Cómo valoras la dificultad del contenido?',
    options: ['Muy fácil', 'Adecuada', 'Algo difícil', 'Muy difícil'],
  },
  {
    id: 'useful',
    label: '¿Te ha resultado útil la comparación con Eva (espía)?',
    options: ['Muy útil', 'Bastante útil', 'Poco útil', 'Nada útil'],
  },
];

const FeedbackForm: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real app, send data to backend
    console.log('Feedback:', { answers, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center space-y-2">
        <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
          ¡Gracias por tu valoración!
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tu opinión nos ayuda a mejorar este recurso educativo.
        </p>
      </div>
    );
  }

  const allAnswered = FEEDBACK_QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-5">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Cuestionario de satisfacción
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Ahora que has completado el simulador, nos gustaría conocer tu opinión.
      </p>

      {FEEDBACK_QUESTIONS.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {q.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition ${
                    selected
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          ¿Algún comentario o sugerencia adicional?
        </p>
        <textarea
          value={comment}
          onChange={(ev) => setComment(ev.target.value)}
          placeholder="Escribe aquí tu comentario (opcional)…"
          rows={3}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <button
        type="button"
        disabled={!allAnswered}
        onClick={handleSubmit}
        className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
          allAnswered
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Send size={14} />
        Enviar valoración
      </button>
    </div>
  );
};

export default MLKEMSimulator;
