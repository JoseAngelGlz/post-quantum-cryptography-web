import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  Lock,
  Mail,
  ServerCrash,
  ShieldCheck,
  Skull,
  Sparkles,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react';
import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import Callout from '../shared/Callout';
import QuickQuiz from '../shared/QuickQuiz';
import Math from '../shared/Math';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const AplicacionesRoute: React.FC<RouteProps> = ({ onChange }) => {
  const t = useT();
  return (
    <div>
      <Hero
        eyebrow={t('apps.hero.eyebrow')}
        hueA={250}
        hueB={310}
        title={
          <>
            <span className="text-gradient-quantum">{t('apps.hero.titleLine1')}</span>
            <br />
            {t('apps.hero.titleLine2')}
          </>
        }
        subtitle={t('apps.hero.subtitle')}
      />

      <ScrollSection
        eyebrow={t('apps.s01.eyebrow')}
        title={t('apps.s01.title')}
      >
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { icon: <Globe size={22} />, label: t('apps.s01.use.tls'), desc: t('apps.s01.use.tls.desc') },
            { icon: <Mail size={22} />, label: t('apps.s01.use.msg'), desc: t('apps.s01.use.msg.desc') },
            { icon: <Wallet size={22} />, label: t('apps.s01.use.bank'), desc: t('apps.s01.use.bank.desc') },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-quantum p-6 flex items-center gap-4"
            >
              <div className="p-3 rounded-xl bg-quantum-cyan/10 text-quantum-cyan">{c.icon}</div>
              <div>
                <div className="font-display font-semibold text-slate-100">{c.label}</div>
                <div className="text-xs text-slate-400">{c.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-quantum p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
                <Lock size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-100">RSA</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">{t('apps.s01.rsa.body')}</p>
            <Math display>{`n = p \\cdot q \\quad \\text{(con } p,q \\text{ primos secretos)}`}</Math>
          </div>
          <div className="card-quantum p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-quantum-pink/10 text-quantum-pink">
                <Lock size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-100">ECDH</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">{t('apps.s01.ecdh.body')}</p>
            <Math display>{`Q = k \\cdot P \\quad \\text{(hallar } k \\text{ desde } Q,P \\text{ es duro)}`}</Math>
          </div>
        </div>
      </ScrollSection>

      {/* SHOR */}
      <ScrollSection
        eyebrow={t('apps.s02.eyebrow')}
        title={<>{t('apps.s02.title.a')}<span className="text-quantum-rose">{t('apps.s02.title.b')}</span></>}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              {t('apps.s02.p1.a')}
              <span className="text-quantum-violet font-semibold">{t('apps.s02.p1.b')}</span>
              {t('apps.s02.p1.c')}
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-3">
                <Zap size={16} className="text-quantum-rose mt-1 shrink-0" />
                {t('apps.s02.b1')}
              </li>
              <li className="flex gap-3">
                <Zap size={16} className="text-quantum-rose mt-1 shrink-0" />
                {t('apps.s02.b2')}
              </li>
            </ul>
            <p>
              {t('apps.s02.p2.a')}
              <span className="text-quantum-rose font-semibold">{t('apps.s02.p2.b')}</span>
              {t('apps.s02.p2.c')}
            </p>
          </div>

          <div className="card-quantum p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-quantum-rose/10 to-quantum-violet/10 pointer-events-none" />
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { algo: 'RSA-2048', cls: t('apps.s02.tbl.rsa.cls'), q: t('apps.s02.tbl.rsa.q'), danger: true },
                  { algo: 'ECDH P-256', cls: t('apps.s02.tbl.ecdh.cls'), q: t('apps.s02.tbl.ecdh.q'), danger: true },
                  { algo: 'AES-256', cls: t('apps.s02.tbl.aes.cls'), q: t('apps.s02.tbl.aes.q'), danger: false },
                  { algo: 'ML-KEM-768', cls: t('apps.s02.tbl.mlkem.cls'), q: t('apps.s02.tbl.mlkem.q'), danger: false },
                ].map((r) => (
                  <div
                    key={r.algo}
                    className={`p-4 rounded-xl border ${
                      r.danger
                        ? 'border-quantum-rose/40 bg-quantum-rose/5'
                        : 'border-quantum-mint/40 bg-quantum-mint/5'
                    }`}
                  >
                    <div className="font-mono text-xs text-slate-400 mb-1">{r.algo}</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-widest mt-2">{t('apps.s02.tbl.classic')}</div>
                    <div className="font-semibold text-slate-200">{r.cls}</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-widest mt-1.5">{t('apps.s02.tbl.quantum')}</div>
                    <div className={`font-semibold ${r.danger ? 'text-quantum-rose' : 'text-quantum-mint'}`}>
                      {r.q}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* GROVER */}
      <ScrollSection
        eyebrow={t('apps.s03.eyebrow')}
        title={t('apps.s03.title')}
      >
        <div className="card-quantum p-8">
          <p className="text-slate-300 leading-relaxed text-[17px] mb-4">
            <span className="text-quantum-violet font-semibold">{t('apps.s03.p1.a')}</span>
            {t('apps.s03.p1.b')}
            <span className="text-quantum-cyan">{t('apps.s03.p1.c')}</span>
            {t('apps.s03.p1.d')}
          </p>
          <Math display>{`O(2^n) \\quad \\longrightarrow \\quad O(2^{n/2})`}</Math>
          <p className="text-slate-300 leading-relaxed text-[17px] mt-4">{t('apps.s03.p2.a')}</p>
          <Callout variant="tip" title={t('apps.s03.callout.title')}>
            {t('apps.s03.callout.body.a')}
            <strong className="text-quantum-cyan">{t('apps.s03.callout.body.b')}</strong>
            {t('apps.s03.callout.body.c')}
          </Callout>
        </div>
      </ScrollSection>

      <QuickQuiz
        quizId="aplicaciones-shor"
        routeId="aplicaciones"
        titleKey="apps.quiz1.title"
        title={t('apps.quiz1.title')}
        questions={[
          {
            question: t('apps.quiz1.q1.q'),
            options: [t('apps.quiz1.q1.o1'), t('apps.quiz1.q1.o2'), t('apps.quiz1.q1.o3'), t('apps.quiz1.q1.o4')],
            correctIndex: 1,
            explanation: t('apps.quiz1.q1.exp'),
          },
          {
            question: t('apps.quiz1.q2.q'),
            options: [t('apps.quiz1.q2.o1'), t('apps.quiz1.q2.o2'), t('apps.quiz1.q2.o3'), t('apps.quiz1.q2.o4')],
            correctIndex: 1,
            explanation: t('apps.quiz1.q2.exp'),
          },
        ]}
      />

      {/* FAMILIAS */}
      <ScrollSection
        eyebrow={t('apps.s04.eyebrow')}
        title={t('apps.s04.title')}
      >
        <p className="text-slate-300 max-w-3xl mb-10 text-[17px] leading-relaxed">{t('apps.s04.lead')}</p>

        <div className="space-y-4">
          {[
            {
              name: t('apps.s04.lat.name'),
              base: t('apps.s04.lat.base'),
              status: t('apps.s04.lat.status'),
              examples: t('apps.s04.lat.ex'),
              note: t('apps.s04.lat.note'),
              color: 'border-quantum-cyan/40 bg-quantum-cyan/5',
              icon: <ShieldCheck size={22} className="text-quantum-cyan" />,
            },
            {
              name: t('apps.s04.cod.name'),
              base: t('apps.s04.cod.base'),
              status: t('apps.s04.cod.status'),
              examples: t('apps.s04.cod.ex'),
              note: t('apps.s04.cod.note'),
              color: 'border-quantum-violet/40 bg-quantum-violet/5',
              icon: <ShieldCheck size={22} className="text-quantum-violet" />,
            },
            {
              name: t('apps.s04.hash.name'),
              base: t('apps.s04.hash.base'),
              status: t('apps.s04.hash.status'),
              examples: t('apps.s04.hash.ex'),
              note: t('apps.s04.hash.note'),
              color: 'border-quantum-mint/40 bg-quantum-mint/5',
              icon: <ShieldCheck size={22} className="text-quantum-mint" />,
            },
            {
              name: t('apps.s04.mv.name'),
              base: t('apps.s04.mv.base'),
              status: t('apps.s04.mv.status'),
              examples: t('apps.s04.mv.ex'),
              note: t('apps.s04.mv.note'),
              color: 'border-quantum-amber/40 bg-quantum-amber/5',
              icon: <AlertTriangle size={22} className="text-quantum-amber" />,
            },
            {
              name: t('apps.s04.iso.name'),
              base: t('apps.s04.iso.base'),
              status: t('apps.s04.iso.status'),
              examples: t('apps.s04.iso.ex'),
              note: t('apps.s04.iso.note'),
              color: 'border-quantum-rose/40 bg-quantum-rose/5',
              icon: <Skull size={22} className="text-quantum-rose" />,
            },
          ].map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`rounded-2xl border ${f.color} p-6 grid md:grid-cols-[auto,1fr] gap-5 items-start`}
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                {f.icon}
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-100">{f.name}</h3>
                  <div className="text-xs text-slate-400 mt-1 font-mono">{f.status}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest">{t('apps.s04.col.base')}</span>
                  <div className="text-slate-200 font-mono">{f.base}</div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest">{t('apps.s04.col.ex')}</span>
                  <div className="text-slate-200 font-mono">{f.examples}</div>
                </div>
                <p className="text-slate-400 pt-1">{f.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollSection>

      {/* IND-CPA vs IND-CCA2 */}
      <ScrollSection
        eyebrow={t('apps.s05.eyebrow')}
        title={
          <>
            {t('apps.s05.title.a')}<span className="text-gradient-static">{t('apps.s05.title.b')}</span>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-quantum p-7"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-quantum-blue/10 text-quantum-blue">
                <Eye size={18} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-100">IND-CPA</h3>
            </div>
            <p className="text-xs uppercase tracking-widest text-quantum-blue mb-3">
              {t('apps.s05.cpa.kind')}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{t('apps.s05.cpa.body')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-quantum p-7 glow-violet"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
                <EyeOff size={18} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-100">IND-CCA2</h3>
            </div>
            <p className="text-xs uppercase tracking-widest text-quantum-violet mb-3">
              {t('apps.s05.cca.kind')}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('apps.s05.cca.body.a')}
              <strong className="text-quantum-cyan">{t('apps.s05.cca.body.b')}</strong>
              {t('apps.s05.cca.body.c')}
            </p>
          </motion.div>
        </div>

        <Callout variant="info" title={t('apps.s05.callout.title')}>
          {t('apps.s05.callout.body')}
        </Callout>
      </ScrollSection>

      {/* FUJISAKI-OKAMOTO */}
      <ScrollSection
        eyebrow={t('apps.s06.eyebrow')}
        title={t('apps.s06.title')}
      >
        <div className="space-y-6 text-slate-300 leading-relaxed text-[17px]">
          <p>
            {t('apps.s06.p1.a')}
            <span className="text-quantum-rose font-semibold">{t('apps.s06.p1.b')}</span>
            {t('apps.s06.p1.c')}
          </p>

          <div className="card-quantum p-7">
            <div className="flex items-center gap-3 mb-4">
              <ServerCrash size={20} className="text-quantum-rose" />
              <h4 className="font-display text-lg font-semibold text-slate-100">
                {t('apps.s06.attack.title')}
              </h4>
            </div>
            <ol className="space-y-2 ml-5 list-decimal text-sm">
              <li>{t('apps.s06.attack.s1')}</li>
              <li>{t('apps.s06.attack.s2')}</li>
              <li>{t('apps.s06.attack.s3')}</li>
              <li>{t('apps.s06.attack.s4')}</li>
              <li>{t('apps.s06.attack.s5')}</li>
            </ol>
          </div>

          <div className="card-quantum p-7 glow-cyan">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={20} className="text-quantum-cyan" />
              <h4 className="font-display text-lg font-semibold text-slate-100">
                {t('apps.s06.idea.title')}
              </h4>
            </div>
            <p>
              {t('apps.s06.idea.p.a')}
              <span className="text-quantum-cyan font-semibold">{t('apps.s06.idea.p.b')}</span>
              {t('apps.s06.idea.p.c')}
            </p>
            <Math display>{`r = \\text{Hash}(m)`}</Math>
            <p>{t('apps.s06.idea.consequences')}</p>
            <ul className="ml-5 list-disc space-y-1 text-sm text-slate-300">
              <li>{t('apps.s06.idea.c1.a')}</li>
              <li>
                {t('apps.s06.idea.c2.a')}
                <strong className="text-quantum-cyan">{t('apps.s06.idea.c2.b')}</strong>
                {t('apps.s06.idea.c2.c')}
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: t('apps.s06.step1.title'), desc: t('apps.s06.step1.desc'), icon: <Lock size={20} /> },
              { step: t('apps.s06.step2.title'), desc: t('apps.s06.step2.desc'), icon: <Fingerprint size={20} /> },
              { step: t('apps.s06.step3.title'), desc: t('apps.s06.step3.desc'), icon: <CheckCircle2 size={20} /> },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-quantum p-5"
              >
                <div className="text-quantum-cyan mb-2">{s.icon}</div>
                <h5 className="font-display font-semibold text-slate-100 mb-1">
                  {i + 1}. {s.step}
                </h5>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <Callout variant="tip" title={t('apps.s06.implicit.title')}>
            {t('apps.s06.implicit.body')}
          </Callout>
        </div>
      </ScrollSection>

      <ScrollSection
        eyebrow={t('apps.s07.eyebrow')}
        title={t('apps.s07.title')}
      >
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card-quantum p-6">
            <div className="flex items-center gap-2 mb-3 text-quantum-rose">
              <XCircle size={18} />
              <span className="font-display font-semibold">{t('apps.s07.case1.title')}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{t('apps.s07.case1.body')}</p>
          </div>
          <div className="card-quantum p-6">
            <div className="flex items-center gap-2 mb-3 text-quantum-rose">
              <XCircle size={18} />
              <span className="font-display font-semibold">{t('apps.s07.case2.title')}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{t('apps.s07.case2.body')}</p>
          </div>
        </div>
      </ScrollSection>

      <QuickQuiz
        quizId="aplicaciones-fo"
        routeId="aplicaciones"
        titleKey="apps.quiz2.title"
        title={t('apps.quiz2.title')}
        questions={[
          {
            question: t('apps.quiz2.q1.q'),
            options: [t('apps.quiz2.q1.o1'), t('apps.quiz2.q1.o2'), t('apps.quiz2.q1.o3'), t('apps.quiz2.q1.o4')],
            correctIndex: 1,
            explanation: t('apps.quiz2.q1.exp'),
          },
          {
            question: t('apps.quiz2.q2.q'),
            options: [t('apps.quiz2.q2.o1'), t('apps.quiz2.q2.o2'), t('apps.quiz2.q2.o3'), t('apps.quiz2.q2.o4')],
            correctIndex: 1,
            explanation: t('apps.quiz2.q2.exp'),
          },
        ]}
      />

      <div className="text-center my-16">
        <button onClick={() => onChange('mlkem')} className="btn-quantum">
          {t('apps.continue')} <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default AplicacionesRoute;
