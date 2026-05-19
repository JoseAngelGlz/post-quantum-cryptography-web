import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useT } from '../i18n';
import type { TranslationKey } from '../i18n/translations';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Eye,
  KeyRound,
  Lightbulb,
  Lock,
  Mail,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Unlock,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Baby-Kyber  –  q = 23, n = 2 (didactic parameters)
   Real ML-KEM uses n = 256, k ∈ {2,3,4}, q = 3329
   ═══════════════════════════════════════════════════════════════ */

const Q = 23;
const N = 2;
const HALF_Q = Math.floor(Q / 2);

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

const transpose = (m: Matrix): Matrix => m[0].map((_, c) => m.map((r) => r[c]));

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

const distMod = (x: number, target: number) => {
  const d = Math.abs(mod(x, Q) - target);
  return Math.min(d, Q - d);
};

const threshold = (value: number): number => {
  const dHalf = distMod(value, HALF_Q);
  const dZero = distMod(value, 0);
  return dHalf < dZero ? HALF_Q : 0;
};

/* ─── Secrets ────────────────────────────────────── */
type ShapeKind = 'circle' | 'hexagon' | 'triangle' | 'diamond';

interface SecretDef {
  shape: ShapeKind;
  labelKey: TranslationKey;
  bits: Vector;
  palette: 'cyan' | 'blue' | 'pink' | 'violet';
}

const SECRETS: SecretDef[] = [
  { shape: 'circle', labelKey: 'kemSim.secret.circle', bits: [0, 0], palette: 'cyan' },
  { shape: 'hexagon', labelKey: 'kemSim.secret.hexagon', bits: [0, HALF_Q], palette: 'blue' },
  { shape: 'triangle', labelKey: 'kemSim.secret.triangle', bits: [HALF_Q, 0], palette: 'pink' },
  { shape: 'diamond', labelKey: 'kemSim.secret.diamond', bits: [HALF_Q, HALF_Q], palette: 'violet' },
];

const bitsToSecretIdx = (bits: Vector): number =>
  SECRETS.findIndex((s) => s.bits[0] === bits[0] && s.bits[1] === bits[1]);

/* ═══════════════════════════════════════════════════
   UI primitives
   ═══════════════════════════════════════════════════ */

type Palette = 'cyan' | 'violet' | 'pink' | 'mint' | 'amber' | 'rose' | 'blue';

const paletteHex: Record<Palette, string> = {
  cyan: '#5eead4',
  violet: '#a78bfa',
  pink: '#f472b6',
  mint: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  blue: '#60a5fa',
};

