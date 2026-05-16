import { useEffect, useRef } from 'react';

/**
 * Ambient constellation: a permanent decorative background of moving particles
 * connected with lines, tinted blue→pink. Lives behind all content at a low,
 * constant opacity. No fade-in or fade-out — it just is there.
 */
const RouteTransition: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none constellation-bg"
      style={{ opacity: 0.55 }}
    >
      <ConstellationCanvas />
      <div className="absolute inset-0 constellation-gradient" />
    </div>
  );
};

const ConstellationCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let pts: P[] = [];

    const readVar = (name: string): [number, number, number] => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const parts = v.split(/\s+/).map((n) => parseInt(n, 10));
      if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
        return [parts[0], parts[1], parts[2]];
      }
      return [128, 128, 255];
    };

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pts = Array.from({ length: 100 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
        hue: Math.random(),
      }));
    };

    const draw = () => {
      const [br, bg, bb] = readVar('--blue');
      const [pr, pg, pb] = readVar('--pink');
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const r = Math.round(br * (1 - p.hue) + pr * p.hue);
        const g = Math.round(bg * (1 - p.hue) + pg * p.hue);
        const b = Math.round(bb * (1 - p.hue) + pb * p.hue);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const a = 1 - d2 / (140 * 140);
            const mh = (p.hue + q.hue) / 2;
            const r2 = Math.round(br * (1 - mh) + pr * mh);
            const g2 = Math.round(bg * (1 - mh) + pg * mh);
            const b2 = Math.round(bb * (1 - mh) + pb * mh);
            ctx.strokeStyle = `rgba(${r2}, ${g2}, ${b2}, ${a * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    init();
    draw();

    const onResize = () => {
      cancelAnimationFrame(raf);
      init();
      draw();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
};

export default RouteTransition;
