import { motion } from 'framer-motion';
import {
  ArrowDown,
  Edit3,
  FileSignature,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  Sparkles,
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

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const MLDSARoute: React.FC<RouteProps> = ({ onChange: _onChange }) => {
  const t = useT();

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
            <Math display>{`\\text{SIS}: \\;\\; \\text{encuentra } \\mathbf{x} \\text{ corto tal que } \\mathbf{A}\\mathbf{x} = \\mathbf{0}`}</Math>
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
          <MLDSASimulator />
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

      <FeedbackForm routeId="mldsa" />
    </div>
  );
};

export default MLDSARoute;