const Shape: React.FC<{
  kind: ShapeKind;
  palette: Palette;
  size?: number;
  glow?: boolean;
}> = ({ kind, palette, size = 48, glow = true }) => {
  const hex = paletteHex[palette];
  const filterId = `glow-${palette}-${kind}`;
  const stroke = hex;
  const fill = `${hex}33`;

  const shapeNode = (() => {
    const half = 50;
    const r = 38;
    switch (kind) {
      case 'circle':
        return (
          <circle
            cx={half}
            cy={half}
            r={r}
            fill={fill}
            stroke={stroke}
            strokeWidth={5}
          />
        );
      case 'hexagon': {
        const pts = [0, 1, 2, 3, 4, 5]
          .map((i) => {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            return `${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`;
          })
          .join(' ');
        return (
          <polygon
            points={pts}
            fill={fill}
            stroke={stroke}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        );
      }
      case 'triangle': {
        const pts = [0, 1, 2]
          .map((i) => {
            const angle = (2 * Math.PI * i) / 3 - Math.PI / 2;
            return `${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`;
          })
          .join(' ');
        return (
          <polygon
            points={pts}
            fill={fill}
            stroke={stroke}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        );
      }
      case 'diamond':
        return (
          <polygon
            points={`${half},${half - r} ${half + r},${half} ${half},${half + r} ${half - r},${half}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        );
    }
  })();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        filter: glow ? `drop-shadow(0 0 6px ${hex}99)` : undefined,
      }}
    >
      <defs>
        <linearGradient id={filterId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`${hex}66`} />
          <stop offset="100%" stopColor={`${hex}22`} />
        </linearGradient>
      </defs>
      {shapeNode}
    </svg>
  );
};

const HeatCell = ({
  value,
  palette,
  delay = 0,
  size = 38,
  label,
}: {
  value: number;
  palette: Palette;
  delay?: number;
  size?: number;
  label?: string;
}) => {
  const intensity = mod(value, Q) / (Q - 1);
  const hex = paletteHex[palette];
  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, type: 'spring', stiffness: 280, damping: 22 }}
        className="rounded-lg flex items-center justify-center font-mono text-xs font-bold border border-white/5"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${hex}33 0%, ${hex}${(
            0x55 +
            Math.floor(intensity * 0x88)
          ).toString(16).padStart(2, '0')} 100%)`,
          color: intensity > 0.55 ? '#05060f' : hex,
          boxShadow: `0 0 ${4 + intensity * 10}px ${hex}55`,
        }}
      >
        {value}
      </motion.div>
      {label && (
        <span className="text-[9px] text-slate-500 font-mono">{label}</span>
      )}
    </div>
  );
};

const MatrixHeatmap = ({
  label,
  matrix,
  palette,
}: {
  label: string;
  matrix: Matrix;
  palette: Palette;
}) => (
  <div className="text-center space-y-1.5">
    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <div className="inline-grid grid-cols-2 gap-1 p-1.5 rounded-xl bg-quantum-panel2/60 border border-quantum-border/60">
      {matrix.flat().map((v, i) => (
        <HeatCell key={i} value={mod(v, Q)} palette={palette} delay={i * 0.06} />
      ))}
    </div>
  </div>
);

const VectorHeat = ({
  label,
  vector,
  palette,
  baseDelay = 0,
}: {
  label: string;
  vector: Vector;
  palette: Palette;
  baseDelay?: number;
}) => (
  <div className="text-center space-y-1.5">
    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <div className="inline-flex gap-1 p-1.5 rounded-xl bg-quantum-panel2/60 border border-quantum-border/60">
      {vector.map((v, i) => (
        <HeatCell
          key={i}
          value={mod(v, Q)}
          palette={palette}
          delay={baseDelay + i * 0.06}
        />
      ))}
    </div>
  </div>
);

const MathOp = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xl md:text-2xl font-display font-bold text-slate-500 px-1">
    {children}
  </span>
);

const MathDetail = ({ children }: { children: React.ReactNode }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-dashed border-quantum-border bg-quantum-panel/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-quantum-cyan transition"
      >
        <Eye size={13} />
        {open ? t('kemSim.math.hide') : t('kemSim.math.show')}
        <span className="ml-auto">
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
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
            <div className="px-4 pb-3 text-xs text-slate-300 space-y-1 font-mono">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Avatar = ({
  name,
  emoji,
  palette,
}: {
  name: string;
  emoji: string;
  palette: Palette;
}) => {
  const hex = paletteHex[palette];
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border"
        style={{
          background: `linear-gradient(135deg, ${hex}22, ${hex}55)`,
          borderColor: `${hex}66`,
        }}
      >
        {emoji}
      </div>
      <span className="text-sm font-display font-semibold text-slate-100">
        {name}
      </span>
    </div>
  );
};

const SectionShell: React.FC<{
  children: React.ReactNode;
  glow?: 'cyan' | 'violet' | 'pink';
}> = ({ children, glow }) => (
  <div
    className={`relative rounded-2xl border border-quantum-border bg-quantum-panel/60 p-5 md:p-7 backdrop-blur-sm overflow-hidden ${
      glow === 'cyan' ? 'glow-cyan' : glow === 'violet' ? 'glow-violet' : glow === 'pink' ? 'glow-pink' : ''
    }`}
  >
    <div className="absolute inset-0 pointer-events-none opacity-50 bg-gradient-to-br from-quantum-cyan/5 via-transparent to-quantum-violet/5" />
    <div className="relative">{children}</div>
  </div>
);

/* ═══════════════════════════════════════════════════
   Concepts in play — connects each phase to the theory
   ═══════════════════════════════════════════════════ */

interface Concept {
  nameKey: TranslationKey;
  kind: 'foundation' | 'application';
  palette: Palette;
  whyKey: TranslationKey;
}

const ConceptCard: React.FC<{ concept: Concept; index: number }> = ({
  concept,
  index,
}) => {
  const t = useT();
  const hex = paletteHex[concept.palette];
  const kindLabel =
    concept.kind === 'foundation' ? t('kemSim.kind.foundation') : t('kemSim.kind.application');
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="rounded-xl border p-3 space-y-1.5"
      style={{
        background: `linear-gradient(135deg, ${hex}10, transparent)`,
        borderColor: `${hex}40`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full border"
          style={{ borderColor: `${hex}55`, color: hex }}
        >
          {kindLabel}
        </span>
        <h5
          className="font-display font-semibold text-sm leading-tight"
          style={{ color: hex }}
        >
          {t(concept.nameKey)}
        </h5>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{t(concept.whyKey)}</p>
    </motion.div>
  );
};

const ConceptsPanel: React.FC<{ concepts: Concept[]; title?: string }> = ({
  concepts,
  title,
}) => {
  const t = useT();
  return (
    <div className="rounded-2xl border border-quantum-border bg-quantum-panel2/30 p-4 space-y-3 h-full">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-quantum-amber/15 text-quantum-amber">
          <Lightbulb size={14} />
        </div>
        <h4 className="font-display font-semibold text-sm text-slate-100">
          {title ?? t('kemSim.concepts.title')}
        </h4>
      </div>
      <div className="space-y-2">
        {concepts.map((c, i) => (
          <ConceptCard key={c.nameKey} concept={c} index={i} />
        ))}
      </div>
    </div>
  );
};

const IntuitionBox: React.FC<{
  title: string;
  children: React.ReactNode;
  palette?: Palette;
}> = ({ title, children, palette = 'cyan' }) => {
  const hex = paletteHex[palette];
  return (
    <div
      className="rounded-xl border p-3.5 flex gap-3 items-start"
      style={{
        background: `linear-gradient(135deg, ${hex}0d, transparent)`,
        borderColor: `${hex}33`,
      }}
    >
      <div
        className="shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `${hex}1f`, color: hex }}
      >
        <Sparkles size={14} />
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: hex }}>
          {title}
        </p>
        <p className="text-sm text-slate-200 leading-relaxed">{children}</p>
      </div>
    </div>
  );
};

/* Step list with bullets so the user sees the chronological flow */
const StepList: React.FC<{
  steps: { title: React.ReactNode; desc: React.ReactNode }[];
  palette?: Palette;
}> = ({ steps, palette = 'cyan' }) => {
  const hex = paletteHex[palette];
  return (
    <ol className="space-y-2">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold border"
            style={{ borderColor: `${hex}55`, color: hex, background: `${hex}10` }}
          >
            {i + 1}
          </span>
          <div className="flex-1 pt-0.5">
            <span className="text-sm font-display font-semibold text-slate-100">
              {s.title}
            </span>
            <div className="text-xs text-slate-300 leading-relaxed mt-0.5">{s.desc}</div>
          </div>
        </li>
      ))}
    </ol>
  );
};

