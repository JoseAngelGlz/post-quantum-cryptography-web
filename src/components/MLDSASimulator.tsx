import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Edit3,
  KeyRound,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Swords,
  XCircle,
  Zap,
} from 'lucide-react';
import { useT } from '../i18n';

/* ═══════════════════════════════════════════════════════════════
   Baby-Dilithium  ·  q = 97, n = 2, k = 2, l = 2
   A tiny demonstration of ML-DSA-style signatures with:
   - Module-SIS-like keys (A small, s small)
   - Fiat-Shamir-with-aborts (rejection sampling on z)
   - Verify: A z - c t ?= w  (low bits)
   Parameters chosen so signing usually succeeds within a few attempts.
   ═══════════════════════════════════════════════════════════════ */

const Q = 97;
const N = 2;
const K = 2;
const L = 2;
const ETA = 2;
const TAU = 1; // hamming weight of challenge c (very small)
const BETA = ETA * TAU; // tighter bound for z
const GAMMA1 = 18; // max y coefficient
const Z_BOUND = GAMMA1 - BETA; // accept |z|_inf < this

type Matrix = number[][];
type Vector = number[];

const mod = (v: number, q: number) => ((v % q) + q) % q;
const centeredMod = (v: number, q: number) => {
  const r = mod(v, q);
  return r > q / 2 ? r - q : r;
};
const randInt = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;

const sampleSmall = (n: number, eta: number): Vector =>
  Array.from({ length: n }, () => randInt(-eta, eta));

const matMulVec = (m: Matrix, v: Vector): Vector =>
  m.map((row) => mod(row.reduce((s, val, i) => s + val * v[i], 0), Q));

const vecAdd = (a: Vector, b: Vector) => a.map((v, i) => mod(v + b[i], Q));
const vecSub = (a: Vector, b: Vector) => a.map((v, i) => mod(v - b[i], Q));
const vecScalarMul = (a: Vector, k: number) => a.map((v) => mod(v * k, Q));
const maxAbs = (v: Vector) => Math.max(...v.map((x) => Math.abs(centeredMod(x, Q))));

// Block-matrix * block-vector with k blocks of size n
const blockMatVec = (A: Matrix[][], v: Vector[]): Vector[] => {
  const out: Vector[] = [];
  for (let i = 0; i < A.length; i++) {
    let acc: Vector = new Array(N).fill(0);
    for (let j = 0; j < A[i].length; j++) {
      const p = matMulVec(A[i][j], v[j]);
      acc = vecAdd(acc, p);
    }
    out.push(acc);
  }
  return out;
};

const blockVecAdd = (a: Vector[], b: Vector[]) => a.map((row, i) => vecAdd(row, b[i]));
const blockVecSub = (a: Vector[], b: Vector[]) => a.map((row, i) => vecSub(row, b[i]));
const blockVecScalarMul = (a: Vector[], k: number) => a.map((row) => vecScalarMul(row, k));

const fakeHash = (parts: number[][]): { c: number; sign: 1 | -1 } => {
  // Toy challenge generator: deterministic but unpredictable from inputs.
  let h = 0x9e3779b1 >>> 0;
  parts.forEach((arr) =>
    arr.forEach((v) => {
      h = ((h ^ (v + Q)) >>> 0) * 16777619;
      h = h >>> 0;
    }),
  );
  const c = (h % (Q - 1)) + 1; // 1..Q-1
  const sign: 1 | -1 = ((h >>> 8) & 1) === 0 ? 1 : -1;
  return { c: sign === 1 ? c : Q - c, sign };
};

interface KeyPair {
  A: Matrix[][];
  s: Vector[];
  t: Vector[];
}

type TraceEntry = { attempt: number; kind: 'reject' | 'accept' };

interface Signature {
  z: Vector[];
  c: number;
  attempts: number;
  trace: TraceEntry[];
}

