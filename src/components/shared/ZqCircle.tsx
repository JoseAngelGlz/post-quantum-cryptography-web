import { useEffect, useRef, useState } from 'react';

interface ZqCircleProps {
  q?: number;
  size?: number;
}

const ZqCircle: React.FC<ZqCircleProps> = ({ q = 17, size = 320 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bit, setBit] = useState<0 | 1>(1);
  const [noise, setNoise] = useState(0);

  const target = bit === 0 ? 0 : Math.ceil(q / 2);
  const value = ((target + noise) % q + q) % q;
  const distTo0 = Math.min(value, q - value);
  const distTo1 = Math.min(Math.abs(value - Math.ceil(q / 2)), q - Math.abs(value - Math.ceil(q / 2)));
  const decoded = distTo0 < distTo1 ? 0 : 1;
  const correct = decoded === bit;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 30;

    // outer circle
    ctx.strokeStyle = 'rgba(148,163,184,0.20)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // good zones
    const half = Math.ceil(q / 2);
    const angle = (i: number) => -Math.PI / 2 + (i / q) * Math.PI * 2;

    const drawArc = (from: number, to: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, R, angle(from), angle(to));
      ctx.stroke();
    };
    // zone for 0: around 0 ± q/4
    const w = q / 4;
    drawArc(-w, w, 'rgba(94,234,212,0.5)');
    drawArc(half - w, half + w, 'rgba(244,114,182,0.5)');

    // ticks for each integer
    for (let i = 0; i < q; i++) {
      const a = angle(i);
      const x1 = cx + Math.cos(a) * (R - 6);
      const y1 = cy + Math.sin(a) * (R - 6);
      const x2 = cx + Math.cos(a) * (R + 6);
      const y2 = cy + Math.sin(a) * (R + 6);
      ctx.strokeStyle = 'rgba(148,163,184,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (i === 0 || i === half) {
        const tx = cx + Math.cos(a) * (R + 22);
        const ty = cy + Math.sin(a) * (R + 22);
        ctx.fillStyle = i === 0 ? '#5eead4' : '#f472b6';
        ctx.font = 'bold 14px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i === 0 ? `0` : `${half}`, tx, ty);
      }
    }

    // current value
    const va = angle(value);
    const vx = cx + Math.cos(va) * R;
    const vy = cy + Math.sin(va) * R;
    ctx.beginPath();
    ctx.fillStyle = correct ? '#34d399' : '#fb7185';
    ctx.shadowColor = correct ? 'rgba(52,211,153,0.8)' : 'rgba(251,113,133,0.8)';
    ctx.shadowBlur = 14;
    ctx.arc(vx, vy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // center label
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 16px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Z_${q}`, cx, cy - 8);
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillStyle = correct ? '#34d399' : '#fb7185';
    ctx.fillText(`valor = ${value}`, cx, cy + 12);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`decodifica → ${decoded}`, cx, cy + 28);
  }, [q, value, correct, decoded, size]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="rounded-2xl border border-quantum-border bg-quantum-panel/40" />
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex gap-2">
          <button
            onClick={() => setBit(0)}
            className={`px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all ${
              bit === 0
                ? 'border-quantum-cyan bg-quantum-cyan/10 text-quantum-cyan'
                : 'border-quantum-border text-slate-400 hover:text-slate-200'
            }`}
          >
            bit = 0
          </button>
          <button
            onClick={() => setBit(1)}
            className={`px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all ${
              bit === 1
                ? 'border-quantum-pink bg-quantum-pink/10 text-quantum-pink'
                : 'border-quantum-border text-slate-400 hover:text-slate-200'
            }`}
          >
            bit = 1
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-widest text-slate-400">ruido</label>
          <input
            type="range"
            min={-Math.floor(q / 2)}
            max={Math.floor(q / 2)}
            value={noise}
            onChange={(e) => setNoise(parseInt(e.target.value, 10))}
            className="accent-quantum-cyan"
          />
          <span className="font-mono text-sm w-10 text-center text-slate-200">
            {noise > 0 ? `+${noise}` : noise}
          </span>
        </div>
      </div>
      <p className={`text-sm font-medium ${correct ? 'text-quantum-mint' : 'text-quantum-rose'}`}>
        {correct
          ? '✓ Decodificación correcta · el ruido cabe dentro del margen q/4'
          : '✗ Decodificación errónea · el ruido cruzó la frontera'}
      </p>
    </div>
  );
};

export default ZqCircle;
