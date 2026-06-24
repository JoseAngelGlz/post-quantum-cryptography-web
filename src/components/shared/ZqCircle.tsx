import { useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n';

interface ZqCircleProps {
  q?: number;
  size?: number;
}

// Visualización interactiva del anillo Z_q para el código corrector de ML-KEM.
// El usuario elige un bit (0 ó 1) y un ruido; el canvas muestra si el decodificador
// recupera el bit correctamente según el umbral q/4.
const ZqCircle: React.FC<ZqCircleProps> = ({ q = 17, size = 320 }) => {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bit, setBit] = useState<0 | 1>(1);
  const [noise, setNoise] = useState(0);

  // El bit 0 se codifica en 0; el bit 1 en ⌈q/2⌉
  const target = bit === 0 ? 0 : Math.ceil(q / 2);
  const value = ((target + noise) % q + q) % q;
  const distTo0 = Math.min(value, q - value);
  const distTo1 = Math.min(Math.abs(value - Math.ceil(q / 2)), q - Math.abs(value - Math.ceil(q / 2)));
  const decoded = distTo0 < distTo1 ? 0 : 1;
  const correct = decoded === bit;

  // Redibuja el canvas en cada cambio de bit, ruido o dimensiones
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

    // ── Círculo exterior ──
    ctx.strokeStyle = 'rgba(148,163,184,0.20)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    const half = Math.ceil(q / 2);
    // Convierte índice entero de Z_q a ángulo en radianes (0 en la cima)
    const angle = (i: number) => -Math.PI / 2 + (i / q) * Math.PI * 2;

    // Dibuja un arco coloreado en la zona segura de decodificación
    const drawArc = (from: number, to: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, R, angle(from), angle(to));
      ctx.stroke();
    };
    // Zona verde alrededor de 0 y zona rosa alrededor de q/2
    const w = q / 4;
    drawArc(-w, w, 'rgba(94,234,212,0.5)');
    drawArc(half - w, half + w, 'rgba(244,114,182,0.5)');

    // ── Marcas de cada entero de Z_q ──
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

    // ── Punto que representa el valor actual (verde=correcto, rojo=error) ──
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

    // ── Etiqueta central con Z_q, valor y decodificación ──
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 16px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Z_${q}`, cx, cy - 8);
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillStyle = correct ? '#34d399' : '#fb7185';
    ctx.fillText(`${t('viz.zq.value')} = ${value}`, cx, cy + 12);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${t('viz.zq.decode')} ${decoded}`, cx, cy + 28);
  }, [q, value, correct, decoded, size, t]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="rounded-2xl border border-quantum-border bg-quantum-panel/40" />
      {/* ── Controles: selector de bit y slider de ruido ── */}
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
          <label className="text-xs uppercase tracking-widest text-slate-400">{t('viz.zq.noise')}</label>
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
          ? t('viz.zq.correct')
          : t('viz.zq.incorrect')}
      </p>
    </div>
  );
};

export default ZqCircle;
