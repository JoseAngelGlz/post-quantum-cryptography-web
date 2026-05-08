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
import FeedbackForm from '../shared/FeedbackForm';
import RouteSwitcher from '../shared/RouteSwitcher';
import type { RouteId } from '../../routes';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const families = [
  {
    name: 'Retículos',
    base: 'LWE / SVP',
    status: 'Estandarizado',
    example: 'ML-KEM, ML-DSA',
    color: 'from-quantum-cyan/20 to-quantum-blue/10',
    icon: <Network size={22} />,
    accent: 'text-quantum-cyan',
  },
  {
    name: 'Códigos',
    base: 'Decodificar códigos',
    status: 'Estandarizado',
    example: 'Classic McEliece',
    color: 'from-quantum-violet/20 to-quantum-pink/10',
    icon: <Radio size={22} />,
    accent: 'text-quantum-violet',
  },
  {
    name: 'Hashes',
    base: 'Resistencia a colisiones',
    status: 'Estandarizado',
    example: 'SLH-DSA',
    color: 'from-quantum-mint/20 to-quantum-cyan/10',
    icon: <KeyRound size={22} />,
    accent: 'text-quantum-mint',
  },
  {
    name: 'Multivariantes',
    base: 'MQ Problem',
    status: 'En evaluación',
    example: 'MAYO, UOV',
    color: 'from-quantum-amber/20 to-quantum-rose/10',
    icon: <Cpu size={22} />,
    accent: 'text-quantum-amber',
  },
  {
    name: 'Isogenias',
    base: 'Grafo de curvas',
    status: 'Roto en 2022',
    example: 'CSIDH, SQIsign',
    color: 'from-quantum-rose/20 to-quantum-pink/10',
    icon: <Skull size={22} />,
    accent: 'text-quantum-rose',
  },
];

