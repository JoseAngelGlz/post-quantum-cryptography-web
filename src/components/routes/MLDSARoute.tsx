import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Edit3,
  Eye,
  EyeOff,
  FileSignature,
  Filter,
  KeyRound,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import Callout from '../shared/Callout';
import QuickQuiz from '../shared/QuickQuiz';
import FeedbackForm from '../shared/FeedbackForm';
import Math from '../shared/Math';
import MLDSASimulator from '../MLDSASimulator';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';
import { useRouteTracking } from '../../hooks/useRouteTracking';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { TranslationKey } from '../../i18n/translations';

type TFn = (key: TranslationKey) => string;

interface RouteProps {
  onChange: (r: RouteId) => void;
}

/* ─── Rejection sampling histogram (decorative) ─── */
const DistHistogram: React.FC<{ shift?: number; color: string; label: string }> = ({
  shift = 0,
  color,
  label,
}) => {
  const bars = Array.from({ length: 21 }, (_, i) => {
    const x = i - 10 - shift;
    // Gaussian-ish
    const h = globalThis.Math.exp(-(x * x) / 20);
    return globalThis.Math.round(h * 100);
  });
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-[2px] h-24">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${globalThis.Math.max(h, 4)}%`,
              background: `linear-gradient(180deg, ${color}, ${color}55)`,
              boxShadow: `0 0 6px ${color}55`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] font-mono text-quantum-fg-mute">
        <span>−γ₁</span>
        <span>0</span>
        <span>+γ₁</span>
      </div>
      <div className="text-[10px] uppercase tracking-widest text-center text-quantum-fg-mute">
        {label}
      </div>
    </div>
  );
};

