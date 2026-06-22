import { useEffect, useRef, useState } from 'react';

interface LatticeVizProps {
  goodBasis?: boolean;
  showTarget?: boolean;  // activa modo CVP: el usuario puede colocar un punto objetivo
  showShortest?: boolean; // activa modo SVP: resalta el vector más corto
  size?: number;
}

// Visualización de retículo en canvas con soporte para SVP y CVP interactivos
const LatticeViz: React.FC<LatticeVizProps> = ({
  goodBasis = true,
  showTarget = false,
  showShortest = false,
  size = 360,
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  // Vectores base: "buena" base es ortogonal y corta; "mala" es oblicua y larga
  const goodB1 = { x: 50, y: 0 };
  const goodB2 = { x: 0, y: 50 };
  const badB1 = { x: 50, y: 0 };
  const badB2 = { x: 200, y: 50 };

  const b1 = goodBasis ? goodB1 : badB1;
  const b2 = goodBasis ? goodB2 : badB2;

  // Animación de pulso para el indicador de CVP cuando aún no hay punto objetivo
  const [pulseT, setPulseT] = useState(0);
  useEffect(() => {
    if (!showTarget || target) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      setPulseT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [showTarget, target]);

  // Redibuja el canvas en cada cambio de estado relevante
  useEffect(() => {
    const canvas = ref.current;
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

    // ── Cuadrícula de fondo ──
    ctx.strokeStyle = 'rgba(94, 234, 212, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // ── Ejes cartesianos ──
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(size, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, size);
    ctx.stroke();

    // ── Puntos del retículo (combinaciones enteras de b1 y b2) ──
    const pts: { px: number; py: number; ix: number; iy: number }[] = [];
    for (let i = -8; i <= 8; i++) {
      for (let j = -8; j <= 8; j++) {
        const px = cx + i * b1.x + j * b2.x;
        const py = cy - (i * b1.y + j * b2.y);
        if (px >= -10 && px <= size + 10 && py >= -10 && py <= size + 10) {
          pts.push({ px, py, ix: i, iy: j });
        }
      }
    }

    pts.forEach(({ px, py }) => {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(94, 234, 212, 0.85)';
      ctx.shadowColor = 'rgba(94, 234, 212, 0.6)';
      ctx.shadowBlur = 6;
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // ── Vectores base con flecha ──
    const drawArrow = (dx: number, dy: number, color: string) => {
      const tx = cx + dx;
      const ty = cy - dy;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      const ang = Math.atan2(ty - cy, tx - cx);
      const ah = 7;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - ah * Math.cos(ang - Math.PI / 6), ty - ah * Math.sin(ang - Math.PI / 6));
      ctx.lineTo(tx - ah * Math.cos(ang + Math.PI / 6), ty - ah * Math.sin(ang + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };
    drawArrow(b1.x, b1.y, '#f472b6');
    drawArrow(b2.x, b2.y, '#a78bfa');

    // ── SVP: flecha verde al vector no nulo más corto ──
    if (showShortest) {
      let bestPt: typeof pts[number] | null = null;
      let bestD = Infinity;
      for (const p of pts) {
        if (p.ix === 0 && p.iy === 0) continue;
        const d = (p.px - cx) ** 2 + (p.py - cy) ** 2;
        if (d < bestD) {
          bestD = d;
          bestPt = p;
        }
      }
      if (bestPt) {
        ctx.strokeStyle = '#34d399';
        ctx.fillStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(52,211,153,0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bestPt.px, bestPt.py);
        ctx.stroke();
        const ang = Math.atan2(bestPt.py - cy, bestPt.px - cx);
        const ah = 9;
        ctx.beginPath();
        ctx.moveTo(bestPt.px, bestPt.py);
        ctx.lineTo(bestPt.px - ah * Math.cos(ang - Math.PI / 6), bestPt.py - ah * Math.sin(ang - Math.PI / 6));
        ctx.lineTo(bestPt.px - ah * Math.cos(ang + Math.PI / 6), bestPt.py - ah * Math.sin(ang + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bestPt.px, bestPt.py, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Etiqueta con la norma λ₁
        const midX = (cx + bestPt.px) / 2;
        const midY = (cy + bestPt.py) / 2;
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const dist = Math.sqrt(bestD).toFixed(0);
        ctx.fillText(`λ₁ = ${dist}`, midX + 14, midY - 10);
      }
    }

    // ── CVP: anillo pulsante de sugerencia cuando no hay punto objetivo ──
    if (showTarget && !target) {
      const pulse = 0.35 + 0.25 * Math.sin(pulseT * 2.4);
      const hintX = size * 0.7;
      const hintY = size * 0.3;
      ctx.strokeStyle = `rgba(251, 191, 36, ${pulse})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(hintX, hintY, 18 + pulse * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = `rgba(251, 191, 36, ${pulse + 0.2})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hintX - 9, hintY);
      ctx.lineTo(hintX + 9, hintY);
      ctx.moveTo(hintX, hintY - 9);
      ctx.lineTo(hintX, hintY + 9);
      ctx.stroke();
    }

    // ── CVP: punto objetivo y línea al punto del retículo más cercano ──
    if (target && showTarget) {
      ctx.beginPath();
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 12;
      ctx.arc(target.x, target.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      let best = pts[0];
      let bestD = Infinity;
      for (const p of pts) {
        const d = (p.px - target.x) ** 2 + (p.py - target.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(target.x, target.y);
      ctx.lineTo(best.px, best.py);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.arc(best.px, best.py, 7, 0, Math.PI * 2);
      ctx.stroke();
    }

    // ── Preview del cursor cuando se mueve sobre el canvas en modo CVP ──
    if (showTarget && hover && !target) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.55)';
      ctx.beginPath();
      ctx.arc(hover.x, hover.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [b1.x, b1.y, b2.x, b2.y, size, target, showTarget, showShortest, pulseT, hover]);

  // Coloca el punto objetivo en la posición del clic (solo en modo CVP)
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTarget({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={ref}
          onClick={handleClick}
          onMouseLeave={() => setHover(null)}
          className={`rounded-xl border bg-quantum-panel/40 transition-colors ${
            showTarget
              ? `cursor-crosshair ${
                  target
                    ? 'border-quantum-amber/40'
                    : 'border-quantum-amber/70 shadow-[0_0_24px_rgba(251,191,36,0.25)]'
                }`
              : 'border-quantum-border'
          }`}
        />
        {showTarget && target && (
          <button
            type="button"
            onClick={() => setTarget(null)}
            className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-quantum-panel/80 border border-quantum-border text-[10px] text-slate-300 hover:text-quantum-amber hover:border-quantum-amber/60 transition-colors"
          >
            Reiniciar punto
          </button>
        )}
      </div>
      {showTarget && (
        <p className="mt-2 text-xs text-slate-400 text-center">
          {target ? (
            <>
              <span className="text-quantum-amber">●</span> es el punto objetivo;{' '}
              <span className="text-quantum-amber">○</span> el vértice del retículo más cercano.
            </>
          ) : (
            <>
              <span className="text-quantum-amber font-semibold">Haz clic</span> en cualquier
              parte para colocar un punto objetivo · te marcamos el vértice más cercano.
            </>
          )}
        </p>
      )}
      {showShortest && !showTarget && (
        <p className="mt-2 text-xs text-slate-400 text-center">
          La flecha <span className="text-quantum-mint font-semibold">verde</span> es el
          vector no nulo más corto del retículo · su norma es λ₁.
        </p>
      )}
    </div>
  );
};

export default LatticeViz;