const IntroRoute: React.FC<RouteProps> = ({ onChange }) => {
  return (
    <div>
      <Hero
        eyebrow="Trabajo de Fin de Grado"
        title={
          <>
            Criptografía
            <br />
            <span className="text-gradient-quantum">Post-Cuántica</span>
          </>
        }
        subtitle={
          <>
            Una recorrida visual e interactiva por la matemática que defenderá internet
            cuando lleguen los ordenadores cuánticos. Aprende a tu ritmo, paso a paso.
          </>
        }
      />

      <ScrollSection
        eyebrow="01 · Punto de partida"
        title={
          <>
            ¿Qué es la criptografía <span className="text-gradient-static">post-cuántica</span>?
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-slate-300 leading-relaxed text-[17px]">
            <p>
              Es el conjunto de algoritmos criptográficos diseñados para
              resistir ataques tanto de ordenadores clásicos como{' '}
              <span className="text-quantum-cyan font-semibold">cuánticos</span>.
            </p>
            <p>
              Hoy, prácticamente toda la seguridad de internet (TLS, SSH, VPN, mensajería,
              banca) se apoya en dos problemas matemáticos:{' '}
              <span className="text-quantum-violet">factorizar enteros gigantes</span> y el{' '}
              <span className="text-quantum-violet">logaritmo discreto</span>.
            </p>
            <p>
              Un ordenador cuántico suficientemente grande podría romper ambos en cuestión
              de horas. Por eso necesitamos sustitutos.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="card-quantum p-8 grid grid-cols-2 gap-4"
          >
            {[
              { icon: <Lock size={22} />, label: 'RSA', sub: 'Vulnerable', color: 'text-quantum-rose' },
              { icon: <Lock size={22} />, label: 'ECDH', sub: 'Vulnerable', color: 'text-quantum-rose' },
              { icon: <ShieldCheck size={22} />, label: 'ML-KEM', sub: 'Resistente', color: 'text-quantum-mint' },
              { icon: <ShieldCheck size={22} />, label: 'ML-DSA', sub: 'Resistente', color: 'text-quantum-mint' },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-quantum-border bg-quantum-panel/40 p-4 flex flex-col items-center gap-1"
              >
                <div className={c.color}>{c.icon}</div>
                <span className="font-mono font-semibold text-slate-100">{c.label}</span>
                <span className={`text-xs ${c.color}`}>{c.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </ScrollSection>

      <ScrollSection
        eyebrow="02 · La amenaza cuántica"
        title="¿Por qué ahora?"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              year: '1994',
              title: 'Algoritmo de Shor',
              text: 'Peter Shor demuestra que un ordenador cuántico puede factorizar enteros y resolver el logaritmo discreto en tiempo polinómico.',
              icon: <Cpu size={20} />,
            },
            {
              year: '2024',
              title: 'NIST publica FIPS 203',
              text: 'Tras casi una década de evaluación, el NIST estandariza ML-KEM como el primer KEM post-cuántico oficial.',
              icon: <ShieldCheck size={20} />,
            },
            {
              year: '203X',
              title: 'Q-day',
              text: 'Se estima que en 10–20 años podría existir un ordenador cuántico capaz de romper RSA-2048. Migrar lleva años: hay que empezar ya.',
              icon: <Timer size={20} />,
            },
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
        eyebrow="03 · El ataque silencioso"
        title={
          <>
            <span className="text-quantum-rose">Cosecha ahora,</span>{' '}
            <span className="text-quantum-cyan">descifra después</span>
          </>
        }
      >
        <div className="grid md:grid-cols-5 gap-4 mb-10">
          {[
            { step: 1, title: 'Hoy', desc: 'Atacante intercepta y guarda tráfico cifrado masivamente.', icon: <Database size={18} /> },
            { step: 2, title: 'Hoy', desc: 'No puede leerlo. Lo almacena en discos baratos por años.', icon: <Lock size={18} /> },
            { step: 3, title: 'Mañana', desc: 'Aparece un ordenador cuántico potente.', icon: <Cpu size={18} /> },
            { step: 4, title: 'Mañana', desc: 'Descifra retrospectivamente todo lo guardado.', icon: <AlertTriangle size={18} /> },
            { step: 5, title: 'Resultado', desc: 'Datos sensibles de hoy quedan al descubierto en 15 años.', icon: <Skull size={18} /> },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-quantum p-5 relative"
            >
              <div className="text-xs font-mono text-quantum-cyan mb-2">PASO {s.step}</div>
              <div className="text-quantum-violet mb-2">{s.icon}</div>
              <div className="font-semibold text-slate-100 mb-1 text-sm">{s.title}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <Callout variant="warning" title="Razón principal de la urgencia actual">
          Datos de hoy (sanitarios, secretos comerciales, comunicaciones diplomáticas)
          seguirán siendo sensibles en 15 años. Por eso el NIST estandarizó ML-KEM en
          agosto de 2024 y la migración debe empezar ya, antes de que exista la máquina
          que rompa lo actual.
        </Callout>
      </ScrollSection>

      <QuickQuiz
        title="Comprobación rápida"
        questions={[
          {
            question:
              '¿Cuál es la idea central del ataque "harvest now, decrypt later"?',
            options: [
              'Atacar redes cuánticas en tiempo real para robar claves.',
              'Guardar hoy tráfico cifrado para descifrarlo cuando exista un ordenador cuántico potente.',
              'Sustituir RSA por ML-KEM en todas las conexiones inmediatamente.',
              'Generar ruido cuántico para confundir a los servidores actuales.',
            ],
            correctIndex: 1,
            explanation:
              'No hace falta romper nada hoy: basta con grabar el tráfico cifrado. La amenaza está en el futuro, pero los datos sensibles ya están viajando por la red.',
          },
          {
            question:
              '¿Sobre qué problema NO se basa la criptografía clásica que está amenazada?',
            options: [
              'Factorizar enteros enormes (RSA).',
              'Logaritmo discreto en curvas elípticas (ECDH).',
              'Encontrar el vector más corto en un retículo.',
              'Logaritmo discreto en grupos multiplicativos.',
            ],
            correctIndex: 2,
            explanation:
              'El SVP (vector más corto en un retículo) es precisamente uno de los problemas en los que se apoya la criptografía post-cuántica. Los otros tres son los que Shor sabe romper.',
          },
        ]}
      />

      <ScrollSection
        eyebrow="04 · El ecosistema"
        title="Cinco familias post-cuánticas"
      >
        <p className="text-slate-300 mb-10 max-w-3xl text-[17px] leading-relaxed">
          No hay un único camino para resistir a la cuántica: existen{' '}
          <span className="text-quantum-cyan">cinco familias</span> de problemas matemáticos
          duros. El NIST evalúa varias en paralelo para no depender de una sola.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {families.map((f, i) => (
            <motion.div
              key={f.name}
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
                    {f.status}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-100 mb-2">
                  {f.name}
                </h3>
                <div className="text-xs text-slate-400 mb-3">
                  Problema base: <span className="font-mono text-slate-300">{f.base}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Ejemplo: <span className="font-mono text-slate-300">{f.example}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Callout variant="quote" title="ML-KEM (FIPS 203)">
          Pertenece a la familia de <strong className="text-quantum-cyan">retículos</strong>.
          Su seguridad descansa en el problema <em>Module-LWE</em>, que el algoritmo de Shor
          no sabe atacar. Es el primer KEM post-cuántico estandarizado por el NIST y será
          el protagonista del resto de este TFG.
        </Callout>
      </ScrollSection>

      <ScrollSection
        eyebrow="05 · Lo que vamos a explorar"
        title="¿Hacia dónde vamos?"
      >
        <div className="grid md:grid-cols-2 gap-6 text-slate-300">
          <div className="card-quantum p-7 space-y-3">
            <h3 className="font-display text-xl font-semibold text-quantum-cyan mb-2">
              La pregunta central
            </h3>
            <p className="text-[15px] leading-relaxed">
              ¿Cómo dos personas pueden acordar una clave secreta sobre un canal público
              de manera que ni un ordenador clásico ni uno cuántico puedan espiarla?
            </p>
          </div>
          <div className="card-quantum p-7 space-y-3">
            <h3 className="font-display text-xl font-semibold text-quantum-violet mb-2">
              La respuesta del NIST
            </h3>
            <p className="text-[15px] leading-relaxed">
              <span className="font-mono text-quantum-cyan">ML-KEM</span>: un mecanismo de
              encapsulación de claves basado en retículos modulares. Vamos a entender cada
              pieza desde cero.
            </p>
          </div>
        </div>
      </ScrollSection>

      <RouteSwitcher current="intro" onChange={onChange} />

      <FeedbackForm routeId="intro" routeName="la introducción" />
    </div>
  );
};

export default IntroRoute;