/* ─── HighBits / LowBits decomposition visual ─── */
const HighLowViz: React.FC<{ t: TFn }> = ({ t }) => {
  const marks = [0, 1, 2, 3, 4, 5];
  const wPos = 3.65; // arbitrary coefficient position (between 3α and 4α)
  const highIdx = globalThis.Math.floor(wPos);
  return (
    <div className="space-y-5">
      {/* ruler */}
      <div className="relative h-24">
        {/* axis */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-quantum-border" />
        {/* tick marks */}
        {marks.map((m) => (
          <div
            key={m}
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${(m / 5) * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-px h-3 bg-quantum-fg-mute" />
            <div className="text-[10px] font-mono text-quantum-fg-mute mt-1">
              {m === 0 ? '0' : `${m}α`}
            </div>
          </div>
        ))}
        {/* HighBits region highlight */}
        <div
          className="absolute top-[calc(50%-22px)] h-8 rounded-md border border-quantum-cyan/40 bg-quantum-cyan/10"
          style={{
            left: `${(highIdx / 5) * 100}%`,
            width: `${(1 / 5) * 100}%`,
          }}
        />
        {/* marker for w */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ left: `${(wPos / 5) * 100}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-3 h-3 rounded-full bg-quantum-amber border-2 border-quantum-bg shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          <div className="text-[10px] font-mono text-quantum-amber mt-1 whitespace-nowrap">
            w
          </div>
        </div>
        {/* LowBits arrow from highBits boundary to w */}
        <div
          className="absolute top-[calc(50%-32px)] h-3 border-l border-r border-t border-dashed border-quantum-pink/60"
          style={{
            left: `${(highIdx / 5) * 100}%`,
            width: `${((wPos - highIdx) / 5) * 100}%`,
          }}
        />
      </div>

      {/* legend */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-quantum-cyan/40 bg-quantum-cyan/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-sm bg-quantum-cyan" />
            <span className="font-mono text-quantum-cyan font-semibold">HighBits</span>
            <span className="font-mono text-quantum-fg-mute ml-auto">= {highIdx}</span>
          </div>
          <p className="text-[11px] text-quantum-fg-soft leading-snug">
            {t('mldsa.s03c.viz.high')}
          </p>
        </div>
        <div className="rounded-lg border border-quantum-pink/40 bg-quantum-pink/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-sm bg-quantum-pink" />
            <span className="font-mono text-quantum-pink font-semibold">LowBits</span>
            <span className="font-mono text-quantum-fg-mute ml-auto">
              ≈ {(wPos - highIdx).toFixed(2)}α
            </span>
          </div>
          <p className="text-[11px] text-quantum-fg-soft leading-snug">
            {t('mldsa.s03c.viz.low')}
          </p>
        </div>
      </div>
    </div>
  );
};

// Ruta de ML-DSA: presenta Module-SIS, rejection sampling, HighBits/LowBits,
// el proceso de firma/verificación y el simulador interactivo Baby-Dilithium
const MLDSARoute: React.FC<RouteProps> = ({ onChange: _onChange }) => {
  const t = useT();
  const { simulatorUsed } = useAnalytics();
  useRouteTracking('mldsa');

  // Registra el uso del simulador ML-DSA en analytics la primera vez que interactúa
  const handleSimulatorInteraction = () => {
    simulatorUsed('SimMLDSA');
  };

  const params = [
    { variant: 'ML-DSA-44', sec: '≈ AES-128', k: 4, l: 4 },
    { variant: 'ML-DSA-65', sec: '≈ AES-192', k: 6, l: 5 },
    { variant: 'ML-DSA-87', sec: '≈ AES-256', k: 8, l: 7 },
  ];

  return (
    <div>
      <Hero
        eyebrow={t('mldsa.hero.eyebrow')}
        hueA={260}
        hueB={320}
        title={
          <>
            <span className="text-gradient-quantum">ML-DSA</span>
            <br />
            {t('mldsa.hero.titleLine2')}
          </>
        }
        subtitle={t('mldsa.hero.subtitle')}
        onBack={() => _onChange('mlkem')}
      />

      {/* OVERVIEW */}
      <ScrollSection eyebrow={t('mldsa.s01.eyebrow')} title={t('mldsa.s01.title')}>
        <p className="text-quantum-fg leading-relaxed text-[17px] mb-8 max-w-3xl">
          {t('mldsa.s01.lead')}
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              n: '01',
              op: 'KeyGen()',
              produces: '(pk, sk)',
              who: t('mldsa.actor.signer'),
              icon: <KeyRound size={22} />,
              color: 'text-quantum-cyan',
            },
            {
              n: '02',
              op: 'Sign(sk, m)',
              produces: 'σ = (z, c)',
              who: t('mldsa.actor.signer'),
              icon: <Edit3 size={22} />,
              color: 'text-quantum-violet',
            },
            {
              n: '03',
              op: 'Verify(pk, m, σ)',
              produces: '{0, 1}',
              who: t('mldsa.actor.verifier'),
              icon: <ShieldCheck size={22} />,
              color: 'text-quantum-pink',
            },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-quantum p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-quantum-fg-mute">{s.n}</span>
                <span className={s.color}>{s.icon}</span>
              </div>
              <div className="font-mono font-bold text-quantum-fg-strong text-lg mb-1">{s.op}</div>
              <div className="text-sm text-quantum-fg-soft mb-3">→ {s.produces}</div>
              <div className="text-xs uppercase tracking-widest text-quantum-fg-mute">
                <span className={s.color}>{s.who}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <Callout variant="quote" title={t('mldsa.s01.callout.title')}>
          {t('mldsa.s01.callout.body')}
        </Callout>
      </ScrollSection>

      {/* PARAMS */}
      <ScrollSection eyebrow={t('mldsa.s02.eyebrow')} title={t('mldsa.s02.title')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-quantum-border text-left">
                <th className="py-3 pr-4 text-quantum-fg-mute font-medium uppercase text-xs tracking-widest">
                  {t('mldsa.s02.col.variant')}
                </th>
                <th className="py-3 pr-4 text-quantum-fg-mute font-medium uppercase text-xs tracking-widest">
                  {t('mldsa.s02.col.security')}
                </th>
                <th className="py-3 pr-4 text-quantum-fg-mute font-medium uppercase text-xs tracking-widest">k</th>
                <th className="py-3 text-quantum-fg-mute font-medium uppercase text-xs tracking-widest">ℓ</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p, i) => (
                <motion.tr
                  key={p.variant}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-quantum-border/40 hover:bg-quantum-panel/40"
                >
                  <td className="py-4 pr-4 font-mono font-semibold text-quantum-cyan">{p.variant}</td>
                  <td className="py-4 pr-4 text-quantum-fg">{p.sec}</td>
                  <td className="py-4 pr-4 font-mono text-quantum-fg-strong">{p.k}</td>
                  <td className="py-4 font-mono text-quantum-fg-strong">{p.l}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm">
          <div className="card-quantum p-5">
            <div className="text-quantum-cyan font-mono font-bold mb-1">n = 256</div>
            <p className="text-quantum-fg-soft">{t('mldsa.s02.note.n')}</p>
          </div>
          <div className="card-quantum p-5">
            <div className="text-quantum-violet font-mono font-bold mb-1">q = 8 380 417</div>
            <p className="text-quantum-fg-soft">{t('mldsa.s02.note.q')}</p>
          </div>
          <div className="card-quantum p-5">
            <div className="text-quantum-pink font-mono font-bold mb-1">τ, γ₁, γ₂, β</div>
            <p className="text-quantum-fg-soft">{t('mldsa.s02.note.others')}</p>
          </div>
        </div>
      </ScrollSection>

      {/* MODULE-SIS */}
      <ScrollSection eyebrow={t('mldsa.s03.eyebrow')} title={t('mldsa.s03.title')}>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4 text-quantum-fg leading-relaxed text-[17px]">
            <p>{t('mldsa.s03.p1')}</p>
            <p>{t('mldsa.s03.p2')}</p>
            <Math display>{t('mldsa.sis.formula')}</Math>
            <p className="text-quantum-fg-soft text-sm">{t('mldsa.s03.caption')}</p>
          </div>

          <div className="card-quantum p-7 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-quantum-cyan mb-2">Module-LWE</div>
              <div className="font-mono text-sm text-quantum-fg-strong">protege s</div>
              <div className="text-xs text-quantum-fg-mute mt-1">la clave secreta</div>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-quantum-violet mb-2">Module-SIS</div>
              <div className="font-mono text-sm text-quantum-fg-strong">previene falsificación</div>
              <div className="text-xs text-quantum-fg-mute mt-1">de firmas válidas sin sk</div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* REJECTION SAMPLING */}
      <ScrollSection
        eyebrow={t('mldsa.s03b.eyebrow')}
        title={
          <>
            <span className="text-quantum-amber">Rejection</span> sampling
          </>
        }
      >
        <p className="text-quantum-fg leading-relaxed text-[17px] mb-8 max-w-3xl">
          {t('mldsa.s03b.lead')}
        </p>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-quantum-fg leading-relaxed">
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 rounded-lg bg-quantum-amber/10 text-quantum-amber">
                <Filter size={18} />
              </div>
              <p className="flex-1 text-[15px]">{t('mldsa.s03b.p1')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 rounded-lg bg-quantum-mint/10 text-quantum-mint">
                <EyeOff size={18} />
              </div>
              <p className="flex-1 text-[15px]">{t('mldsa.s03b.p2')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
                <RotateCcw size={18} />
              </div>
              <p className="flex-1 text-[15px]">{t('mldsa.s03b.p3')}</p>
            </div>
            <Math display>{`\\mathbf{z} = \\mathbf{y} + c \\cdot \\mathbf{s}_1 \\quad\\text{publicar sólo si}\\quad \\|\\mathbf{z}\\|_\\infty < \\gamma_1 - \\beta`}</Math>
          </div>

          <div className="card-quantum p-6">
            <div className="text-xs uppercase tracking-widest text-quantum-fg-mute mb-5 text-center">
              {t('mldsa.s03b.viz.title')}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center text-xs">
                  <XCircle size={14} className="text-quantum-rose" />
                  <span className="font-display font-semibold text-quantum-rose">
                    {t('mldsa.s03b.viz.without.title')}
                  </span>
                </div>
                <DistHistogram shift={3.5} color="#fb7185" label="" />
                <p className="text-[11px] text-quantum-fg-soft leading-snug text-center">
                  {t('mldsa.s03b.viz.without.desc')}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center text-xs">
                  <Eye size={14} className="text-quantum-mint" />
                  <span className="font-display font-semibold text-quantum-mint">
                    {t('mldsa.s03b.viz.with.title')}
                  </span>
                </div>
                <DistHistogram shift={0} color="#34d399" label="" />
                <p className="text-[11px] text-quantum-fg-soft leading-snug text-center">
                  {t('mldsa.s03b.viz.with.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Callout variant="tip" title={t('mldsa.s03b.analogy.title')}>
          {t('mldsa.s03b.analogy.body')}
        </Callout>
      </ScrollSection>

      {/* HIGHBITS / LOWBITS */}
      <ScrollSection
        eyebrow={t('mldsa.s03c.eyebrow')}
        title={
          <>
            <span className="text-quantum-cyan">HighBits</span> y{' '}
            <span className="text-quantum-pink">LowBits</span>
          </>
        }
      >
        <p className="text-quantum-fg leading-relaxed text-[17px] mb-8 max-w-3xl">
          {t('mldsa.s03c.lead')}
        </p>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-quantum-fg leading-relaxed">
            <Math display>{`w = \\alpha \\cdot \\text{HighBits}(w) + \\text{LowBits}(w)`}</Math>
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
                <Layers size={18} />
              </div>
              <p className="flex-1 text-[15px]">{t('mldsa.s03c.p1')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
                <ShieldCheck size={18} />
              </div>
              <p className="flex-1 text-[15px]">{t('mldsa.s03c.p2')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 rounded-lg bg-quantum-mint/10 text-quantum-mint">
                <ArrowRight size={18} />
              </div>
              <p className="flex-1 text-[15px]">{t('mldsa.s03c.p3')}</p>
            </div>
          </div>

          <div className="card-quantum p-6">
            <div className="text-xs uppercase tracking-widest text-quantum-fg-mute mb-5 text-center">
              {t('mldsa.s03c.viz.title')}
            </div>
            <HighLowViz t={t} />
          </div>
        </div>

        <Callout variant="info" title={t('mldsa.s03c.callout.title')}>
          {t('mldsa.s03c.callout.body')}
        </Callout>
      </ScrollSection>

      {/* KEYGEN */}
      <ScrollSection
        eyebrow={t('mldsa.s04.eyebrow')}
        title={
          <>
            <span className="text-quantum-cyan">KeyGen</span> · {t('mldsa.s04.titleAfter')}
          </>
        }
      >
        <div className="card-quantum p-6 space-y-4">
          <ol className="space-y-4">
            {[
              { step: 1, title: t('mldsa.keygen.s1'), formula: <Math>{`\\rho, \\sigma \\leftarrow \\text{seed}`}</Math>, note: t('mldsa.keygen.s1.note') },
              { step: 2, title: t('mldsa.keygen.s2'), formula: <Math>{`\\mathbf{A} \\in R_q^{k \\times \\ell} \\leftarrow \\text{Expand}(\\rho)`}</Math>, note: t('mldsa.keygen.s2.note') },
              { step: 3, title: t('mldsa.keygen.s3'), formula: <Math>{`\\mathbf{s}_1 \\in R_q^\\ell, \\;\\; \\mathbf{s}_2 \\in R_q^k \\;\\; \\text{con } \\|\\cdot\\|_\\infty \\le \\eta`}</Math>, note: t('mldsa.keygen.s3.note') },
              { step: 4, title: t('mldsa.keygen.s4'), formula: <Math>{`\\mathbf{t} = \\mathbf{A}\\mathbf{s}_1 + \\mathbf{s}_2`}</Math>, note: t('mldsa.keygen.s4.note'), highlight: true },
              { step: 5, title: t('mldsa.keygen.s5'), formula: <Math>{`pk = (\\rho, \\mathbf{t}) \\quad sk = (\\rho, \\mathbf{s}_1, \\mathbf{s}_2, \\mathbf{t})`}</Math>, note: t('mldsa.keygen.s5.note') },
            ].map((s) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: s.step * 0.05 }}
                className={`flex gap-4 items-start p-4 rounded-xl ${
                  s.highlight
                    ? 'bg-quantum-cyan/5 border border-quantum-cyan/30'
                    : 'border border-quantum-border/30'
                }`}
              >
                <div className="font-mono font-bold text-2xl text-gradient-static shrink-0 w-10">{s.step}</div>
                <div className="flex-1">
                  <div className="font-display font-semibold text-quantum-fg-strong">{s.title}</div>
                  <div className="my-2">{s.formula}</div>
                  <div className="text-xs text-quantum-fg-soft">{s.note}</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </ScrollSection>

      {/* SIGN + rejection sampling */}
      <ScrollSection
        eyebrow={t('mldsa.s05.eyebrow')}
        title={
          <>
            <span className="text-quantum-violet">Sign</span> · {t('mldsa.s05.titleAfter')}
          </>
        }
      >
        <div className="grid lg:grid-cols-[300px,1fr] gap-6 items-start">
          <div className="card-quantum p-5 lg:sticky lg:top-24 text-sm">
            <div className="flex items-center gap-2 mb-3 text-quantum-amber">
              <RotateCcw size={16} />
              <span className="font-display font-semibold">{t('mldsa.s05.aborts.title')}</span>
            </div>
            <p className="text-quantum-fg-soft">{t('mldsa.s05.aborts.desc')}</p>
          </div>

          <div className="card-quantum p-6 space-y-4 min-w-0">
            <ol className="space-y-4">
              {[
                { step: 1, title: t('mldsa.sign.s1'), formula: <Math>{`\\mathbf{y} \\leftarrow \\text{uniform}(-\\gamma_1, \\gamma_1)^\\ell`}</Math>, note: t('mldsa.sign.s1.note') },
                { step: 2, title: t('mldsa.sign.s2'), formula: <Math>{`\\mathbf{w} = \\mathbf{A}\\mathbf{y}`}</Math>, note: t('mldsa.sign.s2.note') },
                { step: 3, title: t('mldsa.sign.s3'), formula: <Math>{`c = H(\\mathbf{w}, m)`}</Math>, note: t('mldsa.sign.s3.note') },
                { step: 4, title: t('mldsa.sign.s4'), formula: <Math>{`\\mathbf{z} = \\mathbf{y} + c \\cdot \\mathbf{s}_1`}</Math>, note: t('mldsa.sign.s4.note'), highlight: true },
                { step: 5, title: t('mldsa.sign.s5'), formula: <Math>{`\\|\\mathbf{z}\\|_\\infty < \\gamma_1 - \\beta \\;\\Rightarrow\\; \\text{publicar } \\sigma = (\\mathbf{z}, c)`}</Math>, note: t('mldsa.sign.s5.note'), highlight: true },
              ].map((s) => (
                <li
                  key={s.step}
                  className={`flex gap-4 items-start p-4 rounded-xl ${
                    s.highlight
                      ? 'bg-quantum-violet/5 border border-quantum-violet/30'
                      : 'border border-quantum-border/30'
                  }`}
                >
                  <div className="font-mono font-bold text-2xl text-gradient-static shrink-0 w-10">{s.step}</div>
                  <div className="flex-1">
                    <div className="font-display font-semibold text-quantum-fg-strong">{s.title}</div>
                    <div className="my-2">{s.formula}</div>
                    <div className="text-xs text-quantum-fg-soft">{s.note}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Callout variant="tip" title={t('mldsa.s05.tip.title')}>
          {t('mldsa.s05.tip.body')}
        </Callout>
      </ScrollSection>

      {/* VERIFY */}
      <ScrollSection
        eyebrow={t('mldsa.s06.eyebrow')}
        title={
          <>
            <span className="text-quantum-pink">Verify</span> · {t('mldsa.s06.titleAfter')}
          </>
        }
      >
        <p className="text-quantum-fg leading-relaxed text-[17px] mb-8 max-w-3xl">
          {t('mldsa.s06.lead')}
        </p>

        {/* Who knows what */}
        <div className="card-quantum p-6 mb-8">
          <h4 className="font-display text-base font-semibold text-quantum-fg-strong mb-4">
            {t('mldsa.verify.public.title')}
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-quantum-violet/30 bg-quantum-violet/5 p-4">
              <div className="text-[10px] uppercase tracking-widest text-quantum-violet font-mono font-bold mb-1">
                {t('mldsa.verify.public.signer')}
              </div>
              <div className="font-mono text-sm text-quantum-fg-strong">
                {t('mldsa.verify.public.signer.list')}
              </div>
            </div>
            <div className="rounded-xl border border-quantum-pink/30 bg-quantum-pink/5 p-4">
              <div className="text-[10px] uppercase tracking-widest text-quantum-pink font-mono font-bold mb-1">
                {t('mldsa.verify.public.verifier')}
              </div>
              <div className="font-mono text-sm text-quantum-fg-strong">
                {t('mldsa.verify.public.verifier.list')}
              </div>
            </div>
          </div>
          <p className="text-xs text-quantum-fg-soft mt-3 leading-relaxed">
            {t('mldsa.verify.public.note')}
          </p>
        </div>

        {/* Compute + Check side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-quantum p-6">
            <h4 className="font-display text-lg font-semibold text-quantum-cyan mb-4 flex items-center gap-2">
              <FileSignature size={18} /> {t('mldsa.verify.compute')}
            </h4>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-mono text-quantum-fg-mute">1</span>
                <span><Math>{`\\mathbf{w}' = \\mathbf{A}\\mathbf{z} - c \\cdot \\mathbf{t}`}</Math></span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-quantum-fg-mute">2</span>
                <span><Math>{`c' = H(\\mathbf{w}', m)`}</Math></span>
              </li>
            </ol>
          </div>
          <div className="card-quantum p-6 glow-violet">
            <h4 className="font-display text-lg font-semibold text-quantum-violet mb-4 flex items-center gap-2">
              <ShieldCheck size={18} /> {t('mldsa.verify.check')}
            </h4>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-mono text-quantum-fg-mute">3</span>
                <span>
                  <Math>{`c \\stackrel{?}{=} c'`}</Math> · {t('mldsa.verify.checkHash')}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-quantum-fg-mute">4</span>
                <span>
                  <Math>{`\\|\\mathbf{z}\\|_\\infty < \\gamma_1 - \\beta`}</Math> · {t('mldsa.verify.checkBound')}
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Algebraic cancellation step by step */}
        <div className="card-quantum p-6 md:p-8 mt-8">
          <h4 className="font-display text-lg font-semibold text-quantum-fg-strong mb-2">
            {t('mldsa.verify.cancel.title')}
          </h4>
          <p className="text-sm text-quantum-fg-soft mb-6 leading-relaxed">
            {t('mldsa.verify.cancel.intro')}
          </p>

          <ol className="space-y-3">
            {[
              {
                step: 1,
                title: t('mldsa.verify.cancel.step1.title'),
                formula: `\\mathbf{w}' = \\mathbf{A}(\\mathbf{y} + c\\,\\mathbf{s}_1) - c\\,\\mathbf{t}`,
                note: t('mldsa.verify.cancel.step1.note'),
              },
              {
                step: 2,
                title: t('mldsa.verify.cancel.step2.title'),
                formula: `\\mathbf{w}' = \\mathbf{A}\\mathbf{y} + c\\,\\mathbf{A}\\mathbf{s}_1 - c(\\mathbf{A}\\mathbf{s}_1 + \\mathbf{s}_2)`,
                note: t('mldsa.verify.cancel.step2.note'),
              },
              {
                step: 3,
                title: t('mldsa.verify.cancel.step3.title'),
                formula: `\\mathbf{w}' = \\mathbf{A}\\mathbf{y} - c\\,\\mathbf{s}_2 \\;\\approx\\; \\mathbf{A}\\mathbf{y} = \\mathbf{w}`,
                note: t('mldsa.verify.cancel.step3.note'),
                highlight: true,
              },
              {
                step: 4,
                title: t('mldsa.verify.cancel.step4.title'),
                formula: `c' = H(\\mathbf{w}', m) = H(\\mathbf{w}, m) = c`,
                note: t('mldsa.verify.cancel.step4.note'),
              },
            ].map((s) => (
              <li
                key={s.step}
                className={`flex gap-4 items-start p-4 rounded-xl ${
                  s.highlight
                    ? 'bg-quantum-mint/5 border border-quantum-mint/30'
                    : 'border border-quantum-border/40'
                }`}
              >
                <div className="font-mono font-bold text-xl text-gradient-static shrink-0 w-8">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-quantum-fg-strong text-sm mb-1">
                    {s.title}
                  </div>
                  <div className="my-2 overflow-x-auto">
                    <Math display>{s.formula}</Math>
                  </div>
                  <div className="text-[11px] text-quantum-fg-soft">{s.note}</div>
                </div>
              </li>
            ))}
          </ol>

          <p className="text-sm text-quantum-fg leading-relaxed mt-6">
            {t('mldsa.verify.cancel.outro')}
          </p>
        </div>

        {/* When verification fails */}
        <div className="mt-8">
          <h4 className="font-display text-lg font-semibold text-quantum-fg-strong mb-2">
            {t('mldsa.verify.failures.title')}
          </h4>
          <p className="text-sm text-quantum-fg-soft mb-5 leading-relaxed max-w-3xl">
            {t('mldsa.verify.failures.intro')}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-quantum-rose/40 bg-quantum-rose/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={16} className="text-quantum-rose" />
                <span className="font-display font-semibold text-quantum-rose text-sm">
                  {t('mldsa.verify.fail.hash.title')}
                </span>
              </div>
              <p className="text-xs text-quantum-fg-soft leading-relaxed">
                {t('mldsa.verify.fail.hash.body')}
              </p>
            </div>
            <div className="rounded-2xl border border-quantum-rose/40 bg-quantum-rose/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={16} className="text-quantum-rose" />
                <span className="font-display font-semibold text-quantum-rose text-sm">
                  {t('mldsa.verify.fail.bound.title')}
                </span>
              </div>
              <p className="text-xs text-quantum-fg-soft leading-relaxed">
                {t('mldsa.verify.fail.bound.body')}
              </p>
            </div>
          </div>
        </div>

        <Callout variant="info" title={t('mldsa.verify.why.title')}>
          {t('mldsa.verify.why.body')}
        </Callout>
      </ScrollSection>

      <QuickQuiz
        quizId="mldsa-quick"
        routeId="mldsa"
        title={t('mldsa.quiz.title')}
        titleKey="mldsa.quiz.title"
        questions={[
          {
            question: t('mldsa.quiz.q1.q'),
            options: [
              t('mldsa.quiz.q1.o1'),
              t('mldsa.quiz.q1.o2'),
              t('mldsa.quiz.q1.o3'),
              t('mldsa.quiz.q1.o4'),
            ],
            correctIndex: 1,
            explanation: t('mldsa.quiz.q1.exp'),
          },
          {
            question: t('mldsa.quiz.q2.q'),
            options: [
              t('mldsa.quiz.q2.o1'),
              t('mldsa.quiz.q2.o2'),
              t('mldsa.quiz.q2.o3'),
              t('mldsa.quiz.q2.o4'),
            ],
            correctIndex: 2,
            explanation: t('mldsa.quiz.q2.exp'),
          },
          {
            question: t('mldsa.quiz.q3.q'),
            options: [
              t('mldsa.quiz.q3.o1'),
              t('mldsa.quiz.q3.o2'),
              t('mldsa.quiz.q3.o3'),
              t('mldsa.quiz.q3.o4'),
            ],
            correctIndex: 1,
            explanation: t('mldsa.quiz.q3.exp'),
          },
          {
            question: t('mldsa.quiz.q4.q'),
            options: [
              t('mldsa.quiz.q4.o1'),
              t('mldsa.quiz.q4.o2'),
              t('mldsa.quiz.q4.o3'),
              t('mldsa.quiz.q4.o4'),
            ],
            correctIndex: 1,
            explanation: t('mldsa.quiz.q4.exp'),
          },
        ]}
      />

      {/* SIMULATOR */}
      <ScrollSection
        eyebrow={t('mldsa.s07.eyebrow')}
        title={
          <>
            {t('mldsa.s07.titleBefore')} <span className="text-gradient-static">{t('mldsa.s07.titleAfter')}</span>
          </>
        }
      >
        <p className="text-quantum-fg mb-8 text-[17px] leading-relaxed max-w-3xl">
          {t('mldsa.s07.lead')}
        </p>
        <div className="card-quantum p-2 md:p-4">
          <MLDSASimulator onUse={handleSimulatorInteraction} />
        </div>
      </ScrollSection>

      {/* SUMMARY */}
      <ScrollSection eyebrow={t('mldsa.s08.eyebrow')} title={t('mldsa.s08.title')}>
        <div className="card-quantum p-8 md:p-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-3 rounded-xl bg-quantum-violet/10 text-quantum-violet">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-quantum-fg-strong mb-2">
                {t('mldsa.s08.subtitle')}
              </h3>
              <p className="text-quantum-fg text-[16px] leading-relaxed">
                {t('mldsa.s08.body')}
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { l: t('mldsa.s08.chip1'), d: t('mldsa.s08.chip1.d') },
              { l: t('mldsa.s08.chip2'), d: t('mldsa.s08.chip2.d') },
              { l: t('mldsa.s08.chip3'), d: t('mldsa.s08.chip3.d') },
            ].map((c) => (
              <div key={c.l} className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4">
                <div className="font-mono text-quantum-violet text-xs font-bold mb-1">{c.l}</div>
                <div className="text-xs text-quantum-fg-soft">{c.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-quantum-fg-soft text-sm flex items-center justify-center gap-1">
          <ArrowDown size={14} />
          {t('mldsa.s08.scrollHint')}
        </div>
      </ScrollSection>

      <div className="mx-auto" style={{ width: '90%' }}>
        <FeedbackForm routeId="mldsa" />
      </div>
    </div>
  );
};

export default MLDSARoute;