/* Visual showing the encoding circle Z_q (used in Encaps) */
const EncodingMini: React.FC = () => {
  const t = useT();
  return (
    <div className="rounded-xl border border-quantum-border bg-quantum-panel2/40 p-3">
      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2 text-center">
        {t('kemSim.encoding.title')}
      </p>
      <div className="flex items-center justify-around text-xs">
        <div className="flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full border-2 border-quantum-cyan text-quantum-cyan flex items-center justify-center font-mono font-bold">
            0
          </div>
          <span className="text-quantum-cyan font-mono text-[10px]">{t('kemSim.encoding.bit0')}</span>
        </div>
        <ArrowRight size={14} className="text-slate-500" />
        <div className="flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full border-2 border-quantum-pink text-quantum-pink flex items-center justify-center font-mono font-bold">
            {HALF_Q}
          </div>
          <span className="text-quantum-pink font-mono text-[10px]">
            {t('kemSim.encoding.bit1').replace('{n}', String(HALF_Q))}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 text-center mt-2 leading-tight">
        {t('kemSim.encoding.footer').replace('{n}', String(Math.floor(Q / 4)))}
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Phase definitions
   ═══════════════════════════════════════════════════ */
type Phase = 'intro' | 'keygen' | 'encaps' | 'decaps' | 'result';

interface PhaseDef {
  id: Phase;
  labelKey: TranslationKey;
  icon: typeof KeyRound;
  palette: Palette;
}

const PHASES: PhaseDef[] = [
  { id: 'intro', labelKey: 'kemSim.phase.intro', icon: Sparkles, palette: 'cyan' },
  { id: 'keygen', labelKey: 'kemSim.phase.keygen', icon: KeyRound, palette: 'cyan' },
  { id: 'encaps', labelKey: 'kemSim.phase.encaps', icon: Lock, palette: 'violet' },
  { id: 'decaps', labelKey: 'kemSim.phase.decaps', icon: Unlock, palette: 'mint' },
  { id: 'result', labelKey: 'kemSim.phase.result', icon: ShieldAlert, palette: 'pink' },
];

const KEYGEN_CONCEPTS: Concept[] = [
  { nameKey: 'kemSim.cpt.mlwe.name', kind: 'foundation', palette: 'cyan', whyKey: 'kemSim.cpt.mlwe.why' },
  { nameKey: 'kemSim.cpt.lattice.name', kind: 'foundation', palette: 'violet', whyKey: 'kemSim.cpt.lattice.why' },
  { nameKey: 'kemSim.cpt.ring.name', kind: 'foundation', palette: 'pink', whyKey: 'kemSim.cpt.ring.why' },
];

const ENCAPS_CONCEPTS: Concept[] = [
  { nameKey: 'kemSim.cpt.mlweBob.name', kind: 'foundation', palette: 'violet', whyKey: 'kemSim.cpt.mlweBob.why' },
  { nameKey: 'kemSim.cpt.code.name', kind: 'foundation', palette: 'pink', whyKey: 'kemSim.cpt.code.why' },
  { nameKey: 'kemSim.cpt.fo.name', kind: 'application', palette: 'amber', whyKey: 'kemSim.cpt.fo.why' },
];

const DECAPS_CONCEPTS: Concept[] = [
  { nameKey: 'kemSim.cpt.cancel.name', kind: 'foundation', palette: 'mint', whyKey: 'kemSim.cpt.cancel.why' },
  { nameKey: 'kemSim.cpt.cvp.name', kind: 'foundation', palette: 'cyan', whyKey: 'kemSim.cpt.cvp.why' },
  { nameKey: 'kemSim.cpt.decode.name', kind: 'foundation', palette: 'pink', whyKey: 'kemSim.cpt.decode.why' },
];

const SPY_CONCEPTS: Concept[] = [
  { nameKey: 'kemSim.cpt.lweHard.name', kind: 'foundation', palette: 'rose', whyKey: 'kemSim.cpt.lweHard.why' },
  { nameKey: 'kemSim.cpt.badBasis.name', kind: 'foundation', palette: 'amber', whyKey: 'kemSim.cpt.badBasis.why' },
];

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */
interface MLKEMSimulatorProps {
  onUse?: () => void;
}

const MLKEMSimulator: React.FC<MLKEMSimulatorProps> = ({ onUse }) => {
  const t = useT();
  const containerRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const prevPhaseRef = useRef<Phase>(phase);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [selectedSecret, setSelectedSecret] = useState(0);
  const [cipher, setCipher] = useState<Cipher | null>(null);
  const [message, setMessage] = useState<Vector | null>(null);
  const [decryptedBits, setDecryptedBits] = useState<Vector | null>(null);
  const [intermediateW, setIntermediateW] = useState<Vector | null>(null);
  const [showDecrypt, setShowDecrypt] = useState(false);
  const [spyBits, setSpyBits] = useState<Vector | null>(null);
  const [spyKey, setSpyKey] = useState<Vector | null>(null);

  const phaseIdx = PHASES.findIndex((p) => p.id === phase);

  useEffect(() => {
    // Only scroll when phase ACTUALLY changes (skips first mount and
    // StrictMode's double-fire of the effect, both of which leave the
    // previous phase equal to the current one).
    if (prevPhaseRef.current === phase) return;
    prevPhaseRef.current = phase;
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [phase]);

  /* ── Handlers ──────────────────────────────────── */

  const handleGenerate = () => {
    onUse?.();
    const A = randomMatrix(N, Q);
    const s = randomSmallVec(N, 1);
    const e = randomSmallVec(N, 1);
    const t = vecAdd(matVecMul(A, toMod(s, Q), Q), toMod(e, Q), Q);
    setKeyPair({ A, s, e, t });
    setCipher(null);
    setMessage(null);
    setDecryptedBits(null);
    setIntermediateW(null);
    setShowDecrypt(false);
    setSpyBits(null);
  };

  const handleEncapsulate = () => {
    if (!keyPair) return;
    onUse?.();
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
    setIntermediateW(null);
    setShowDecrypt(false);
    setSpyBits(null);
  };

  const handleDecapsulate = () => {
    if (!keyPair || !cipher) return;
    onUse?.();
    const sDotU = mod(dot(toMod(keyPair.s, Q), cipher.u), Q);
    const raw = cipher.v.map((vi) => mod(vi - sDotU, Q));
    setIntermediateW(raw);
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
    setIntermediateW(null);
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
    <section ref={containerRef} className="mx-auto max-w-4xl space-y-5 text-slate-200">
      {/* ── Progress indicator ────────────────────── */}
      <nav className="flex items-center justify-center gap-1 overflow-x-auto pb-1">
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          const current = i === phaseIdx;
          const done = i < phaseIdx;
          const hex = paletteHex[p.palette];
          return (
            <div key={p.id} className="flex items-center shrink-0">
              {i > 0 && (
                <div
                  className="h-0.5 w-5 sm:w-8 rounded-full transition-colors"
                  style={{
                    background: done
                      ? `linear-gradient(90deg, ${paletteHex[PHASES[i - 1].palette]}, ${hex})`
                      : '#1f2750',
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => {
                  if (done) setPhase(p.id);
                }}
                disabled={!done && !current}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap border ${
                  current
                    ? 'border-transparent text-quantum-bg shadow-md'
                    : done
                    ? 'border-quantum-border bg-quantum-panel/60 text-slate-200 hover:border-current'
                    : 'border-quantum-border bg-quantum-panel/30 text-slate-500 cursor-not-allowed'
                }`}
                style={
                  current
                    ? { background: `linear-gradient(120deg, ${hex}, ${paletteHex.violet})` }
                    : done
                    ? { color: hex }
                    : undefined
                }
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{t(p.labelKey)}</span>
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
          >
            <SectionShell glow="cyan">
              <div className="space-y-5">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-quantum-cyan font-mono mb-1">
                    {t('kemSim.intro.eyebrow')}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-100">
                    {t('kemSim.intro.title')}
                  </h2>
                  <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
                    {t('kemSim.intro.lead.a')}
                    <span className="text-quantum-amber">{t('kemSim.intro.lead.b')}</span>
                    {t('kemSim.intro.lead.c')}
                    <strong>{t('kemSim.intro.lead.d')}</strong>
                    {t('kemSim.intro.lead.e')}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-quantum-cyan/30 bg-quantum-cyan/5 p-4 space-y-2">
                    <Avatar name="Alice" emoji="👩‍💻" palette="cyan" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t('kemSim.intro.alice.desc.a')}
                      <strong className="text-quantum-cyan">{t('kemSim.intro.alice.desc.b')}</strong>
                      {t('kemSim.intro.alice.desc.c')}
                    </p>
                  </div>
                  <div className="rounded-xl border border-quantum-violet/30 bg-quantum-violet/5 p-4 space-y-2">
                    <Avatar name="Bob" emoji="👨‍💻" palette="violet" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t('kemSim.intro.bob.desc.a')}
                      <strong className="text-quantum-violet">{t('kemSim.intro.bob.desc.b')}</strong>
                      {t('kemSim.intro.bob.desc.c')}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-quantum-border bg-quantum-panel2/40 p-3 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono flex-wrap">
                  <span className="text-quantum-cyan">{t('kemSim.phase.keygen')}</span>
                  <ArrowRight size={12} />
                  <span className="text-quantum-violet">{t('kemSim.phase.encaps')}</span>
                  <ArrowRight size={12} />
                  <span className="text-quantum-mint">{t('kemSim.phase.decaps')}</span>
                  <ArrowRight size={12} />
                  <span className="text-quantum-pink">{t('kemSim.phase.result')}</span>
                </div>

                <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                  <span className="font-mono text-quantum-cyan">{t('kemSim.intro.params.a')}</span>{' '}
                  <span className="font-mono">q = {Q}, n = {N}</span>
                  {t('kemSim.intro.params.b')}<span className="font-mono">n = 256</span>
                  {t('kemSim.intro.params.c')}<span className="font-mono">q = 3329</span>
                  {t('kemSim.intro.params.d')}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="btn-quantum text-sm py-2 px-5"
                >
                  {t('kemSim.intro.start')} <ArrowRight size={14} />
                </button>
              </div>
            </SectionShell>
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
          >
            <SectionShell glow="cyan">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <Avatar name={t('kemSim.keygen.avatar')} emoji="👩‍💻" palette="cyan" />
                  <span className="chip text-[10px]">{t('kemSim.keygen.stepBadge')}</span>
                </div>

                <IntuitionBox title={t('kemSim.keygen.intuition.title')} palette="cyan">
                  {t('kemSim.keygen.intuition.a')}
                  <span className="font-mono text-quantum-amber">s</span>
                  {t('kemSim.keygen.intuition.b')}
                  <span className="font-mono text-quantum-cyan">A</span>
                  {t('kemSim.keygen.intuition.c')}
                  <span className="font-mono text-quantum-amber">e</span>
                  {t('kemSim.keygen.intuition.d')}
                  <span className="font-mono text-quantum-cyan">t</span>
                  {t('kemSim.keygen.intuition.e')}
                </IntuitionBox>

                <div className="grid lg:grid-cols-[1.5fr,1fr] gap-4">
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-quantum-cyan/15 border border-quantum-cyan/40 text-quantum-cyan hover:bg-quantum-cyan/25 transition-all"
                    >
                      <KeyRound size={14} />
                      {keyPair ? t('kemSim.keygen.regen') : t('kemSim.keygen.gen')}
                    </button>

                    {keyPair && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="rounded-xl border border-quantum-border bg-quantum-panel2/40 p-4">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-quantum-cyan text-center mb-4">
                            t = A · s + e (mod {Q})
                          </p>
                          <div className="flex flex-wrap items-end justify-center gap-3">
                            <MatrixHeatmap label={t('kemSim.keygen.label.A')} matrix={keyPair.A} palette="blue" />
                            <MathOp>×</MathOp>
                            <VectorHeat label={t('kemSim.keygen.label.s')} vector={keyPair.s} palette="amber" />
                            <MathOp>+</MathOp>
                            <VectorHeat
                              label={t('kemSim.keygen.label.e')}
                              vector={keyPair.e}
                              palette="amber"
                              baseDelay={0.3}
                            />
                            <MathOp>=</MathOp>
                            <VectorHeat
                              label={t('kemSim.keygen.label.t')}
                              vector={keyPair.t}
                              palette="cyan"
                              baseDelay={0.5}
                            />
                          </div>
                        </div>

                        <StepList
                          palette="cyan"
                          steps={[
                            { title: t('kemSim.keygen.s1.title'), desc: t('kemSim.keygen.s1.desc') },
                            { title: t('kemSim.keygen.s2.title'), desc: t('kemSim.keygen.s2.desc') },
                            { title: t('kemSim.keygen.s3.title'), desc: t('kemSim.keygen.s3.desc') },
                          ]}
                        />

                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded" style={{ background: paletteHex.blue }} />
                            <span className="text-slate-400">{t('kemSim.keygen.legend.public')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded" style={{ background: paletteHex.cyan }} />
                            <span className="text-slate-400">{t('kemSim.keygen.legend.publicResult')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded" style={{ background: paletteHex.amber }} />
                            <span className="text-slate-400">{t('kemSim.keygen.legend.private')}</span>
                          </div>
                        </div>

                        <MathDetail>
                          <p>
                            A = [[{keyPair.A[0].join(', ')}], [{keyPair.A[1].join(', ')}]]
                          </p>
                          <p>s = [{keyPair.s.join(', ')}] · e = [{keyPair.e.join(', ')}]</p>
                          <p>
                            t = A·s + e mod {Q} = [{keyPair.t.join(', ')}]
                          </p>
                        </MathDetail>

                        <button
                          type="button"
                          onClick={goNext}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-quantum-border text-slate-200 hover:border-quantum-cyan/60 hover:text-quantum-cyan transition-all"
                        >
                          {t('kemSim.keygen.next')} <ArrowRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <ConceptsPanel concepts={KEYGEN_CONCEPTS} />
                </div>
              </div>
            </SectionShell>
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
          >
            <SectionShell glow="violet">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <Avatar name={t('kemSim.encaps.avatar')} emoji="👨‍💻" palette="violet" />
                  <span className="chip text-[10px]">{t('kemSim.encaps.stepBadge')}</span>
                </div>

                <IntuitionBox title={t('kemSim.encaps.intuition.title')} palette="violet">
                  {t('kemSim.encaps.intuition.a')}
                  <span className="font-mono">u = Aᵀ·r + e₁</span>
                  {t('kemSim.encaps.intuition.b')}
                  <span className="font-mono">m</span>
                  {t('kemSim.encaps.intuition.c')}
                  <span className="font-mono">v</span>
                  {t('kemSim.encaps.intuition.d')}
                  <span className="font-mono">v − sᵀ·u</span>
                  {t('kemSim.encaps.intuition.e')}
                </IntuitionBox>

                <div className="grid lg:grid-cols-[1.5fr,1fr] gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        {t('kemSim.encaps.choose')}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {SECRETS.map((s, idx) => {
                          const active = selectedSecret === idx;
                          const hex = paletteHex[s.palette as Palette];
                          return (
                            <button
                              key={s.labelKey}
                              type="button"
                              onClick={() => {
                                setSelectedSecret(idx);
                                setCipher(null);
                                setDecryptedBits(null);
                                setIntermediateW(null);
                                setShowDecrypt(false);
                                setSpyBits(null);
                              }}
                              className="flex flex-col items-center gap-1 rounded-xl p-3 border transition-all"
                              style={{
                                borderColor: active ? hex : '#1f2750',
                                background: active
                                  ? `linear-gradient(135deg, ${hex}22, ${hex}11)`
                                  : 'rgba(12, 15, 29, 0.5)',
                                boxShadow: active ? `0 0 14px ${hex}55` : undefined,
                              }}
                            >
                              <Shape kind={s.shape} palette={s.palette} size={42} />
                              <span className="text-[10px] font-medium text-slate-200">
                                {t(s.labelKey)}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                Encode([{s.bits.join(', ')}])
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <EncodingMini />

                    <button
                      type="button"
                      disabled={!keyPair}
                      onClick={handleEncapsulate}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-quantum-violet/15 border border-quantum-violet/40 text-quantum-violet hover:bg-quantum-violet/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Lock size={14} />
                      {t('kemSim.encaps.action')}
                    </button>

                    {cipher && message && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <StepList
                          palette="violet"
                          steps={[
                            { title: t('kemSim.encaps.s1.title'), desc: t('kemSim.encaps.s1.desc') },
                            { title: t('kemSim.encaps.s2.title'), desc: t('kemSim.encaps.s2.desc') },
                            { title: t('kemSim.encaps.s3.title'), desc: t('kemSim.encaps.s3.desc') },
                            { title: t('kemSim.encaps.s4.title'), desc: t('kemSim.encaps.s4.desc') },
                          ]}
                        />

                        <div className="rounded-xl border border-quantum-border bg-quantum-panel2/40 p-5 text-center space-y-3">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-quantum-violet">
                            {t('kemSim.encaps.generated')}
                          </p>
                          <div className="flex items-center justify-center gap-6">
                            <div className="flex flex-col items-center gap-1">
                              <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 0.6 }}
                              >
                                <Shape
                                  kind={SECRETS[selectedSecret].shape}
                                  palette={SECRETS[selectedSecret].palette}
                                  size={52}
                                />
                              </motion.div>
                              <span className="text-[10px] text-slate-500">
                                {t('kemSim.encaps.yourSecret')}
                              </span>
                            </div>
                            <ArrowRight size={20} className="text-slate-500" />
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4, type: 'spring' }}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg border"
                                style={{
                                  background: `linear-gradient(135deg, ${paletteHex.violet}, ${paletteHex.blue})`,
                                  borderColor: `${paletteHex.violet}66`,
                                  color: '#05060f',
                                }}
                              >
                                🔒
                              </div>
                              <span className="text-[10px] text-slate-500">
                                {t('kemSim.encaps.ciphered')}
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-end justify-center gap-3">
                          <VectorHeat label="u" vector={cipher.u} palette="violet" />
                          <VectorHeat
                            label="v"
                            vector={cipher.v}
                            palette="violet"
                            baseDelay={0.2}
                          />
                        </div>

                        <MathDetail>
                          <p>r (efímero) = [{cipher.r.join(', ')}]</p>
                          <p>
                            e₁ = [{cipher.e1.join(', ')}], e₂ = [{cipher.e2.join(', ')}]
                          </p>
                          <p>u = Aᵀ·r + e₁ mod {Q} = [{cipher.u.join(', ')}]</p>
                          <p>v = tᵀ·r + e₂ + m mod {Q} = [{cipher.v.join(', ')}]</p>
                          <p className="text-slate-500 mt-1 leading-relaxed">
                            m = Encode([{message.join(', ')}])
                          </p>
                        </MathDetail>

                        <div className="rounded-xl border border-quantum-violet/30 bg-quantum-violet/5 p-4 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-display font-semibold text-quantum-violet">
                              👨‍💻 Bob
                            </span>
                            <span className="font-display font-semibold text-quantum-cyan">
                              👩‍💻 Alice
                            </span>
                          </div>
                          <div className="relative h-8">
                            <div className="absolute inset-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-quantum-violet/40 via-slate-600 to-quantum-cyan/40 rounded-full" />
                            <motion.div
                              className="absolute top-1/2 -translate-y-1/2"
                              animate={{ left: ['5%', '85%'] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            >
                              <Mail size={18} className="text-quantum-cyan" />
                            </motion.div>
                          </div>
                          <p className="text-center text-[10px] text-slate-400">
                            {t('kemSim.encaps.channel')}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={goNext}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-quantum-border text-slate-200 hover:border-quantum-violet/60 hover:text-quantum-violet transition-all"
                        >
                          {t('kemSim.encaps.send')} <ArrowRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <ConceptsPanel concepts={ENCAPS_CONCEPTS} />
                </div>
              </div>
            </SectionShell>
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
          >
            <SectionShell glow="violet">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <Avatar name={t('kemSim.decaps.avatar')} emoji="👩‍💻" palette="mint" />
                  <span className="chip text-[10px]">{t('kemSim.decaps.stepBadge')}</span>
                </div>

                <IntuitionBox title={t('kemSim.decaps.intuition.title')} palette="mint">
                  {t('kemSim.decaps.intuition.a')}
                  <span className="font-mono">v − sᵀ·u</span>
                  {t('kemSim.decaps.intuition.b')}
                  <span className="font-mono">sᵀ·Aᵀ·r</span>
                  {t('kemSim.decaps.intuition.c')}
                  <span className="font-mono">Encode(m) + ε</span>
                  {t('kemSim.decaps.intuition.d')}
                </IntuitionBox>

                <div className="grid lg:grid-cols-[1.5fr,1fr] gap-4">
                  <div className="space-y-4">
                    {!showDecrypt && (
                      <div className="flex flex-col items-center gap-3 py-6">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(94,234,212,0.15))',
                            borderColor: '#1f2750',
                          }}
                        >
                          🔒
                        </motion.div>
                        <p className="text-xs text-slate-400">{t('kemSim.decaps.peek')}</p>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={!keyPair || !cipher || showDecrypt}
                      onClick={handleDecapsulate}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-quantum-mint/15 border border-quantum-mint/40 text-quantum-mint hover:bg-quantum-mint/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Unlock size={14} />
                      {t('kemSim.decaps.action')}
                    </button>

                    {showDecrypt && decryptedBits && intermediateW && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="rounded-xl border border-quantum-border bg-quantum-panel2/40 p-4 space-y-3">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-quantum-mint text-center">
                            w = v − sᵀ · u (mod {Q})
                          </p>
                          {(() => {
                            const sDotUVal = mod(
                              dot(toMod(keyPair!.s, Q), cipher!.u),
                              Q,
                            );
                            return (
                              <div className="flex flex-wrap items-end justify-center gap-3">
                                <VectorHeat label={t('kemSim.decaps.label.v')} vector={cipher!.v} palette="violet" />
                                <MathOp>−</MathOp>
                                <VectorHeat
                                  label={t('kemSim.decaps.label.sTu')}
                                  vector={[sDotUVal, sDotUVal]}
                                  palette="amber"
                                  baseDelay={0.15}
                                />
                                <MathOp>=</MathOp>
                                <VectorHeat
                                  label={t('kemSim.decaps.label.w')}
                                  vector={intermediateW}
                                  palette="mint"
                                  baseDelay={0.3}
                                />
                              </div>
                            );
                          })()}
                          <p className="text-[10px] text-slate-400 text-center px-3">
                            {t('kemSim.decaps.w.note.a')}
                            <span className="font-mono">w</span>
                            {t('kemSim.decaps.w.note.b')}
                            <span className="font-mono">Encode(m)</span>
                            {t('kemSim.decaps.w.note.c').replace('{n}', String(HALF_Q))}
                          </p>
                        </div>

                        <div className="rounded-xl border border-quantum-mint/30 bg-quantum-mint/5 p-4">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-quantum-mint text-center mb-3">
                            {t('kemSim.decaps.decodeHeading')}
                          </p>
                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            {intermediateW.map((wi, i) => {
                              const dec = decryptedBits[i];
                              const d0 = distMod(wi, 0);
                              const dH = distMod(wi, HALF_Q);
                              return (
                                <div
                                  key={i}
                                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-quantum-panel/60 border border-quantum-border"
                                >
                                  <div className="font-mono text-xs text-slate-400">
                                    {t('kemSim.decaps.coef')} {i}: {wi}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    d(0) = {d0} · d({HALF_Q}) = {dH}
                                  </div>
                                  <div className="font-mono text-sm font-bold text-quantum-mint">
                                    → {t('kemSim.decaps.bit')} {dec === 0 ? '0' : '1'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 py-2">
                          <motion.div
                            initial={{ rotateY: 180, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ duration: 0.6, type: 'spring' }}
                            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-2"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(94,234,212,0.18))',
                              borderColor: paletteHex.mint,
                              boxShadow: `0 0 24px ${paletteHex.mint}55`,
                            }}
                          >
                            {decryptedIdx >= 0 ? (
                              <Shape
                                kind={SECRETS[decryptedIdx].shape}
                                palette={SECRETS[decryptedIdx].palette}
                                size={56}
                              />
                            ) : (
                              <span className="text-4xl text-slate-400">?</span>
                            )}
                          </motion.div>
                          <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={`text-sm font-semibold ${
                              isCorrect ? 'text-quantum-mint' : 'text-quantum-amber'
                            }`}
                          >
                            {isCorrect
                              ? t('kemSim.decaps.success').replace('{label}', t(SECRETS[selectedSecret].labelKey))
                              : t('kemSim.decaps.unexpected')}
                          </motion.p>
                        </div>

                        <MathDetail>
                          <p>sᵀ · u = {mod(dot(toMod(keyPair!.s, Q), cipher!.u), Q)} (mod {Q})</p>
                          <p>w = v − sᵀ·u = [{intermediateW.join(', ')}]</p>
                          <p>Decode(w) = [{decryptedBits.join(', ')}]</p>
                          <p className="text-slate-500 mt-1 leading-relaxed">
                            {t('kemSim.decaps.noiseSafe').replace('{n}', String(Math.floor(Q / 4)))}
                          </p>
                        </MathDetail>

                        <button
                          type="button"
                          onClick={goNext}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-quantum-border text-slate-200 hover:border-quantum-mint/60 hover:text-quantum-mint transition-all"
                        >
                          {t('kemSim.decaps.next')} <ArrowRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <ConceptsPanel concepts={DECAPS_CONCEPTS} />
                </div>
              </div>
            </SectionShell>
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
            className="space-y-5"
          >
            <SectionShell glow="pink">
              <div className="space-y-5">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="p-2 rounded-lg bg-quantum-pink/15 text-quantum-pink">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-quantum-pink font-mono">
                      {t('kemSim.result.eyebrow')}
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-100">
                      {t('kemSim.result.title')}
                    </h3>
                  </div>
                </div>

                <div className="rounded-xl border border-quantum-mint/30 bg-quantum-mint/5 p-5">
                  <div className="flex items-center justify-center gap-5 md:gap-8">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                        {t('kemSim.result.sent')}
                      </p>
                      <div className="w-14 h-14 mx-auto rounded-xl bg-quantum-panel/60 border border-quantum-border flex items-center justify-center">
                        <Shape
                          kind={SECRETS[selectedSecret].shape}
                          palette={SECRETS[selectedSecret].palette}
                          size={40}
                        />
                      </div>
                      <p className="text-xs mt-1 text-slate-300 font-medium">
                        {t(SECRETS[selectedSecret].labelKey)}
                      </p>
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      {isCorrect ? '✓' : '✗'}
                    </motion.span>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                        {t('kemSim.result.received')}
                      </p>
                      <div className="w-14 h-14 mx-auto rounded-xl bg-quantum-panel/60 border border-quantum-border flex items-center justify-center">
                        {decryptedIdx >= 0 ? (
                          <Shape
                            kind={SECRETS[decryptedIdx].shape}
                            palette={SECRETS[decryptedIdx].palette}
                            size={40}
                          />
                        ) : (
                          <span className="text-xl text-slate-400">?</span>
                        )}
                      </div>
                      <p className="text-xs mt-1 text-slate-300 font-medium">
                        {decryptedIdx >= 0 ? t(SECRETS[decryptedIdx].labelKey) : '?'}
                      </p>
                    </div>
                  </div>
                  <p className="text-center text-xs text-quantum-mint mt-4">
                    {isCorrect ? t('kemSim.result.ok') : t('kemSim.result.fail')}
                  </p>
                </div>
              </div>
            </SectionShell>

            <SectionShell>
              <div className="grid lg:grid-cols-[1.5fr,1fr] gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-quantum-rose/15 text-quantum-rose">
                      <ShieldAlert size={16} />
                    </div>
                    <h4 className="font-display text-lg font-bold text-slate-100">
                      {t('kemSim.spy.title')}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t('kemSim.spy.lead.a')}
                    <span className="font-mono">(u, v)</span>
                    {t('kemSim.spy.lead.b')}
                    <span className="font-mono">(A, t)</span>
                    {t('kemSim.spy.lead.c')}
                    <strong>{t('kemSim.spy.lead.d')}</strong>
                    {t('kemSim.spy.lead.e')}
                  </p>

                  <button
                    type="button"
                    onClick={handleSpyAttempt}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-quantum-rose/15 border border-quantum-rose/40 text-quantum-rose hover:bg-quantum-rose/25 transition-all"
                  >
                    {t('kemSim.spy.attempt')}
                  </button>

                  {spyBits && spyKey && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-quantum-mint/30 bg-quantum-mint/5 p-4 text-center space-y-2">
                          <Avatar name="Alice" emoji="👩‍💻" palette="mint" />
                          <p className="text-[10px] text-slate-400">{t('kemSim.spy.alice.kind')}</p>
                          <div className="flex justify-center py-1">
                            {decryptedIdx >= 0 ? (
                              <Shape
                                kind={SECRETS[decryptedIdx].shape}
                                palette={SECRETS[decryptedIdx].palette}
                                size={44}
                              />
                            ) : (
                              <span className="text-3xl text-slate-400">?</span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-quantum-mint">
                            ✓ {decryptedIdx >= 0 ? t(SECRETS[decryptedIdx].labelKey) : '?'}
                          </p>
                          {keyPair && (
                            <p className="text-[10px] font-mono text-slate-500">
                              s = [{keyPair.s.join(', ')}]
                            </p>
                          )}
                        </div>

                        <div className="rounded-xl border border-quantum-rose/30 bg-quantum-rose/5 p-4 text-center space-y-2">
                          <Avatar name={t('kemSim.spy.eve.name')} emoji="🕵️" palette="rose" />
                          <p className="text-[10px] text-slate-400">{t('kemSim.spy.eve.kind')}</p>
                          <div className="flex justify-center py-1">
                            {spyIdx >= 0 ? (
                              <Shape
                                kind={SECRETS[spyIdx].shape}
                                palette={SECRETS[spyIdx].palette}
                                size={44}
                              />
                            ) : (
                              <span className="text-3xl text-slate-400">?</span>
                            )}
                          </div>
                          <p
                            className={`text-xs font-medium ${
                              spyIdx === selectedSecret
                                ? 'text-quantum-amber'
                                : 'text-quantum-rose'
                            }`}
                          >
                            {spyIdx === selectedSecret
                              ? t('kemSim.spy.lucky')
                              : `✗ ${spyIdx >= 0 ? t(SECRETS[spyIdx].labelKey) : '?'}`}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500">
                            s' = [{spyKey.join(', ')}]
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-quantum-border bg-quantum-panel2/30 p-3 text-xs text-slate-300 leading-relaxed space-y-1">
                        <p>
                          <strong className="text-quantum-cyan">{t('kemSim.spy.why.title')}</strong>{' '}
                          {t('kemSim.spy.why.a')}
                          <span className="font-mono">s</span>
                          {t('kemSim.spy.why.b')}
                          <span className="font-mono">v − s'ᵀ·u</span>
                          {t('kemSim.spy.why.c')}
                        </p>
                        <p className="text-slate-500">{t('kemSim.spy.realScale')}</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSpyAttempt}
                        className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-quantum-rose/40 text-quantum-rose hover:bg-quantum-rose/10 transition-all"
                      >
                        <RefreshCw size={12} /> {t('kemSim.spy.again')}
                      </button>
                    </motion.div>
                  )}
                </div>

                <ConceptsPanel concepts={SPY_CONCEPTS} title={t('kemSim.spy.conceptsTitle')} />
              </div>
            </SectionShell>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom navigation ─────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center">
        {phaseIdx > 0 && (
          <button
            type="button"
            onClick={() => {
              const prev = PHASES[phaseIdx - 1];
              if (prev) setPhase(prev.id);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-quantum-border text-slate-300 hover:border-quantum-cyan/60 hover:text-quantum-cyan transition-all"
          >
            {t('kemSim.nav.prev')}
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-quantum-border text-slate-300 hover:border-quantum-rose/60 hover:text-quantum-rose transition-all"
        >
          <RefreshCw size={12} /> {t('kemSim.nav.reset')}
        </button>
      </div>
    </section>
  );
};

export default MLKEMSimulator;
