import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Cpu,
  Database,
  KeyRound,
  Lock,
  Network,
  Radio,
  ShieldCheck,
  Skull,
  Timer,
} from 'lucide-react';
import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import Callout from '../shared/Callout';
import QuickQuiz from '../shared/QuickQuiz';
import RouteSwitcher from '../shared/RouteSwitcher';
import Math from '../shared/Math';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';
import { useCallback } from 'react';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

interface FamilyData {
  nameKey: 'intro.s04.fam.lattices' | 'intro.s04.fam.codes' | 'intro.s04.fam.hashes' | 'intro.s04.fam.multivar' | 'intro.s04.fam.isogenies';
  baseKey: 'intro.s04.fam.problem.lwe' | 'intro.s04.fam.problem.codes' | 'intro.s04.fam.problem.coll' | 'intro.s04.fam.problem.mq' | 'intro.s04.fam.problem.iso';
  statusKey: 'intro.s04.fam.status.std' | 'intro.s04.fam.status.eval' | 'intro.s04.fam.status.broken';
  example: string;
  color: string;
  icon: React.ReactNode;
  accent: string;
}

const families: FamilyData[] = [
  { nameKey: 'intro.s04.fam.lattices', baseKey: 'intro.s04.fam.problem.lwe', statusKey: 'intro.s04.fam.status.std', example: 'ML-KEM, ML-DSA', color: 'from-quantum-cyan/20 to-quantum-blue/10', icon: <Network size={22} />, accent: 'text-quantum-cyan' },
  { nameKey: 'intro.s04.fam.codes', baseKey: 'intro.s04.fam.problem.codes', statusKey: 'intro.s04.fam.status.std', example: 'Classic McEliece', color: 'from-quantum-violet/20 to-quantum-pink/10', icon: <Radio size={22} />, accent: 'text-quantum-violet' },
  { nameKey: 'intro.s04.fam.hashes', baseKey: 'intro.s04.fam.problem.coll', statusKey: 'intro.s04.fam.status.std', example: 'SLH-DSA', color: 'from-quantum-mint/20 to-quantum-cyan/10', icon: <KeyRound size={22} />, accent: 'text-quantum-mint' },
  { nameKey: 'intro.s04.fam.multivar', baseKey: 'intro.s04.fam.problem.mq', statusKey: 'intro.s04.fam.status.eval', example: 'MAYO, UOV', color: 'from-quantum-amber/20 to-quantum-rose/10', icon: <Cpu size={22} />, accent: 'text-quantum-amber' },
  { nameKey: 'intro.s04.fam.isogenies', baseKey: 'intro.s04.fam.problem.iso', statusKey: 'intro.s04.fam.status.broken', example: 'CSIDH, SQIsign', color: 'from-quantum-rose/20 to-quantum-pink/10', icon: <Skull size={22} />, accent: 'text-quantum-rose' },
];

