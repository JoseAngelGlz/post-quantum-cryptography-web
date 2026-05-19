import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Dice5,
  Eye,
  Hash,
  KeyRound,
  Layers,
  Lock,
  Package,
  Send,
  ShieldCheck,
  Shuffle,
  Sigma,
  Sparkles,
  Unlock,
  Waves,
} from 'lucide-react';
import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import Callout from '../shared/Callout';
import QuickQuiz from '../shared/QuickQuiz';
import FeedbackForm from '../shared/FeedbackForm';
import Math from '../shared/Math';
import MLKEMSimulator from '../MLKEMSimulator';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';
import { useSectionTracking } from '../../hooks/useSectionTracking';
import { useAnalytics } from '../../hooks/useAnalytics';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const params = [
  { variant: 'ML-KEM-512', sec: '≈ AES-128', k: 2, eta1: 3, eta2: 2 },
  { variant: 'ML-KEM-768', sec: '≈ AES-192', k: 3, eta1: 2, eta2: 2 },
  { variant: 'ML-KEM-1024', sec: '≈ AES-256', k: 4, eta1: 2, eta2: 2 },
];

/* ─── Shared visual primitives for the step explanations ─── */

type StepPalette = 'cyan' | 'violet' | 'pink' | 'mint';

const paletteToHex: Record<StepPalette, string> = {
  cyan: '#5eead4',
  violet: '#a78bfa',
  pink: '#f472b6',
  mint: '#34d399',
};

interface StepCardProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  plain: React.ReactNode;
  formula: React.ReactNode;
  produces: string;
  highlight?: boolean;
  palette: StepPalette;
  compact?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  icon,
  title,
  plain,
  formula,
  produces,
  highlight,
  palette,
  compact,
}) => {
  const hex = paletteToHex[palette];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl border bg-quantum-panel/60 overflow-hidden"
      style={{
        borderColor: highlight ? `${hex}80` : '#1f2750',
        boxShadow: highlight ? `0 0 22px ${hex}33` : undefined,
      }}
    >
      {/* accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: `linear-gradient(180deg, ${hex}, ${hex}33)` }}
      />
      <div
        className={`grid ${
          compact ? 'gap-2' : 'md:grid-cols-[1.4fr,1fr] gap-4'
        } p-4 pl-5`}
      >
        {/* left: explanation */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold border"
              style={{
                background: `${hex}1f`,
                borderColor: `${hex}55`,
                color: hex,
              }}
            >
              {step}
            </div>
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: `${hex}10`, color: hex }}
            >
              {icon}
            </div>
            <h4 className="font-display font-semibold text-slate-100 text-[15px]">
              {title}
            </h4>
          </div>
          <p className="text-[13px] text-slate-300 leading-relaxed pl-9">{plain}</p>
        </div>

        {/* right: formula + output */}
        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <div
            className="rounded-lg border bg-quantum-panel2/50 px-3 py-2 text-center"
            style={{ borderColor: `${hex}33` }}
          >
            <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">
              Fórmula
            </div>
            <div className="text-[14px]">{formula}</div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <ArrowRight size={11} style={{ color: hex }} />
            <span style={{ color: hex }}>produce</span>
            <span className="text-slate-300 normal-case">{produces}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface PipelineNode {
  icon: React.ReactNode;
  label: string;
}