const genKeys = (): KeyPair => {
  const A: Matrix[][] = [];
  for (let i = 0; i < K; i++) {
    A.push([]);
    for (let j = 0; j < L; j++) {
      A[i].push(
        Array.from({ length: N }, () => Array.from({ length: N }, () => randInt(0, Q - 1))),
      );
    }
  }
  const s: Vector[] = Array.from({ length: L }, () => sampleSmall(N, ETA));
  const t = blockMatVec(A, s);
  return { A, s, t };
};

const sign = (msg: string, sk: KeyPair, pk: KeyPair): Signature => {
  const trace: TraceEntry[] = [];
  for (let attempt = 1; attempt <= 25; attempt++) {
    const y: Vector[] = Array.from({ length: L }, () =>
      Array.from({ length: N }, () => randInt(-GAMMA1, GAMMA1)),
    );
    const w = blockMatVec(pk.A, y);
    const msgBytes = Array.from(msg).map((ch) => ch.charCodeAt(0));
    const { c } = fakeHash([msgBytes, ...w]);
    const z = blockVecAdd(y, blockVecScalarMul(sk.s, c));

    const allWithinBound = z.every((row) => maxAbs(row) < Z_BOUND);
    if (allWithinBound) {
      trace.push({ attempt, kind: 'accept' });
      return { z, c, attempts: attempt, trace };
    }
    trace.push({ attempt, kind: 'reject' });
  }
  return { z: [new Array(N).fill(0), new Array(N).fill(0)], c: 0, attempts: 25, trace };
};

/** Forge a random signature without knowing the secret. */
const forgeRandom = (): Signature => {
  const z: Vector[] = Array.from({ length: L }, () =>
    Array.from({ length: N }, () => randInt(-Z_BOUND + 1, Z_BOUND - 1)),
  );
  const c = randInt(1, Q - 1);
  return { z, c, attempts: 0, trace: [] };
};

const verify = (msg: string, sig: Signature, pk: KeyPair): boolean => {
  // Recompute w' = A*z - c*t   should equal A*y (if z was honest)
  const Az = blockMatVec(pk.A, sig.z);
  const ct = blockVecScalarMul(pk.t, sig.c);
  const wPrime = blockVecSub(Az, ct);

  const msgBytes = Array.from(msg).map((ch) => ch.charCodeAt(0));
  const { c: cPrime } = fakeHash([msgBytes, ...wPrime]);

  const cMatch = cPrime === sig.c;
  const bound = sig.z.every((row) => maxAbs(row) < Z_BOUND);
  return cMatch && bound;
};

const fmt = (v: number) => {
  const c = centeredMod(v, Q);
  return c > 0 ? `+${c}` : `${c}`;
};

