import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Shuffle, Eye, EyeOff } from 'lucide-react';
import KMath from './Math';

const Q = 11; // pequeño y bonito para la visualización

const randInt = (n: number) => Math.floor(Math.random() * n);
const mod = (a: number, n: number) => ((a % n) + n) % n;
const centered = (a: number, n: number) => {
  const r = mod(a, n);
  return r > n / 2 ? r - n : r;
};

interface Seed {
  a: [number, number];
  noiseFactor: number; // ∈ [0, 1), reused to derive e from eta
}

interface Sample {
  a: [number, number];
  b: number;
  e: number;
}

const makeSeed = (): Seed => ({
  a: [randInt(Q), randInt(Q)],
  noiseFactor: Math.random(),
});

const seedToSample = (seed: Seed, s: [number, number], eta: number): Sample => {
  const e = eta === 0 ? 0 : Math.floor(seed.noiseFactor * (2 * eta + 1)) - eta;
  return {
    a: seed.a,
    e,
    b: mod(seed.a[0] * s[0] + seed.a[1] * s[1] + e, Q),
  };
};

const INITIAL_SECRET: [number, number] = [4, 7];

const LWENoisePlayground: React.FC = () => {
  const [secret, setSecret] = useState<[number, number]>(INITIAL_SECRET);
  const [eta, setEta] = useState(0);
  const [seeds, setSeeds] = useState<Seed[]>(() => [
    makeSeed(),
    makeSeed(),
    makeSeed(),
  ]);
  const [showSecret, setShowSecret] = useState(true);

  // Derive samples from seeds + current secret + eta.
  const samples = useMemo<Sample[]>(
    () => seeds.map((seed) => seedToSample(seed, secret, eta)),
    [seeds, secret, eta],
  );

  const addSample = () => {
    setSeeds((prev) => [...prev, makeSeed()]);
  };

  const reset = () => {
    setSeeds([makeSeed(), makeSeed(), makeSeed()]);
  };

  const randomSecret = () => {
    setSecret([randInt(Q), randInt(Q)]);
  };

  // For every candidate s* in Z_q^2, compute the worst-case |residual|
  const grid = useMemo(() => {
    const g: { fit: number; consistent: boolean }[][] = [];
    for (let y = 0; y < Q; y++) {
      const row: { fit: number; consistent: boolean }[] = [];
      for (let x = 0; x < Q; x++) {
        if (samples.length === 0) {
          row.push({ fit: 0, consistent: true });
          continue;
        }
        let worst = 0;
        for (const sample of samples) {
          const expected = mod(sample.a[0] * x + sample.a[1] * y, Q);
          const diff = Math.abs(centered(sample.b - expected, Q));
          if (diff > worst) worst = diff;
        }
        row.push({ fit: worst, consistent: worst <= eta });
      }
      g.push(row);
    }
    return g;
  }, [samples, eta]);

  const consistentCount = grid
    .flat()
    .filter((c) => c.consistent && samples.length > 0).length;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const CELL = 32;
  const PADX = 30;
  const PADY = 30;
  const W = Q * CELL + PADX * 2;
  const H = Q * CELL + PADY * 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // axes labels
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let x = 0; x < Q; x++) {
      ctx.fillText(`${x}`, PADX + x * CELL + CELL / 2, PADY - 12);
    }
    ctx.textAlign = 'right';
    for (let y = 0; y < Q; y++) {
      ctx.fillText(`${y}`, PADX - 8, PADY + y * CELL + CELL / 2);
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.fillText('s₁', PADX + (Q * CELL) / 2, 10);
    ctx.save();
    ctx.translate(10, PADY + (Q * CELL) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('s₂', 0, 0);
    ctx.restore();

    // cells
    for (let y = 0; y < Q; y++) {
      for (let x = 0; x < Q; x++) {
        const c = grid[y][x];
        const cellX = PADX + x * CELL;
        const cellY = PADY + y * CELL;
        if (samples.length === 0) {
          ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
        } else if (c.consistent) {
          // greenish for consistent
          const intensity = eta > 0 ? 1 - c.fit / Math.max(eta, 1) : 1;
          ctx.fillStyle = `rgba(52, 211, 153, ${0.25 + intensity * 0.45})`;
        } else {
          // red gradient
          const overflow = Math.min((c.fit - eta) / Math.max(Q / 2 - eta, 1), 1);
          ctx.fillStyle = `rgba(244, 63, 94, ${0.05 + (1 - overflow) * 0.15})`;
        }
        ctx.fillRect(cellX + 1, cellY + 1, CELL - 2, CELL - 2);

        // border
        ctx.strokeStyle = 'rgba(148,163,184,0.08)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX + 0.5, cellY + 0.5, CELL, CELL);

        // small fit value
        if (samples.length > 0 && c.fit <= 4) {
          ctx.fillStyle = c.consistent
            ? 'rgba(15, 23, 42, 0.7)'
            : 'rgba(148, 163, 184, 0.5)';
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${c.fit}`, cellX + CELL / 2, cellY + CELL / 2);
        }
      }
    }

    // true secret marker
    if (showSecret) {
      const sx = PADX + secret[0] * CELL + CELL / 2;
      const sy = PADY + secret[1] * CELL + CELL / 2;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [grid, secret, showSecret, eta, samples.length, W, H]);

  return (
    <div className="card-quantum p-5 md:p-7 my-10">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-quantum-cyan font-mono mb-1">
            Playground
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold text-slate-100">
            LWE en directo · juega con el ruido
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Cada muestra es{' '}
            <KMath>{`b_i = \\mathbf{a}_i \\cdot \\mathbf{s} + e_i \\pmod{q}`}</KMath> con{' '}
            <KMath>{`q = 11`}</KMath>. Sube el ruido y observa cómo deja de existir un único{' '}
            <KMath>{`\\mathbf{s}`}</KMath> consistente.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSecret((s) => !s)}
            title="Mostrar/ocultar secreto"
            className="p-2 rounded-lg border border-quantum-border text-slate-300 hover:border-quantum-cyan/60 hover:text-quantum-cyan transition-all"
          >
            {showSecret ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={randomSecret}
            title="Nuevo secreto"
            className="p-2 rounded-lg border border-quantum-border text-slate-300 hover:border-quantum-violet/60 hover:text-quantum-violet transition-all"
          >
            <Shuffle size={14} />
          </button>
          <button
            onClick={reset}
            title="Reiniciar muestras"
            className="p-2 rounded-lg border border-quantum-border text-slate-300 hover:border-quantum-rose/60 hover:text-quantum-rose transition-all"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[auto,1fr] gap-6 items-start">
        {/* Visualization */}
        <div>
          <div className="overflow-auto inline-block rounded-xl bg-quantum-panel/40 border border-quantum-border p-2">
            <canvas ref={canvasRef} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-quantum-mint/60 inline-block" />
              Compatible (|residual| ≤ η)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-quantum-rose/30 inline-block" />
              Incompatible
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-quantum-amber inline-block" />
              Secreto real
            </div>
          </div>
        </div>

        {/* Controls + samples */}
        <div className="space-y-5 min-w-0">
          {/* secret + noise */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                Secreto <KMath>{`\\mathbf{s}`}</KMath>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 w-6">s₁</span>
                <input
                  type="range"
                  min={0}
                  max={Q - 1}
                  value={secret[0]}
                  onChange={(e) =>
                    setSecret([parseInt(e.target.value, 10), secret[1]])
                  }
                  className="flex-1 accent-quantum-cyan"
                />
                <span className="font-mono w-6 text-quantum-cyan text-right">
                  {showSecret ? secret[0] : '?'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-2">
                <span className="text-slate-400 w-6">s₂</span>
                <input
                  type="range"
                  min={0}
                  max={Q - 1}
                  value={secret[1]}
                  onChange={(e) =>
                    setSecret([secret[0], parseInt(e.target.value, 10)])
                  }
                  className="flex-1 accent-quantum-cyan"
                />
                <span className="font-mono w-6 text-quantum-cyan text-right">
                  {showSecret ? secret[1] : '?'}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  Ruido permitido η
                </span>
                <span className="font-mono text-quantum-violet text-sm">±{eta}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={eta}
                onChange={(e) => setEta(parseInt(e.target.value, 10))}
                className="w-full accent-quantum-violet"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                {eta === 0
                  ? 'Sin ruido: LWE colapsa a álgebra lineal.'
                  : eta <= 1
                  ? 'Ruido pequeño: pocas soluciones compatibles.'
                  : eta <= 3
                  ? 'Ruido medio: la solución se desdibuja.'
                  : 'Ruido alto: media red de candidatos.'}
              </div>
            </div>
          </div>

          {/* metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Muestras
              </div>
              <div className="font-mono text-quantum-cyan font-semibold">
                {samples.length}
              </div>
            </div>
            <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Candidatos
              </div>
              <div className="font-mono text-quantum-violet font-semibold">
                {consistentCount}
              </div>
            </div>
            <div className="rounded-lg border border-quantum-border bg-quantum-panel/40 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Espacio
              </div>
              <div className="font-mono text-slate-300 font-semibold">{Q * Q}</div>
            </div>
          </div>

          {/* Samples */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Muestras
              </div>
              <button
                onClick={addSample}
                className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-quantum-cyan/10 border border-quantum-cyan/40 text-quantum-cyan hover:bg-quantum-cyan/20 transition-all"
              >
                <Plus size={12} /> Añadir
              </button>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {samples.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-xs font-mono px-2.5 py-1.5 rounded-md bg-quantum-panel/40 border border-quantum-border"
                >
                  <span className="text-slate-500 w-5">#{i + 1}</span>
                  <span className="text-slate-300">
                    {s.a[0]}·s₁ + {s.a[1]}·s₂{' '}
                    {s.e === 0 ? (
                      <span className="text-slate-500">+ 0</span>
                    ) : s.e > 0 ? (
                      <span className="text-quantum-violet">+ {s.e}</span>
                    ) : (
                      <span className="text-quantum-violet">− {-s.e}</span>
                    )}
                  </span>
                  <span className="text-slate-500">≡</span>
                  <span className="text-quantum-cyan">{s.b}</span>
                  <span className="text-slate-500">mod 11</span>
                </motion.div>
              ))}
              {samples.length === 0 && (
                <p className="text-xs text-slate-500 italic">
                  Pulsa "añadir" para generar tu primera muestra.
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Con <KMath>{`\\eta = 0`}</KMath> y suficientes muestras solo un{' '}
            <KMath>{`\\mathbf{s}`}</KMath> encaja: eso es eliminación gaussiana. En cuanto
            sube el ruido, decenas de candidatos pasan el filtro. En dimensión real (no 2)
            ese "halo" es lo bastante grande como para que ni un ordenador cuántico sepa
            por dónde empezar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LWENoisePlayground;
