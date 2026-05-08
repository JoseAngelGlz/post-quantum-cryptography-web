import { useEffect, useRef, useState } from 'react';

interface LatticeVizProps {
  goodBasis?: boolean;
  showTarget?: boolean;
  size?: number;
}

const LatticeViz: React.FC<LatticeVizProps> = ({
  goodBasis = true,
  showTarget = false,
  size = 360,
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  const goodB1 = { x: 50, y: 0 };
  const goodB2 = { x: 0, y: 50 };
  const badB1 = { x: 50, y: 0 };
  const badB2 = { x: 200, y: 50 };

  const b1 = goodBasis ? goodB1 : badB1;
  const b2 = goodBasis ? goodB2 : badB2;

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

    // grid bg
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

    // axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(size, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, size);
    ctx.stroke();

    // lattice points
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

    // basis vectors from origin
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

    if (target && showTarget) {
      // target dot
      ctx.beginPath();
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 12;
      ctx.arc(target.x, target.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // closest lattice point
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
  }, [b1.x, b1.y, b2.x, b2.y, size, target, showTarget]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTarget({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="inline-block">
      <canvas
        ref={ref}
        onClick={handleClick}
        className={`rounded-xl border border-quantum-border bg-quantum-panel/40 ${
          showTarget ? 'cursor-crosshair' : ''
        }`}
      />
      {showTarget && (
        <p className="mt-2 text-xs text-slate-400 text-center">
          Haz clic en cualquier punto del lienzo · busca el vértice del retículo más cercano
        </p>
      )}
    </div>
  );
};

export default LatticeViz;