const MLDSASimulator: React.FC = () => {
  const t = useT();
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [signature, setSignature] = useState<Signature | null>(null);
  const [msg, setMsg] = useState('hola');
  const [tampered, setTampered] = useState('hola');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [showA, setShowA] = useState(false);

  const [attackAttempts, setAttackAttempts] = useState(0);
  const [attackPassed, setAttackPassed] = useState(0);
  const [lastForgery, setLastForgery] = useState<Signature | null>(null);
  const [lastForgeryOk, setLastForgeryOk] = useState<boolean | null>(null);

  const generate = () => {
    setKeys(genKeys());
    setSignature(null);
    setVerifyResult(null);
  };

  const doSign = () => {
    if (!keys) return;
    const sig = sign(msg, keys, keys);
    setSignature(sig);
    setTampered(msg);
    setVerifyResult(null);
  };

  const doVerify = () => {
    if (!keys || !signature) return;
    setVerifyResult(verify(tampered, signature, keys));
  };

  const tryForge = (times: number) => {
    if (!keys) return;
    let passed = 0;
    let lastSig: Signature | null = null;
    let lastOk: boolean | null = null;
    for (let i = 0; i < times; i++) {
      const fake = forgeRandom();
      const ok = verify(msg, fake, keys);
      if (ok) passed += 1;
      lastSig = fake;
      lastOk = ok;
    }
    setAttackAttempts((a) => a + times);
    setAttackPassed((p) => p + passed);
    setLastForgery(lastSig);
    setLastForgeryOk(lastOk);
  };

  const resetAttacker = () => {
    setAttackAttempts(0);
    setAttackPassed(0);
    setLastForgery(null);
    setLastForgeryOk(null);
  };

  return (
    <div className="space-y-6">
      {/* Params strip */}
      <div className="rounded-2xl border border-quantum-border bg-quantum-panel/40 p-4 flex flex-wrap gap-4 text-xs font-mono">
        <span className="text-quantum-fg-mute">
          q = <span className="text-quantum-cyan">{Q}</span>
        </span>
        <span className="text-quantum-fg-mute">
          n = <span className="text-quantum-cyan">{N}</span>
        </span>
        <span className="text-quantum-fg-mute">
          (k, l) = <span className="text-quantum-cyan">({K}, {L})</span>
        </span>
        <span className="text-quantum-fg-mute">
          η = <span className="text-quantum-cyan">{ETA}</span>
        </span>
        <span className="text-quantum-fg-mute">
          τ = <span className="text-quantum-cyan">{TAU}</span>
        </span>
        <span className="text-quantum-fg-mute">
          γ₁ = <span className="text-quantum-cyan">{GAMMA1}</span>
        </span>
        <span className="text-quantum-fg-mute">
          β = <span className="text-quantum-cyan">{BETA}</span>
        </span>
      </div>

      {/* Step 1 — Keygen */}
      <div className="card-quantum p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
            <KeyRound size={18} />
          </div>
          <h4 className="font-display text-lg font-semibold text-quantum-fg-strong">
            {t('mldsa.sim.keygen')}
          </h4>
          <button onClick={generate} className="btn-ghost text-sm ml-auto">
            <RefreshCw size={14} /> {t('mldsa.sim.generate')}
          </button>
        </div>

        {keys ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4">
              <div className="text-xs uppercase tracking-widest text-quantum-mint mb-2">
                {t('mldsa.sim.sk')} · s
              </div>
              <pre className="text-sm font-mono text-quantum-fg-strong leading-relaxed">
                {keys.s.map((row, i) => `s${i} = [${row.map(fmt).join(', ')}]`).join('\n')}
              </pre>
            </div>
            <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-quantum-violet">
                  {t('mldsa.sim.pk')} · (A, t)
                </span>
                <button
                  onClick={() => setShowA((s) => !s)}
                  className="ml-auto text-xs text-quantum-fg-mute hover:text-quantum-cyan flex items-center gap-1"
                >
                  {showA ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {showA ? t('mldsa.sim.hideA') : t('mldsa.sim.showA')}
                </button>
              </div>
              <pre className="text-sm font-mono text-quantum-fg-strong leading-relaxed">
                {keys.t.map((row, i) => `t${i} = [${row.map((v) => mod(v, Q)).join(', ')}]`).join('\n')}
              </pre>
              <AnimatePresence>
                {showA && (
                  <motion.pre
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-[11px] font-mono text-quantum-fg-soft overflow-hidden"
                  >
                    {keys.A.map((row, i) =>
                      row
                        .map(
                          (m, j) =>
                            `A[${i}][${j}] = [\n  [${m[0].join(', ')}],\n  [${m[1].join(', ')}]\n]`,
                        )
                        .join('\n'),
                    ).join('\n')}
                  </motion.pre>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <p className="text-quantum-fg-soft text-sm">
            {t('mldsa.sim.keygen.empty')}
          </p>
        )}
      </div>

      {/* Step 2 — Sign */}
      <div className="card-quantum p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
            <Edit3 size={18} />
          </div>
          <h4 className="font-display text-lg font-semibold text-quantum-fg-strong">
            {t('mldsa.sim.sign')}
          </h4>
        </div>

        <div className="grid md:grid-cols-[1fr,auto] gap-3 mb-4 items-stretch">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={t('mldsa.sim.message.placeholder')}
            className="bg-quantum-panel/40 border border-quantum-border rounded-xl px-4 py-2.5 text-quantum-fg-strong placeholder:text-quantum-fg-mute focus:outline-none focus:border-quantum-cyan/60"
          />
          <button onClick={doSign} disabled={!keys} className="btn-quantum disabled:opacity-40">
            {t('mldsa.sim.signAction')}
          </button>
        </div>

        {signature ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4">
              <div className="text-xs uppercase tracking-widest text-quantum-violet mb-2">
                {t('mldsa.sim.signature')} (z, c)
              </div>
              <pre className="text-sm font-mono text-quantum-fg-strong leading-relaxed">
                {signature.z.map((row, i) => `z${i} = [${row.map(fmt).join(', ')}]`).join('\n')}
                {'\n'}c = {signature.c}
              </pre>
            </div>
            <div className="rounded-xl border border-quantum-amber/30 bg-quantum-amber/5 p-4">
              <div className="text-xs uppercase tracking-widest text-quantum-amber mb-2">
                {t('mldsa.sim.rejection')} · {signature.attempts}
              </div>
              <pre className="text-xs font-mono text-quantum-fg-soft leading-relaxed whitespace-pre-wrap">
                {signature.trace
                  .map(
                    (e) =>
                      `${t('mldsa.sim.trace.attempt')} ${e.attempt}: ${
                        e.kind === 'accept'
                          ? t('mldsa.sim.trace.accept')
                          : t('mldsa.sim.trace.reject')
                      }`,
                  )
                  .join('\n')}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-quantum-fg-soft text-sm">{t('mldsa.sim.sign.empty')}</p>
        )}
      </div>

      {/* Step 3 — Verify */}
      <div className="card-quantum p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-quantum-pink/10 text-quantum-pink">
            <ShieldCheck size={18} />
          </div>
          <h4 className="font-display text-lg font-semibold text-quantum-fg-strong">
            {t('mldsa.sim.verify')}
          </h4>
        </div>

        <div className="grid md:grid-cols-[1fr,auto] gap-3 mb-4 items-stretch">
          <input
            value={tampered}
            onChange={(e) => setTampered(e.target.value)}
            placeholder={t('mldsa.sim.verify.placeholder')}
            className="bg-quantum-panel/40 border border-quantum-border rounded-xl px-4 py-2.5 text-quantum-fg-strong placeholder:text-quantum-fg-mute focus:outline-none focus:border-quantum-cyan/60"
          />
          <button
            onClick={doVerify}
            disabled={!signature}
            className="btn-quantum disabled:opacity-40"
          >
            {t('mldsa.sim.verifyAction')}
          </button>
        </div>

        <p className="text-xs text-quantum-fg-mute mb-3">
          {t('mldsa.sim.verify.hint')}
        </p>

        {verifyResult !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-4 flex items-start gap-3 ${
              verifyResult
                ? 'border-quantum-mint/40 bg-quantum-mint/5'
                : 'border-quantum-rose/40 bg-quantum-rose/5'
            }`}
          >
            {verifyResult ? (
              <CheckCircle2 className="text-quantum-mint shrink-0" />
            ) : (
              <XCircle className="text-quantum-rose shrink-0" />
            )}
            <div>
              <div
                className={`font-display font-semibold ${
                  verifyResult ? 'text-quantum-mint' : 'text-quantum-rose'
                }`}
              >
                {verifyResult ? t('mldsa.sim.verify.ok') : t('mldsa.sim.verify.fail')}
              </div>
              <div className="text-sm text-quantum-fg-soft">
                {verifyResult
                  ? t('mldsa.sim.verify.ok.desc')
                  : t('mldsa.sim.verify.fail.desc')}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Step 4 — Attacker mode */}
      <div className="card-quantum p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-quantum-rose/10 text-quantum-rose">
            <Swords size={18} />
          </div>
          <h4 className="font-display text-lg font-semibold text-quantum-fg-strong">
            {t('mldsa.sim.attacker.title')}
          </h4>
        </div>

        {keys && signature ? (
          <>
            <p className="text-sm text-quantum-fg-soft mb-4">
              {t('mldsa.sim.attacker.lead')}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => tryForge(1)}
                className="px-4 py-2 rounded-full text-sm font-medium border border-quantum-rose/50 bg-quantum-rose/10 text-quantum-rose hover:bg-quantum-rose/20 transition-all inline-flex items-center gap-2"
              >
                <Zap size={14} /> {t('mldsa.sim.attacker.tryOne')}
              </button>
              <button
                onClick={() => tryForge(1000)}
                className="px-4 py-2 rounded-full text-sm font-medium border border-quantum-rose/50 bg-quantum-rose/10 text-quantum-rose hover:bg-quantum-rose/20 transition-all inline-flex items-center gap-2"
              >
                <Swords size={14} /> {t('mldsa.sim.attacker.tryMany')}
              </button>
              <button
                onClick={resetAttacker}
                className="px-4 py-2 rounded-full text-sm font-medium border border-quantum-border bg-quantum-panel/40 text-quantum-fg-soft hover:text-quantum-fg-strong hover:border-quantum-cyan/40 transition-all inline-flex items-center gap-2"
              >
                <RotateCcw size={14} /> {t('mldsa.sim.attacker.reset')}
              </button>
            </div>

            {attackAttempts > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4 text-center">
                  <div className="text-[10px] uppercase tracking-widest text-quantum-fg-mute mb-1">
                    {t('mldsa.sim.attacker.attempts')}
                  </div>
                  <div className="font-display text-2xl font-bold text-quantum-fg-strong">
                    {attackAttempts.toLocaleString()}
                  </div>
                </div>
                <div
                  className={`rounded-xl border p-4 text-center ${
                    attackPassed > 0
                      ? 'border-quantum-rose/40 bg-quantum-rose/5'
                      : 'border-quantum-mint/40 bg-quantum-mint/5'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest text-quantum-fg-mute mb-1">
                    {t('mldsa.sim.attacker.passed')}
                  </div>
                  <div
                    className={`font-display text-2xl font-bold ${
                      attackPassed > 0 ? 'text-quantum-rose' : 'text-quantum-mint'
                    }`}
                  >
                    {attackPassed}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-quantum-fg-soft text-sm mb-4">
                {t('mldsa.sim.attacker.empty')}
              </p>
            )}

            {lastForgery && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                key={attackAttempts}
                className="rounded-xl border border-quantum-border bg-quantum-panel/30 p-4 mb-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-quantum-fg-mute">
                    {t('mldsa.sim.signature')} (z, c)
                  </span>
                  {lastForgeryOk !== null && (
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest ml-auto ${
                        lastForgeryOk ? 'text-quantum-rose' : 'text-quantum-mint'
                      }`}
                    >
                      {lastForgeryOk
                        ? t('mldsa.sim.verify.ok')
                        : t('mldsa.sim.verify.fail')}
                    </span>
                  )}
                </div>
                <pre className="text-xs font-mono text-quantum-fg-soft leading-relaxed">
                  {lastForgery.z
                    .map((row, i) => `z${i} = [${row.map(fmt).join(', ')}]`)
                    .join('\n')}
                  {'\n'}c = {lastForgery.c}
                </pre>
              </motion.div>
            )}

            <p className="text-xs text-quantum-fg-mute leading-relaxed">
              {t('mldsa.sim.attacker.conclusion')}
            </p>
          </>
        ) : (
          <p className="text-quantum-fg-soft text-sm">
            {t('mldsa.sim.attacker.needKeys')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MLDSASimulator;