const IntroRoute: React.FC<RouteProps> = ({ onChange }) => {
  const t = useT();

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const conceptCards = [
    { id: 'concept-rsa', icon: <Lock size={22} />, label: 'RSA', sub: t('concepts.rsa.status'), color: 'text-quantum-rose', ring: 'hover:border-quantum-rose/50' },
    { id: 'concept-ecdh', icon: <Lock size={22} />, label: 'ECDH', sub: t('concepts.ecdh.status'), color: 'text-quantum-rose', ring: 'hover:border-quantum-rose/50' },
    { id: 'concept-mlkem', icon: <ShieldCheck size={22} />, label: 'ML-KEM', sub: t('concepts.mlkem.status'), color: 'text-quantum-mint', ring: 'hover:border-quantum-mint/50' },
    { id: 'concept-mldsa', icon: <ShieldCheck size={22} />, label: 'ML-DSA', sub: t('concepts.mldsa.status'), color: 'text-quantum-mint', ring: 'hover:border-quantum-mint/50' },
  ];

  return (
    <div>
      <Hero
        eyebrow={t('intro.hero.eyebrow')}
        title={
          <>
            {t('intro.hero.title.l1')}
            <br />
            <span className="text-gradient-quantum">{t('intro.hero.title.l2')}</span>
          </>
        }
        subtitle={<>{t('intro.hero.subtitle')}</>}
      />

      <ScrollSection
        eyebrow={t('intro.s01.eyebrow')}
        title={
          <>
            {t('intro.s01.title.a')}
            <span className="text-gradient-static">{t('intro.s01.title.b')}</span>
            {t('intro.s01.title.c')}
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-quantum-fg leading-relaxed text-[17px]">
            <p>
              {t('intro.s01.p1.a')}
              <span className="text-quantum-cyan font-semibold">{t('intro.s01.p1.b')}</span>
              {t('intro.s01.p1.c')}
            </p>
            <p>
              {t('intro.s01.p2.a')}
              <span className="text-quantum-violet">{t('intro.s01.p2.b')}</span>
              {t('intro.s01.p2.c')}
              <span className="text-quantum-violet">{t('intro.s01.p2.d')}</span>
              {t('intro.s01.p2.e')}
            </p>
            <p>{t('intro.s01.p3')}</p>
            <p className="text-xs uppercase tracking-widest text-quantum-fg-mute pt-2">
              {t('intro.s01.cards.hint')}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="card-quantum p-8 grid grid-cols-2 gap-4"
          >
            {conceptCards.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => scrollTo(c.id)}
                className={`group rounded-xl border border-quantum-border bg-quantum-panel/40 p-4 flex flex-col items-center gap-1 transition-all hover:scale-[1.03] ${c.ring}`}
              >
                <div className={`${c.color} transition-transform group-hover:-translate-y-0.5`}>
                  {c.icon}
                </div>
                <span className="font-mono font-semibold text-quantum-fg-strong">{c.label}</span>
                <span className={`text-xs ${c.color}`}>{c.sub}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </ScrollSection>

      {/* ─── Section 01b · Concept descriptions ────────────────────────────── */}
      <ScrollSection eyebrow={t('concepts.eyebrow')} title={t('concepts.title')}>
        <p className="text-quantum-fg leading-relaxed text-[17px] max-w-3xl mb-12">
          {t('concepts.lead')}
        </p>

        <div className="space-y-6">
          <ConceptBlock
            id="concept-rsa"
            tone="rose"
            icon={<Lock size={26} />}
            title={t('concepts.rsa.title')}
            kind={t('concepts.rsa.kind')}
            status={t('concepts.rsa.status')}
            body={t('concepts.rsa.body')}
            formulaCaption={t('concepts.rsa.formula.caption')}
            formula="c = m^e \bmod n \qquad m = c^d \bmod n"
            bottom={t('concepts.rsa.bottom')}
          />
          <ConceptBlock
            id="concept-ecdh"
            tone="pink"
            icon={<Lock size={26} />}
            title={t('concepts.ecdh.title')}
            kind={t('concepts.ecdh.kind')}
            status={t('concepts.ecdh.status')}
            body={t('concepts.ecdh.body')}
            formulaCaption={t('concepts.ecdh.formula.caption')}
            formula="K = a \cdot (b \cdot P) = b \cdot (a \cdot P)"
            bottom={t('concepts.ecdh.bottom')}
          />
          <ConceptBlock
            id="concept-mlkem"
            tone="cyan"
            icon={<ShieldCheck size={26} />}
            title={t('concepts.mlkem.title')}
            kind={t('concepts.mlkem.kind')}
            status={t('concepts.mlkem.status')}
            body={t('concepts.mlkem.body')}
            formulaCaption={t('concepts.mlkem.formula.caption')}
            formula="\mathbf{t} = \mathbf{A}\mathbf{s} + \mathbf{e} \pmod{q}"
            bottom={t('concepts.mlkem.bottom')}
            highlight
          />
          <ConceptBlock
            id="concept-mldsa"
            tone="violet"
            icon={<ShieldCheck size={26} />}
            title={t('concepts.mldsa.title')}
            kind={t('concepts.mldsa.kind')}
            status={t('concepts.mldsa.status')}
            body={t('concepts.mldsa.body')}
            formulaCaption={t('concepts.mldsa.formula.caption')}
            formula="\mathbf{A}\mathbf{z} - c\mathbf{t} \stackrel{?}{=} \mathbf{w}"
            bottom={t('concepts.mldsa.bottom')}
          />
        </div>
      </ScrollSection>

      <ScrollSection
        eyebrow={t('intro.s02.eyebrow')}
        title={t('intro.s02.title')}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { year: '1994', title: t('intro.s02.c1.title'), text: t('intro.s02.c1.text'), icon: <Cpu size={20} /> },
            { year: '2024', title: t('intro.s02.c2.title'), text: t('intro.s02.c2.text'), icon: <ShieldCheck size={20} /> },
            { year: '203X', title: t('intro.s02.c3.title'), text: t('intro.s02.c3.text'), icon: <Timer size={20} /> },
          ].map((c, i) => (
            <motion.div
              key={c.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-quantum p-7"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
                  {c.icon}
                </div>
                <span className="font-mono text-3xl font-bold text-gradient-static">
                  {c.year}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-100 mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </ScrollSection>

      <ScrollSection
        eyebrow={t('intro.s03.eyebrow')}
        title={
          <>
            <span className="text-quantum-rose">{t('intro.s03.title.a')}</span>{' '}
            <span className="text-quantum-cyan">{t('intro.s03.title.b')}</span>
          </>
        }
      >
        <div className="grid md:grid-cols-5 gap-4 mb-10">
          {[
            { step: 1, title: t('intro.s03.step1.title'), desc: t('intro.s03.step1.desc'), icon: <Database size={18} /> },
            { step: 2, title: t('intro.s03.step2.title'), desc: t('intro.s03.step2.desc'), icon: <Lock size={18} /> },
            { step: 3, title: t('intro.s03.step3.title'), desc: t('intro.s03.step3.desc'), icon: <Cpu size={18} /> },
            { step: 4, title: t('intro.s03.step4.title'), desc: t('intro.s03.step4.desc'), icon: <AlertTriangle size={18} /> },
            { step: 5, title: t('intro.s03.step5.title'), desc: t('intro.s03.step5.desc'), icon: <Skull size={18} /> },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-quantum p-5 relative"
            >
              <div className="text-xs font-mono text-quantum-cyan mb-2">
                {t('intro.s03.step.label')} {s.step}
              </div>
              <div className="text-quantum-violet mb-2">{s.icon}</div>
              <div className="font-semibold text-slate-100 mb-1 text-sm">{s.title}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <Callout variant="warning" title={t('intro.s03.callout.title')}>
          {t('intro.s03.callout.body')}
        </Callout>
      </ScrollSection>

      <QuickQuiz
        quizId="intro-quick"
        routeId="intro"
        title={t('intro.quiz.title')}
        titleKey="intro.quiz.title"
        questions={[
          {
            question: t('intro.quiz.q1.q'),
            options: [
              t('intro.quiz.q1.o1'),
              t('intro.quiz.q1.o2'),
              t('intro.quiz.q1.o3'),
              t('intro.quiz.q1.o4'),
            ],
            correctIndex: 1,
            explanation: t('intro.quiz.q1.exp'),
          },
          {
            question: t('intro.quiz.q2.q'),
            options: [
              t('intro.quiz.q2.o1'),
              t('intro.quiz.q2.o2'),
              t('intro.quiz.q2.o3'),
              t('intro.quiz.q2.o4'),
            ],
            correctIndex: 2,
            explanation: t('intro.quiz.q2.exp'),
          },
        ]}
      />

      <ScrollSection
        eyebrow={t('intro.s04.eyebrow')}
        title={t('intro.s04.title')}
      >
        <p className="text-slate-300 mb-10 max-w-3xl text-[17px] leading-relaxed">
          {t('intro.s04.lead.a')}
          <span className="text-quantum-cyan">{t('intro.s04.lead.b')}</span>
          {t('intro.s04.lead.c')}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {families.map((f, i) => (
            <motion.div
              key={f.nameKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card-quantum p-6 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-50 pointer-events-none`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-quantum-panel/60 border border-quantum-border ${f.accent}`}>
                    {f.icon}
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${f.accent}`}>
                    {t(f.statusKey)}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-100 mb-2">
                  {t(f.nameKey)}
                </h3>
                <div className="text-xs text-slate-400 mb-3">
                  {t('intro.s04.fam.problem')}: <span className="font-mono text-slate-300">{t(f.baseKey)}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {t('intro.s04.fam.example')}: <span className="font-mono text-slate-300">{f.example}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Callout variant="quote" title={t('intro.s04.callout.title')}>
          {t('intro.s04.callout.a')}
          <strong className="text-quantum-cyan">{t('intro.s04.callout.b')}</strong>
          {t('intro.s04.callout.c')}
        </Callout>
      </ScrollSection>

      <ScrollSection
        eyebrow={t('intro.s05.eyebrow')}
        title={t('intro.s05.title')}
      >
        <div className="grid md:grid-cols-2 gap-6 text-slate-300">
          <div className="card-quantum p-7 space-y-3">
            <h3 className="font-display text-xl font-semibold text-quantum-cyan mb-2">
              {t('intro.s05.left.title')}
            </h3>
            <p className="text-[15px] leading-relaxed">{t('intro.s05.left.body')}</p>
          </div>
          <div className="card-quantum p-7 space-y-3">
            <h3 className="font-display text-xl font-semibold text-quantum-violet mb-2">
              {t('intro.s05.right.title')}
            </h3>
            <p className="text-[15px] leading-relaxed">
              <span className="font-mono text-quantum-cyan">ML-KEM</span> · {t('intro.s05.right.body')}
            </p>
          </div>
        </div>
      </ScrollSection>

      <RouteSwitcher current="intro" onChange={onChange} />

    </div>
  );
};

/* ─── Concept block (RSA / ECDH / ML-KEM / ML-DSA) ─────────────────── */

type Tone = 'rose' | 'pink' | 'cyan' | 'violet';

interface ConceptBlockProps {
  id: string;
  tone: Tone;
  icon: React.ReactNode;
  title: string;
  kind: string;
  status: string;
  body: string;
  formulaCaption: string;
  formula: string;
  bottom: string;
  highlight?: boolean;
}

const toneMap: Record<Tone, { accent: string; bg: string; border: string; chipBg: string }> = {
  rose: {
    accent: 'text-quantum-rose',
    bg: 'bg-quantum-rose/10',
    border: 'border-quantum-rose/30',
    chipBg: 'bg-quantum-rose/5',
  },
  pink: {
    accent: 'text-quantum-pink',
    bg: 'bg-quantum-pink/10',
    border: 'border-quantum-pink/30',
    chipBg: 'bg-quantum-pink/5',
  },
  cyan: {
    accent: 'text-quantum-cyan',
    bg: 'bg-quantum-cyan/10',
    border: 'border-quantum-cyan/30',
    chipBg: 'bg-quantum-cyan/5',
  },
  violet: {
    accent: 'text-quantum-violet',
    bg: 'bg-quantum-violet/10',
    border: 'border-quantum-violet/30',
    chipBg: 'bg-quantum-violet/5',
  },
};

const ConceptBlock: React.FC<ConceptBlockProps> = ({
  id,
  tone,
  icon,
  title,
  kind,
  status,
  body,
  formulaCaption,
  formula,
  bottom,
  highlight,
}) => {
  const c = toneMap[tone];
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`card-quantum p-7 md:p-9 scroll-mt-24 ${highlight ? 'glow-cyan' : ''}`}
    >
      <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
        <div className={`p-4 rounded-2xl ${c.bg} ${c.accent} self-start`}>{icon}</div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className={`font-display text-3xl md:text-4xl font-bold ${c.accent}`}>{title}</h3>
            <span className="text-xs uppercase tracking-widest text-quantum-fg-mute">{kind}</span>
            <span className={`ml-auto text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${c.border} ${c.chipBg} ${c.accent}`}>
              {status}
            </span>
          </div>

          <p className="text-quantum-fg leading-relaxed text-[16px]">{body}</p>

          <div className={`rounded-xl border ${c.border} ${c.chipBg} p-5`}>
            <div className="text-xs uppercase tracking-widest text-quantum-fg-mute mb-2">
              {formulaCaption}
            </div>
            <Math display>{formula}</Math>
          </div>

          <p className="text-sm text-quantum-fg-soft leading-relaxed">{bottom}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroRoute;
