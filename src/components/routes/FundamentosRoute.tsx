import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Hash,
  Key,
  Layers3,
  Sigma,
  Target,
  Workflow,
} from 'lucide-react';
import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import Callout from '../shared/Callout';
import QuickQuiz from '../shared/QuickQuiz';
import LatticeViz from '../shared/LatticeViz';
import ZqCircle from '../shared/ZqCircle';
import LWENoisePlayground from '../shared/LWENoisePlayground';
import Math from '../shared/Math';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';
import { useRouteTracking } from '../../hooks/useRouteTracking';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

// Ruta de fundamentos matemáticos: retículos, SVP, CVP, LWE, Module-LWE,
// códigos correctores y hashes; enlaza todos los conceptos en la cadena lógica de ML-KEM
const FundamentosRoute: React.FC<RouteProps> = ({ onChange }) => {
  const t = useT();
  useRouteTracking('fundamentos');
  const [basisToggle, setBasisToggle] = useState<'good' | 'bad'>('good');

  return (
    <div>
      <Hero
        eyebrow={t('fund.hero.eyebrow')}
        hueA={170}
        hueB={210}
        title={
          <>
            <span className="text-gradient-quantum">{t('fund.hero.titleLine1')}</span>
            <br />
            {t('fund.hero.titleLine2')}
          </>
        }
        subtitle={t('fund.hero.subtitle')}
        onBack={() => onChange('intro')}
      />

      <ScrollSection
        eyebrow={t('fund.s01.eyebrow')}
        title={<>{t('fund.s01.title')}</>}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              {t('fund.s01.p1.a')}
              <span className="text-quantum-cyan font-semibold">{t('fund.s01.p1.b')}</span>
              {t('fund.s01.p1.c')}
            </p>
            <p>
              {t('fund.s01.p2.a')}
              <span className="text-quantum-violet">{t('fund.s01.p2.b')}</span>
              {t('fund.s01.p2.c')}
            </p>
            <Math display>
              {`\\Lambda = \\left\\{ \\sum_{i=1}^n a_i \\, \\mathbf{b}_i \\;\\middle|\\; a_i \\in \\mathbb{Z} \\right\\}`}
            </Math>
            <p className="text-slate-400 text-sm">{t('fund.s01.formula.caption')}</p>
          </div>

          <div className="flex flex-col items-center">
            <LatticeViz goodBasis size={360} />
            <p className="mt-3 text-xs text-slate-400 text-center max-w-xs">
              {t('fund.s01.viz.caption.a')}
              <span className="text-quantum-pink">{t('fund.s01.viz.caption.b')}</span>
              {t('fund.s01.viz.caption.c')}
              <span className="text-quantum-cyan">{t('fund.s01.viz.caption.d')}</span>
              {t('fund.s01.viz.caption.e')}
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* BASES BUENAS VS MALAS */}
      <ScrollSection
        eyebrow={t('fund.s02.eyebrow')}
        title={
          <>
            {t('fund.s02.title.a')}<span className="text-quantum-mint">{t('fund.s02.title.b')}</span>{t('fund.s02.title.c')}
            <span className="text-quantum-rose">{t('fund.s02.title.d')}</span>
          </>
        }
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setBasisToggle('good')}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  basisToggle === 'good'
                    ? 'border-quantum-mint bg-quantum-mint/10 text-quantum-mint'
                    : 'border-quantum-border text-slate-400'
                }`}
              >
                {t('fund.s02.toggle.good')}
              </button>
              <button
                onClick={() => setBasisToggle('bad')}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  basisToggle === 'bad'
                    ? 'border-quantum-rose bg-quantum-rose/10 text-quantum-rose'
                    : 'border-quantum-border text-slate-400'
                }`}
              >
                {t('fund.s02.toggle.bad')}
              </button>
            </div>
            <LatticeViz goodBasis={basisToggle === 'good'} size={360} />
            <p className="text-xs text-slate-400 text-center max-w-xs">
              {basisToggle === 'good' ? t('fund.s02.viz.good') : t('fund.s02.viz.bad')}
            </p>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              {t('fund.s02.p1.a')}
              <span className="text-quantum-cyan font-semibold">{t('fund.s02.p1.b')}</span>
              {t('fund.s02.p1.c')}
            </p>
            <p>
              {t('fund.s02.p2.a')}
              <span className="text-quantum-mint">{t('fund.s02.p2.b')}</span>
              {t('fund.s02.p2.c')}
              <span className="text-quantum-rose">{t('fund.s02.p2.d')}</span>
              {t('fund.s02.p2.e')}
            </p>
            <Callout variant="tip" title={t('fund.s02.callout.title')}>
              {t('fund.s02.callout.a')}
              <strong className="text-quantum-cyan">{t('fund.s02.callout.b')}</strong>
              {t('fund.s02.callout.c')}
              <strong className="text-quantum-violet">{t('fund.s02.callout.d')}</strong>
              {t('fund.s02.callout.e')}
            </Callout>
          </div>
        </div>
      </ScrollSection>

      {/* SVP */}
      <ScrollSection
        eyebrow={t('fund.s03.eyebrow')}
        title={t('fund.s03.title')}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col items-center">
            <LatticeViz goodBasis showShortest size={380} />
            <p className="mt-3 text-xs text-slate-400 text-center max-w-sm">
              {t('fund.s03.viz.caption')}
            </p>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              <strong className="text-quantum-cyan">{t('fund.s03.p1.a')}</strong>
              {t('fund.s03.p1.b')}
            </p>
            <Math display>{`\\text{SVP}(\\Lambda) = \\arg\\min_{\\mathbf{v} \\in \\Lambda \\setminus \\{0\\}} \\|\\mathbf{v}\\|`}</Math>
            <p>
              {t('fund.s03.p2.a')}
              <span className="text-quantum-mint font-semibold">{t('fund.s03.p2.b')}</span>
              {t('fund.s03.p2.c')}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-quantum-mint/30 bg-quantum-mint/5 p-3 flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-quantum-mint/15 text-quantum-mint shrink-0">
                  <Target size={14} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{t('fund.s03.card.good')}</p>
              </div>
              <div className="rounded-xl border border-quantum-rose/30 bg-quantum-rose/5 p-3 flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-quantum-rose/15 text-quantum-rose shrink-0">
                  <Target size={14} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{t('fund.s03.card.bad')}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* CVP */}
      <ScrollSection
        eyebrow={t('fund.s04.eyebrow')}
        title={t('fund.s04.title')}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col items-center gap-3">
            <LatticeViz goodBasis showTarget size={380} />
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              <strong className="text-quantum-cyan">{t('fund.s04.p1.a')}</strong>
              {t('fund.s04.p1.b')}
            </p>
            <Math display>{`\\text{CVP}(\\Lambda, \\mathbf{t}) = \\arg\\min_{\\mathbf{v} \\in \\Lambda} \\|\\mathbf{v} - \\mathbf{t}\\|`}</Math>
            <p>{t('fund.s04.p2')}</p>
            <Callout variant="info" title={t('fund.s04.callout.title')}>
              {t('fund.s04.callout.body')}
            </Callout>
          </div>
        </div>
      </ScrollSection>

      {/* LWE */}
      <ScrollSection
        eyebrow={t('fund.s05.eyebrow')}
        title={<>{t('fund.s05.title.a')}<span className="text-gradient-static">{t('fund.s05.title.b')}</span></>}
      >
        <div className="space-y-6 text-slate-300 leading-relaxed text-[17px]">
          <p>
            {t('fund.s05.lead.a')}
            <span className="text-quantum-cyan font-semibold">{t('fund.s05.lead.b')}</span>
            {t('fund.s05.lead.c')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-quantum p-6">
              <div className="text-xs uppercase tracking-widest text-quantum-rose mb-3">{t('fund.s05.noNoise')}</div>
              <Math display>{`b_i = \\mathbf{a}_i \\cdot \\mathbf{s} \\pmod{q}`}</Math>
              <p className="text-sm text-slate-400 mt-3">{t('fund.s05.noNoise.body')}</p>
            </div>
            <div className="card-quantum p-6 glow-cyan">
              <div className="text-xs uppercase tracking-widest text-quantum-cyan mb-3">{t('fund.s05.withNoise')}</div>
              <Math display>{`b_i = \\mathbf{a}_i \\cdot \\mathbf{s} + e_i \\pmod{q}`}</Math>
              <p className="text-sm text-slate-400 mt-3">{t('fund.s05.withNoise.body')}</p>
            </div>
          </div>

          <Callout variant="quote" title={t('fund.s05.callout.title')}>
            {t('fund.s05.callout.body')}
          </Callout>

          <div className="card-quantum p-7 mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
                <Sigma size={18} />
              </div>
              <h4 className="font-display text-lg font-semibold text-slate-100">
                {t('fund.s05.regev.title')}
              </h4>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed">{t('fund.s05.regev.body')}</p>
          </div>

          <LWENoisePlayground />
        </div>
      </ScrollSection>

      {/* Module-LWE */}
      <ScrollSection
        eyebrow={t('fund.s06.eyebrow')}
        title={t('fund.s06.title')}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              {t('fund.s06.p1.a')}
              <span className="text-quantum-cyan font-semibold">{t('fund.s06.p1.b')}</span>
              {t('fund.s06.p1.c')}
            </p>
            <p>
              {t('fund.s06.p2.a')}
              <span className="text-quantum-mint">{t('fund.s06.p2.b')}</span>
              {t('fund.s06.p2.c')}
            </p>
            <Math display>{`\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e} \\quad \\text{donde } \\mathbf{A} \\in R_q^{k \\times k}`}</Math>
          </div>

          <div className="card-quantum p-7 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
                <Layers3 size={18} />
              </div>
              <h4 className="font-display text-lg font-semibold text-slate-100">
                {t('fund.s06.ring.title')} · <Math>{`R_q = \\mathbb{Z}_q[x]/(x^n+1)`}</Math>
              </h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-quantum-cyan">•</span>
                <span>{t('fund.s06.ring.b1')}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-quantum-violet">•</span>
                <span>{t('fund.s06.ring.b2')}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-quantum-pink">•</span>
                <span>{t('fund.s06.ring.b3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </ScrollSection>

      {/* CÓDIGOS CORRECTORES */}
      <ScrollSection
        eyebrow={t('fund.s07.eyebrow')}
        title={<>{t('fund.s07.title.a')}<span className="text-quantum-cyan">{t('fund.s07.title.b')}</span></>}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex justify-center">
            <ZqCircle q={17} />
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              {t('fund.s07.p1.a')}
              <span className="text-quantum-cyan font-semibold">{t('fund.s07.p1.b')}</span>
              {t('fund.s07.p1.c')}
            </p>
            <div className="card-quantum p-5 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-quantum-cyan mb-1">{t('fund.s07.bit0')}</div>
                <Math display>{`0`}</Math>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-quantum-pink mb-1">{t('fund.s07.bit1')}</div>
                <Math display>{`\\lceil q/2 \\rceil`}</Math>
              </div>
            </div>
            <p>{t('fund.s07.p2')}</p>
            <p>
              {t('fund.s07.p3.a')}
              <span className="text-quantum-violet">{t('fund.s07.p3.b')}</span>
              {t('fund.s07.p3.c')}
            </p>
            <Callout variant="info" title={t('fund.s07.callout.title')}>
              {t('fund.s07.callout.body')}
            </Callout>
          </div>
        </div>
      </ScrollSection>

      <QuickQuiz
        quizId="fundamentos-reticulos"
        routeId="fundamentos"
        titleKey="fund.quiz.title"
        title={t('fund.quiz.title')}
        questions={[
          {
            question: t('fund.quiz.q1.q'),
            options: [t('fund.quiz.q1.o1'), t('fund.quiz.q1.o2'), t('fund.quiz.q1.o3'), t('fund.quiz.q1.o4')],
            correctIndex: 1,
            explanation: t('fund.quiz.q1.exp'),
          },
          {
            question: t('fund.quiz.q2.q'),
            options: [t('fund.quiz.q2.o1'), t('fund.quiz.q2.o2'), t('fund.quiz.q2.o3'), t('fund.quiz.q2.o4')],
            correctIndex: 1,
            explanation: t('fund.quiz.q2.exp'),
          },
          {
            question: t('fund.quiz.q3.q'),
            options: [t('fund.quiz.q3.o1'), t('fund.quiz.q3.o2'), t('fund.quiz.q3.o3'), t('fund.quiz.q3.o4')],
            correctIndex: 1,
            explanation: t('fund.quiz.q3.exp'),
          },
        ]}
      />

      {/* HASHES */}
      <ScrollSection
        eyebrow={t('fund.s08.eyebrow')}
        title={t('fund.s08.title')}
      >
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { icon: <Hash size={20} />, title: t('fund.s08.c1.title'), desc: t('fund.s08.c1.desc'), color: 'text-quantum-cyan' },
            { icon: <Workflow size={20} />, title: t('fund.s08.c2.title'), desc: t('fund.s08.c2.desc'), color: 'text-quantum-violet' },
            { icon: <Key size={20} />, title: t('fund.s08.c3.title'), desc: t('fund.s08.c3.desc'), color: 'text-quantum-pink' },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-quantum p-6"
            >
              <div className={`${c.color} mb-3`}>{c.icon}</div>
              <h4 className="font-display font-semibold text-slate-100 mb-2">{c.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="font-display text-xl font-semibold text-slate-100 mb-4">
          {t('fund.s08.roles.title')}
        </h3>
        <div className="space-y-3">
          {[
            { n: '1', title: t('fund.s08.role1.title'), desc: t('fund.s08.role1.desc') },
            { n: '2', title: t('fund.s08.role2.title'), desc: t('fund.s08.role2.desc') },
            { n: '3', title: t('fund.s08.role3.title'), desc: t('fund.s08.role3.desc') },
            { n: '4', title: t('fund.s08.role4.title'), desc: t('fund.s08.role4.desc') },
          ].map((r) => (
            <div key={r.n} className="card-quantum p-5 flex gap-4 items-start">
              <div className="font-mono text-2xl font-bold text-gradient-static shrink-0 w-10">
                {r.n}
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-1">{r.title}</h4>
                <p className="text-sm text-slate-400">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollSection>

      <ScrollSection
        eyebrow={t('fund.s09.eyebrow')}
        title={t('fund.s09.title')}
      >
        <div className="card-quantum p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[t('fund.s09.step1'), t('fund.s09.step2'), t('fund.s09.step3'), t('fund.s09.step4')].map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              <div className="font-display font-bold text-slate-100 text-lg md:text-xl py-4 rounded-xl border border-quantum-border bg-quantum-panel/40">
                {s}
              </div>
              {i < 3 && (
                <ArrowRight
                  className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-quantum-cyan"
                  size={20}
                />
              )}
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-slate-400 max-w-2xl mx-auto">
          {t('fund.s09.foot')}
        </p>
      </ScrollSection>

      <div className="text-center my-16">
        <button
          onClick={() => onChange('aplicaciones')}
          className="btn-quantum"
        >
          {t('fund.continue')} <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default FundamentosRoute;