const PipelineDiagram: React.FC<{
  nodes: PipelineNode[];
  palette: StepPalette;
}> = ({ nodes, palette }) => {
  const hex = paletteToHex[palette];
  return (
    <div className="rounded-2xl border border-quantum-border bg-quantum-panel/40 p-4 md:p-5 overflow-x-auto">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-mono">
        Flujo del algoritmo
      </div>
      <div className="flex items-center gap-2 md:gap-3 min-w-max">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="flex flex-col items-center gap-1.5 min-w-[100px] md:min-w-[120px]"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border"
                style={{
                  background: `linear-gradient(135deg, ${hex}22, ${hex}0a)`,
                  borderColor: `${hex}55`,
                  color: hex,
                }}
              >
                {n.icon}
              </div>
              <span className="text-[10px] md:text-[11px] font-mono text-slate-300 text-center leading-tight px-1">
                {n.label}
              </span>
            </motion.div>
            {i < nodes.length - 1 && (
              <ArrowRight
                size={16}
                className="shrink-0 mt-[-12px]"
                style={{ color: `${hex}80` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MLKEMRoute: React.FC<RouteProps> = ({ onChange }) => {
  const t = useT();
  const { simulatorUsed } = useAnalytics();
  useSectionTracking('mlkem');

  const handleSimulatorInteraction = () => {
    simulatorUsed('SimMLKEM');
  };

  return (
    <div>
      <Hero
        eyebrow={t('mlkem.hero.eyebrow')}
        hueA={300}
        hueB={350}
        title={
          <>
            <span className="text-gradient-quantum">ML-KEM</span>
            <br />
            {t('mlkem.hero.titleLine2')}
          </>
        }
        subtitle={t('mlkem.hero.subtitle')}
      />

      <ScrollSection eyebrow={t('mlkem.s01.eyebrow')} title={t('mlkem.s01.title')}>
        <p className="text-slate-300 leading-relaxed text-[17px] mb-8">
          {t('mlkem.s01.lead.a')}
          <span className="text-quantum-cyan font-semibold">{t('mlkem.s01.lead.b')}</span>
          {t('mlkem.s01.lead.c')}
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { n: '01', op: 'KeyGen()', produces: '(pk, sk)', who: t('mlkem.s01.alice'), icon: <KeyRound size={22} />, color: 'text-quantum-cyan' },
            { n: '02', op: 'Encaps(pk)', produces: '(c, K)', who: t('mlkem.s01.bob'), icon: <Send size={22} />, color: 'text-quantum-violet' },
            { n: '03', op: 'Decaps(sk, c)', produces: 'K', who: t('mlkem.s01.alice'), icon: <Unlock size={22} />, color: 'text-quantum-pink' },
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
                <span className="font-mono text-xs text-slate-500">{s.n}</span>
                <span className={s.color}>{s.icon}</span>
              </div>
              <div className="font-mono font-bold text-slate-100 text-lg mb-1">{s.op}</div>
              <div className="text-sm text-slate-400 mb-3">→ {s.produces}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500">
                {t('mlkem.s01.executes')} · <span className={s.color}>{s.who}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <Callout variant="quote" title={t('mlkem.s01.callout.title')}>
          {t('mlkem.s01.callout.body')}
        </Callout>
      </ScrollSection>

      {/* PARÁMETROS */}
      <ScrollSection eyebrow={t('mlkem.s02.eyebrow')} title={t('mlkem.s02.title')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-quantum-border text-left">
                <th className="py-3 pr-4 text-slate-400 font-medium uppercase text-xs tracking-widest">{t('mlkem.s02.col.variant')}</th>
                <th className="py-3 pr-4 text-slate-400 font-medium uppercase text-xs tracking-widest">{t('mlkem.s02.col.security')}</th>
                <th className="py-3 pr-4 text-slate-400 font-medium uppercase text-xs tracking-widest">k</th>
                <th className="py-3 pr-4 text-slate-400 font-medium uppercase text-xs tracking-widest">η₁</th>
                <th className="py-3 text-slate-400 font-medium uppercase text-xs tracking-widest">η₂</th>
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
                  <td className="py-4 pr-4 text-slate-300">{p.sec}</td>
                  <td className="py-4 pr-4 font-mono text-slate-200">{p.k}</td>
                  <td className="py-4 pr-4 font-mono text-slate-200">{p.eta1}</td>
                  <td className="py-4 font-mono text-slate-200">{p.eta2}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm">
          <div className="card-quantum p-5">
            <div className="text-quantum-cyan font-mono font-bold mb-1">n = 256</div>
            <p className="text-slate-400">{t('mlkem.s02.note.n')}</p>
          </div>
          <div className="card-quantum p-5">
            <div className="text-quantum-violet font-mono font-bold mb-1">q = 3329</div>
            <p className="text-slate-400">{t('mlkem.s02.note.q')}</p>
          </div>
          <div className="card-quantum p-5">
            <div className="text-quantum-pink font-mono font-bold mb-1">k</div>
            <p className="text-slate-400">{t('mlkem.s02.note.k')}</p>
          </div>
        </div>
      </ScrollSection>

      {/* KEYGEN */}
      <ScrollSection
        eyebrow={t('mlkem.s03.eyebrow')}
        title={
          <>
            <span className="text-quantum-cyan">KeyGen</span> · {t('mlkem.s03.titleAfter')}
          </>
        }
      >
        {/* Visual pipeline */}
        <PipelineDiagram
          palette="cyan"
          nodes={[
            { icon: <Dice5 size={16} />, label: 'semilla d' },
            { icon: <Hash size={16} />, label: '(ρ, σ)' },
            { icon: <Layers size={16} />, label: 'matriz A · secretos s, e' },
            { icon: <Sigma size={16} />, label: 't = A·s + e' },
            { icon: <Package size={16} />, label: '(pk, sk)' },
          ]}
        />

        <p className="text-slate-300 max-w-3xl mb-8 mt-6 text-[16px] leading-relaxed">
          {t('mlkem.s03.lead')}
        </p>

        <div className="space-y-3">
          {[
            { step: 1, icon: <Dice5 size={16} />, title: t('mlkem.keygen.s1.title'), plain: t('mlkem.keygen.s1.plain'), formula: <Math>{`d \\xleftarrow{\\$} \\{0,1\\}^{256}`}</Math>, produces: 'd' },
            { step: 2, icon: <Hash size={16} />, title: t('mlkem.keygen.s2.title'), plain: t('mlkem.keygen.s2.plain'), formula: <Math>{`(\\rho, \\sigma) = \\text{SHA3-512}(d)`}</Math>, produces: 'ρ · σ' },
            { step: 3, icon: <Layers size={16} />, title: t('mlkem.keygen.s3.title'), plain: t('mlkem.keygen.s3.plain'), formula: <Math>{`\\mathbf{A} \\leftarrow \\text{SHAKE-128}(\\rho)`}</Math>, produces: 'A' },
            { step: 4, icon: <Waves size={16} />, title: t('mlkem.keygen.s4.title'), plain: t('mlkem.keygen.s4.plain'), formula: <Math>{`\\mathbf{s}, \\mathbf{e} \\sim B_{\\eta_1}^k \\leftarrow \\sigma`}</Math>, produces: 's, e' },
            { step: 5, icon: <Sigma size={16} />, title: t('mlkem.keygen.s5.title'), plain: t('mlkem.keygen.s5.plain'), formula: <Math>{`\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e}`}</Math>, produces: 't', highlight: true },
            { step: 6, icon: <Package size={16} />, title: t('mlkem.keygen.s6.title'), plain: t('mlkem.keygen.s6.plain'), formula: <Math>{`pk = (\\rho, \\mathbf{t}) \\quad sk = \\mathbf{s}`}</Math>, produces: 'pk, sk' },
          ].map((s) => (
            <StepCard key={s.step} palette="cyan" {...s} />
          ))}
        </div>

        <Callout variant="tip" title={t('mlkem.s03.tip.title')}>
          {t('mlkem.s03.tip.body')}
        </Callout>
      </ScrollSection>

      {/* ENCAPS */}
      <ScrollSection
        eyebrow={t('mlkem.s04.eyebrow')}
        title={
          <>
            <span className="text-quantum-violet">Encaps</span> · {t('mlkem.s04.titleAfter')}
          </>
        }
      >
        <PipelineDiagram
          palette="violet"
          nodes={[
            { icon: <Dice5 size={16} />, label: 'mensaje m' },
            { icon: <Hash size={16} />, label: '(K, r) = Hash(m, ...)' },
            { icon: <Shuffle size={16} />, label: 'ruidos r, e₁, e₂' },
            { icon: <Sigma size={16} />, label: 'u, v' },
            { icon: <Send size={16} />, label: 'c · enviar' },
          ]}
        />

        <p className="text-slate-300 max-w-3xl mb-8 mt-6 text-[16px] leading-relaxed">
          {t('mlkem.s04.lead')}
        </p>

        <div className="space-y-3">
          {[
            { step: 1, icon: <Dice5 size={16} />, title: t('mlkem.encaps.s1'), plain: t('mlkem.encaps.s1.plain'), formula: <Math>{`m \\xleftarrow{\\$} \\{0,1\\}^{256}`}</Math>, produces: 'm' },
            { step: 2, icon: <Hash size={16} />, title: t('mlkem.encaps.s2'), plain: t('mlkem.encaps.s2.plain'), formula: <Math>{`(K, r) = \\text{Hash}(m, \\text{Hash}(pk))`}</Math>, produces: 'K, r' },
            { step: 3, icon: <Layers size={16} />, title: t('mlkem.encaps.s3'), plain: t('mlkem.encaps.s3.plain'), formula: <Math>{`\\mathbf{A} \\leftarrow \\text{SHAKE-128}(\\rho)`}</Math>, produces: 'A' },
            { step: 4, icon: <Waves size={16} />, title: t('mlkem.encaps.s4'), plain: t('mlkem.encaps.s4.plain'), formula: <Math>{`\\mathbf{r}, \\mathbf{e}_1 \\sim B_{\\eta_1}, \\; e_2 \\sim B_{\\eta_2}`}</Math>, produces: 'r, e₁, e₂' },
            { step: 5, icon: <Sigma size={16} />, title: t('mlkem.encaps.s5'), plain: t('mlkem.encaps.s5.plain'), formula: <Math>{`\\mathbf{u} = \\mathbf{A}^T\\mathbf{r} + \\mathbf{e}_1`}</Math>, produces: 'u' },
            { step: 6, icon: <Lock size={16} />, title: t('mlkem.encaps.s6'), plain: t('mlkem.encaps.s6.plain'), formula: <Math>{`v = \\mathbf{t}^T\\mathbf{r} + e_2 + \\text{Encode}(m)`}</Math>, produces: 'v', highlight: true },
            { step: 7, icon: <Send size={16} />, title: t('mlkem.encaps.s7'), plain: t('mlkem.encaps.s7.plain'), formula: <Math>{`c = \\text{Compress}(\\mathbf{u}, v)`}</Math>, produces: 'c' },
          ].map((s) => (
            <StepCard key={s.step} palette="violet" {...s} />
          ))}
        </div>
      </ScrollSection>

      {/* DECAPS */}
      <ScrollSection
        eyebrow={t('mlkem.s05.eyebrow')}
        title={
          <>
            <span className="text-quantum-pink">Decaps</span> · {t('mlkem.s05.titleAfter')}
          </>
        }
      >
        <PipelineDiagram
          palette="pink"
          nodes={[
            { icon: <Package size={16} />, label: 'ciphertext c' },
            { icon: <Unlock size={16} />, label: 'w = v − sᵀ·u' },
            { icon: <Sparkles size={16} />, label: 'Decode → m\'' },
            { icon: <ShieldCheck size={16} />, label: 'verifica (FO)' },
            { icon: <KeyRound size={16} />, label: 'clave K' },
          ]}
        />

        <p className="text-slate-300 max-w-3xl mb-8 mt-6 text-[16px] leading-relaxed">
          {t('mlkem.s05.lead')}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
                <Unlock size={16} />
              </div>
              <h4 className="font-display text-lg font-semibold text-quantum-cyan">
                {t('mlkem.decaps.phase1')}
              </h4>
            </div>
            {[
              { step: 1, icon: <Package size={16} />, title: t('mlkem.decaps.s1.title'), plain: t('mlkem.decaps.s1.plain'), formula: <Math>{`\\text{Decompress}(c) \\to (\\mathbf{u}, v)`}</Math>, produces: '(u, v)' },
              { step: 2, icon: <Sigma size={16} />, title: t('mlkem.decaps.s2.title'), plain: t('mlkem.decaps.s2.plain'), formula: <Math>{`w = v - \\mathbf{s}^T \\mathbf{u}`}</Math>, produces: 'w', highlight: true },
              { step: 3, icon: <Sparkles size={16} />, title: t('mlkem.decaps.s3.title'), plain: t('mlkem.decaps.s3.plain'), formula: <Math>{`m' = \\text{Decode}(w)`}</Math>, produces: "m'" },
            ].map((s) => (
              <StepCard key={s.step} palette="cyan" compact {...s} />
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
                <ShieldCheck size={16} />
              </div>
              <h4 className="font-display text-lg font-semibold text-quantum-violet">
                {t('mlkem.decaps.phase2')}
              </h4>
            </div>
            {[
              { step: 4, icon: <Hash size={16} />, title: t('mlkem.decaps.s4.title'), plain: t('mlkem.decaps.s4.plain'), formula: <Math>{`(K', r') = \\text{Hash}(m', \\text{Hash}(pk))`}</Math>, produces: "K', r'" },
              { step: 5, icon: <Lock size={16} />, title: t('mlkem.decaps.s5.title'), plain: t('mlkem.decaps.s5.plain'), formula: <Math>{`c' = \\text{Encrypt}(pk, m', r')`}</Math>, produces: "c'" },
              { step: 6, icon: <CheckCircle2 size={16} />, title: t('mlkem.decaps.s6.title'), plain: t('mlkem.decaps.s6.plain'), formula: <Math>{`c \\stackrel{?}{=} c'`}</Math>, produces: 'K', highlight: true },
            ].map((s) => (
              <StepCard key={s.step} palette="violet" compact {...s} />
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* CANCELACIÓN MATEMÁTICA */}
      <ScrollSection
        eyebrow={t('mlkem.s06.eyebrow')}
        title={t('mlkem.s06.title')}
      >
        <p className="text-slate-300 mb-8 text-[17px] leading-relaxed">{t('mlkem.s06.lead')}</p>

        <div className="card-quantum p-7 space-y-5 font-mono text-sm md:text-base text-slate-200">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{t('mlkem.s06.step.sub')}</div>
            <Math display>
              {`w = (\\mathbf{t}^T\\mathbf{r} + e_2 + \\text{Encode}(m)) - \\mathbf{s}^T(\\mathbf{A}^T\\mathbf{r} + \\mathbf{e}_1)`}
            </Math>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">
              {t('mlkem.s06.step.expand')}
            </div>
            <Math display>
              {`\\mathbf{t}^T\\mathbf{r} = \\mathbf{s}^T\\mathbf{A}^T\\mathbf{r} + \\mathbf{e}^T\\mathbf{r}`}
            </Math>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-quantum-cyan mb-2">
              {t('mlkem.s06.step.cancel')}
            </div>
            <Math display>
              {`w = \\text{Encode}(m) + \\underbrace{(\\mathbf{e}^T\\mathbf{r} - \\mathbf{s}^T\\mathbf{e}_1 + e_2)}_{\\text{ruido pequeño}}`}
            </Math>
          </div>
        </div>

        <Callout variant="tip" title={t('mlkem.s06.callout.title')}>
          {t('mlkem.s06.callout.body.a')}
          <strong className="text-quantum-cyan">{t('mlkem.s06.callout.body.b')}</strong>
          {t('mlkem.s06.callout.body.c')}
        </Callout>

        <div className="mt-8 grid md:grid-cols-4 gap-3 text-center text-sm">
          {[
            { label: t('mlkem.s06.chip.mlwe'), desc: t('mlkem.s06.chip.mlwe.d') },
            { label: t('mlkem.s06.chip.ring'), desc: t('mlkem.s06.chip.ring.d') },
            { label: t('mlkem.s06.chip.corr'), desc: t('mlkem.s06.chip.corr.d') },
            { label: t('mlkem.s06.chip.cvp'), desc: t('mlkem.s06.chip.cvp.d') },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-quantum p-4"
            >
              <div className="font-mono font-bold text-quantum-cyan mb-1">{c.label}</div>
              <div className="text-xs text-slate-400">{c.desc}</div>
            </motion.div>
          ))}
        </div>
      </ScrollSection>

      {/* TRES ROLES DE r */}
      <ScrollSection
        eyebrow={t('mlkem.s07.eyebrow')}
        title={
          <>
            {t('mlkem.s07.title.a')}<Math>{`r`}</Math>{t('mlkem.s07.title.c')}
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-quantum p-7">
            <div className="flex items-center gap-3 mb-3 text-quantum-rose">
              <Eye size={20} />
              <span className="font-display font-semibold">{t('mlkem.s07.myth.title')}</span>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              {t('mlkem.s07.myth.body')}
            </p>
          </div>
          <div className="card-quantum p-7 glow-cyan">
            <div className="flex items-center gap-3 mb-3 text-quantum-cyan">
              <CheckCircle2 size={20} />
              <span className="font-display font-semibold">{t('mlkem.s07.reality.title')}</span>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              {t('mlkem.s07.reality.body.a')}
              <strong className="text-quantum-cyan">{t('mlkem.s07.reality.body.b')}</strong>
              {t('mlkem.s07.reality.body.c')}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-slate-300 text-[17px] leading-relaxed mb-4">
            {t('mlkem.s07.order.lead.a')}
            <strong className="text-quantum-cyan">{t('mlkem.s07.order.lead.b')}</strong>
            {t('mlkem.s07.order.lead.c')}
          </p>
          <div className="space-y-2">
            {[
              t('mlkem.s07.order.s1'),
              t('mlkem.s07.order.s2'),
              t('mlkem.s07.order.s3'),
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-quantum-cyan/15 text-quantum-cyan flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <span className="text-slate-300">{s}</span>
                {i < 2 && <ArrowDown size={14} className="text-slate-600 ml-2" />}
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      <QuickQuiz
        quizId="mlkem-test"
        routeId="mlkem"
        title={t('mlkem.quiz.title')}
        titleKey="mlkem.quiz.title"
        questions={[
          {
            question: t('mlkem.quiz.q1.q'),
            options: [
              t('mlkem.quiz.q1.o1'),
              t('mlkem.quiz.q1.o2'),
              t('mlkem.quiz.q1.o3'),
              t('mlkem.quiz.q1.o4'),
            ],
            correctIndex: 1,
            explanation: t('mlkem.quiz.q1.exp'),
          },
          {
            question: t('mlkem.quiz.q2.q'),
            options: [
              t('mlkem.quiz.q2.o1'),
              t('mlkem.quiz.q2.o2'),
              t('mlkem.quiz.q2.o3'),
              t('mlkem.quiz.q2.o4'),
            ],
            correctIndex: 2,
            explanation: t('mlkem.quiz.q2.exp'),
          },
          {
            question: t('mlkem.quiz.q3.q'),
            options: [
              t('mlkem.quiz.q3.o1'),
              t('mlkem.quiz.q3.o2'),
              t('mlkem.quiz.q3.o3'),
              t('mlkem.quiz.q3.o4'),
            ],
            correctIndex: 1,
            explanation: t('mlkem.quiz.q3.exp'),
          },
        ]}
      />

      {/* SIMULADOR */}
      <ScrollSection
        eyebrow={t('mlkem.s08.eyebrow')}
        title={<>{t('mlkem.s08.title.a')}<span className="text-gradient-static">{t('mlkem.s08.title.b')}</span></>}
      >
        <p className="text-slate-300 mb-8 text-[17px] leading-relaxed max-w-3xl">
          {t('mlkem.s08.lead')}
        </p>
        <div className="card-quantum p-2 md:p-4">
          <MLKEMSimulator onUse={handleSimulatorInteraction} />
        </div>
      </ScrollSection>

      <ScrollSection eyebrow={t('mlkem.s09.eyebrow')} title={t('mlkem.s09.title')}>
        <div className="card-quantum p-8 md:p-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-3 rounded-xl bg-quantum-cyan/10 text-quantum-cyan">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-100 mb-2">
                {t('mlkem.s09.subtitle')}
              </h3>
              <p className="text-slate-300 text-[16px] leading-relaxed">
                {t('mlkem.s09.body')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <button onClick={() => onChange('intro')} className="btn-ghost">
            {t('mlkem.back.intro')}
          </button>
          <button onClick={() => onChange('fundamentos')} className="btn-ghost">
            {t('mlkem.back.fund')}
          </button>
          <button onClick={() => onChange('aplicaciones')} className="btn-ghost">
            {t('mlkem.back.apps')}
          </button>
        </div>
      </ScrollSection>

      <div className="mx-auto" style={{ width: '90%' }}>
        <FeedbackForm routeId="mlkem" />
      </div>
    </div>
  );
};

export default MLKEMRoute;
