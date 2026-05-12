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
import FeedbackForm from '../shared/FeedbackForm';
import Math from '../shared/Math';
import type { RouteId } from '../../routes';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const AplicacionesRoute: React.FC<RouteProps> = ({ onChange }) => {
  return (
    <div>
      <Hero
        eyebrow="Visión panorámica"
        hueA={250}
        hueB={310}
        title={
          <>
            <span className="text-gradient-quantum">Aplicaciones</span>
            <br />
            criptográficas
          </>
        }
        subtitle="De RSA al algoritmo de Shor, las cinco familias post-cuánticas y los conceptos de seguridad que dan forma a ML-KEM."
      />

      {/* CRIPTOGRAFÍA HOY */}
      <ScrollSection
        eyebrow="01 · Punto de partida"
        title="Lo que hoy protege internet"
      >
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { icon: <Globe size={22} />, label: 'TLS / HTTPS', desc: 'Cada visita a una web' },
            { icon: <Mail size={22} />, label: 'Mensajería cifrada', desc: 'WhatsApp, Signal, iMessage' },
            { icon: <Wallet size={22} />, label: 'Banca y firma', desc: 'Pagos, identidad digital' },
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
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Su seguridad se basa en lo difícil que es factorizar números enormes en
              sus primos.
            </p>
            <Math display>{`n = p \\cdot q \\quad \\text{(con } p,q \\text{ primos secretos)}`}</Math>
          </div>
          <div className="card-quantum p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-quantum-pink/10 text-quantum-pink">
                <Lock size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-100">ECDH</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Se basa en el logaritmo discreto sobre curvas elípticas, otro problema
              clásicamente duro.
            </p>
            <Math display>{`Q = k \\cdot P \\quad \\text{(hallar } k \\text{ desde } Q,P \\text{ es duro)}`}</Math>
          </div>
        </div>
      </ScrollSection>

      {/* SHOR */}
      <ScrollSection
        eyebrow="02 · 1994"
        title={<>El <span className="text-quantum-rose">algoritmo de Shor</span></>}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              En 1994 Peter Shor descubrió un algoritmo que un ordenador{' '}
              <span className="text-quantum-violet font-semibold">cuántico</span> puede
              ejecutar para:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-3">
                <Zap size={16} className="text-quantum-rose mt-1 shrink-0" />
                Factorizar enteros enormes en tiempo polinómico.
              </li>
              <li className="flex gap-3">
                <Zap size={16} className="text-quantum-rose mt-1 shrink-0" />
                Resolver el logaritmo discreto en grupos abelianos.
              </li>
            </ul>
            <p>
              Esto significa que, el día que exista un ordenador cuántico
              suficientemente grande,{' '}
              <span className="text-quantum-rose font-semibold">RSA y ECDH caen</span>.
              Y con ellos, la mayor parte de internet.
            </p>
          </div>

          <div className="card-quantum p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-quantum-rose/10 to-quantum-violet/10 pointer-events-none" />
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { algo: 'RSA-2048', cls: '~10²² años', q: 'horas', danger: true },
                  { algo: 'ECDH P-256', cls: '~10²⁸ años', q: 'minutos', danger: true },
                  { algo: 'AES-256', cls: '~10⁵² años', q: '~10²⁶ años', danger: false },
                  { algo: 'ML-KEM-768', cls: 'inviable', q: 'inviable', danger: false },
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
                    <div className="text-[11px] text-slate-500 uppercase tracking-widest mt-2">Clásico</div>
                    <div className="font-semibold text-slate-200">{r.cls}</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-widest mt-1.5">Cuántico</div>
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
        eyebrow="03 · El otro algoritmo cuántico"
        title="Grover y por qué AES sobrevive"
      >
        <div className="card-quantum p-8">
          <p className="text-slate-300 leading-relaxed text-[17px] mb-4">
            <span className="text-quantum-violet font-semibold">Grover</span> es un
            algoritmo cuántico que acelera búsquedas no estructuradas, pero solo da una
            <span className="text-quantum-cyan"> aceleración cuadrática</span>:
          </p>
          <Math display>{`O(2^n) \\quad \\longrightarrow \\quad O(2^{n/2})`}</Math>
          <p className="text-slate-300 leading-relaxed text-[17px] mt-4">
            Esto significa que <span className="font-mono">AES-128</span> queda con la
            seguridad efectiva de <span className="font-mono">AES-64</span> (insuficiente),
            pero <span className="font-mono">AES-256</span> queda como{' '}
            <span className="font-mono">AES-128</span> (de sobra).
          </p>
          <Callout variant="tip" title="Conclusión práctica">
            La criptografía simétrica (AES, ChaCha20, SHA-3) sobrevive simplemente
            duplicando el tamaño de clave. La que necesita rediseño completo es la{' '}
            <strong className="text-quantum-cyan">criptografía de clave pública</strong>.
          </Callout>
        </div>
      </ScrollSection>

      <QuickQuiz
        quizId="aplicaciones-shor"
        routeId="aplicaciones"
        title="Mini-test rápido"
        questions={[
          {
            question: '¿Por qué Shor amenaza RSA pero no AES?',
            options: [
              'Porque RSA usa números más grandes que AES.',
              'Porque Shor explota la estructura algebraica (factorización, log discreto), que AES no tiene.',
              'Porque AES usa GPU y RSA no.',
              'Porque AES ya es cuántico.',
            ],
            correctIndex: 1,
            explanation:
              'Shor aprovecha la estructura periódica de los problemas en los que se basa RSA/ECDH. AES no tiene esa estructura, así que solo le aplica Grover, que es mucho más débil.',
          },
          {
            question: '¿Qué se hace con AES-128 ante la amenaza de Grover?',
            options: [
              'Sustituirlo por ML-KEM.',
              'Migrar a AES-256, donde Grover deja una seguridad efectiva equivalente a AES-128.',
              'Dejarlo como está, no le afecta.',
              'Cifrar dos veces seguidas.',
            ],
            correctIndex: 1,
            explanation:
              'Doblar el tamaño de clave en simétrica es suficiente. El verdadero problema es la clave pública (RSA, ECDH), que sí requiere algoritmos nuevos.',
          },
        ]}
      />

      {/* FAMILIAS */}
      <ScrollSection
        eyebrow="04 · El zoo post-cuántico"
        title="Cinco familias, una misión"
      >
        <p className="text-slate-300 max-w-3xl mb-10 text-[17px] leading-relaxed">
          El NIST evaluó algoritmos de cinco familias matemáticas distintas. La idea: si
          una resulta vulnerable, las otras siguen en pie.
        </p>

        <div className="space-y-4">
          {[
            {
              name: 'Retículos',
              base: 'LWE, Module-LWE, Module-SIS',
              status: '✓ Estandarizado (FIPS 203, 204)',
              examples: 'ML-KEM (KEM), ML-DSA (firmas), Falcon',
              note: 'La familia más madura y eficiente. ML-KEM es nuestro protagonista.',
              color: 'border-quantum-cyan/40 bg-quantum-cyan/5',
              icon: <ShieldCheck size={22} className="text-quantum-cyan" />,
            },
            {
              name: 'Códigos correctores',
              base: 'Decodificar códigos lineales aleatorios',
              status: '✓ Estandarizado (Classic McEliece)',
              examples: 'Classic McEliece, BIKE, HQC',
              note: 'La idea más antigua de la PQC (McEliece, 1978). Claves enormes pero seguridad muy estudiada.',
              color: 'border-quantum-violet/40 bg-quantum-violet/5',
              icon: <ShieldCheck size={22} className="text-quantum-violet" />,
            },
            {
              name: 'Funciones hash',
              base: 'Resistencia a colisiones / preimagen',
              status: '✓ Estandarizado (FIPS 205)',
              examples: 'SLH-DSA (SPHINCS+)',
              note: 'Solo firmas. Seguridad mínima asumida (solo hashes), pero firmas grandes y lentas.',
              color: 'border-quantum-mint/40 bg-quantum-mint/5',
              icon: <ShieldCheck size={22} className="text-quantum-mint" />,
            },
            {
              name: 'Multivariantes',
              base: 'Resolver sistemas cuadráticos sobre campos finitos (MQ)',
              status: '⏳ En evaluación',
              examples: 'MAYO, UOV, QR-UOV',
              note: 'Rainbow fue roto en 2022 por Beullens. La familia sigue viva pero más cauta.',
              color: 'border-quantum-amber/40 bg-quantum-amber/5',
              icon: <AlertTriangle size={22} className="text-quantum-amber" />,
            },
            {
              name: 'Isogenias',
              base: 'Caminos en grafos de curvas elípticas',
              status: '✗ SIKE roto en 2022',
              examples: 'CSIDH, SQIsign',
              note: 'Castryck y Decru rompieron SIKE en horas en un portátil. Esquemas vivos sí los hay, pero el campo perdió confianza.',
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
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest">Problema base</span>
                  <div className="text-slate-200 font-mono">{f.base}</div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest">Esquemas</span>
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
        eyebrow="05 · Modelos de seguridad"
        title={
          <>
            IND-CPA vs <span className="text-gradient-static">IND-CCA2</span>
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
              Atacante pasivo
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Eva solo escucha. No puede modificar ni inyectar mensajes. Le mostramos dos
              mensajes y un cifrado, y debe adivinar cuál se cifró: si no puede hacerlo
              mejor que al azar, el esquema es IND-CPA.
            </p>
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
              Atacante activo
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Eva puede modificar mensajes, enviarlos a la víctima y observar respuestas.
              Es el escenario realista de internet. La seguridad IND-CCA2 es{' '}
              <strong className="text-quantum-cyan">la que se exige</strong> a un KEM
              moderno.
            </p>
          </motion.div>
        </div>

        <Callout variant="info" title="ML-KEM se construye en dos pasos">
          Primero un cifrado intermedio <strong>K-PKE</strong> (IND-CPA). Luego se aplica
          la transformación <strong>Fujisaki-Okamoto</strong> para obtener un KEM completo
          IND-CCA2.
        </Callout>
      </ScrollSection>

      {/* FUJISAKI-OKAMOTO */}
      <ScrollSection
        eyebrow="06 · La transformación clave"
        title="Fujisaki-Okamoto"
      >
        <div className="space-y-6 text-slate-300 leading-relaxed text-[17px]">
          <p>
            Sin FO, ML-KEM sería seguro contra escuchas pero{' '}
            <span className="text-quantum-rose font-semibold">vulnerable a un atacante activo</span>{' '}
            que envía ciphertexts modificados y observa cómo reacciona Alice.
          </p>

          <div className="card-quantum p-7">
            <div className="flex items-center gap-3 mb-4">
              <ServerCrash size={20} className="text-quantum-rose" />
              <h4 className="font-display text-lg font-semibold text-slate-100">
                El ataque que FO bloquea
              </h4>
            </div>
            <ol className="space-y-2 ml-5 list-decimal text-sm">
              <li>Eva intercepta un ciphertext legítimo <Math>{`(\\mathbf{u}, v)`}</Math>.</li>
              <li>Lo modifica ligeramente.</li>
              <li>Lo envía a Alice y observa si descifra bien o no.</li>
              <li>La respuesta filtra información sobre <Math>{`\\mathbf{s}`}</Math>.</li>
              <li>Repitiendo, Eva reconstruye <Math>{`\\mathbf{s}`}</Math>.</li>
            </ol>
          </div>

          <div className="card-quantum p-7 glow-cyan">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={20} className="text-quantum-cyan" />
              <h4 className="font-display text-lg font-semibold text-slate-100">
                La idea de FO
              </h4>
            </div>
            <p>
              Forzar a Bob a usar{' '}
              <span className="text-quantum-cyan font-semibold">aleatoriedad determinista derivada del mensaje</span>:
            </p>
            <Math display>{`r = \\text{Hash}(m)`}</Math>
            <p>Consecuencias:</p>
            <ul className="ml-5 list-disc space-y-1 text-sm text-slate-300">
              <li>Mismo <Math>{`m`}</Math> → mismo ciphertext, siempre.</li>
              <li>Alice puede <strong className="text-quantum-cyan">rehacer los cálculos de Bob</strong> después de descifrar.</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: 'Descifra', desc: <>Alice usa <Math>{`\\mathbf{s}`}</Math> y obtiene <Math>{`m'`}</Math>.</> , icon: <Lock size={20} /> },
              { step: 'Recifra', desc: <>Calcula <Math>{`r' = \\text{Hash}(m')`}</Math> y recifra.</> , icon: <Fingerprint size={20} /> },
              { step: 'Compara', desc: <>¿<Math>{`c = c'`}</Math>? Si sí, clave real. Si no, clave falsa.</> , icon: <CheckCircle2 size={20} /> },
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

          <Callout variant="tip" title="Rechazo implícito">
            Si la verificación falla, Alice <strong>no devuelve un error</strong>. Devuelve
            una clave falsa indistinguible (<Math>{`K_{falsa} = \\text{Hash}(z, c)`}</Math>).
            Si respondiera "error", Eva tendría la misma información que en el ataque
            original. Con clave falsa, la comunicación posterior fallará pero Eva no
            aprende nada.
          </Callout>
        </div>
      </ScrollSection>

      <ScrollSection
        eyebrow="07 · Por qué funciona"
        title="Dos escenarios"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card-quantum p-6">
            <div className="flex items-center gap-2 mb-3 text-quantum-rose">
              <XCircle size={18} />
              <span className="font-display font-semibold">Eva modifica c</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Alice descifra → obtiene <Math>{`m'`}</Math> distinto al original →
              recifra con <Math>{`\\text{Hash}(m')`}</Math> → produce{' '}
              <Math>{`c' \\neq c`}</Math>. Detección. Clave falsa.
            </p>
          </div>
          <div className="card-quantum p-6">
            <div className="flex items-center gap-2 mb-3 text-quantum-rose">
              <XCircle size={18} />
              <span className="font-display font-semibold">Eva inventa c desde cero</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Para colar uno, tendría que generar <Math>{`c`}</Math> exactamente como{' '}
              <Math>{`\\text{Encrypt}(m', \\text{Hash}(m'))`}</Math> para algún{' '}
              <Math>{`m'`}</Math> que <strong>ella no controla</strong>. Imposible.
            </p>
          </div>
        </div>
      </ScrollSection>

      <QuickQuiz
        quizId="aplicaciones-fo"
        routeId="aplicaciones"
        title="Comprobación final"
        questions={[
          {
            question:
              'Si la verificación de Fujisaki-Okamoto falla, ¿qué hace ML-KEM?',
            options: [
              'Devuelve un error explícito al remitente.',
              'Devuelve una clave falsa pseudoaleatoria, indistinguible de una real.',
              'Reintenta descifrando con otra clave privada.',
              'Borra la clave privada inmediatamente.',
            ],
            correctIndex: 1,
            explanation:
              'Es el "rechazo implícito": si Alice respondiera con un error, filtraría información útil al atacante. Devuelve una clave falsa para no decir nada.',
          },
          {
            question:
              '¿Qué propiedad da la transformación FO al ML-KEM?',
            options: [
              'Lo hace cuántico-resistente.',
              'Lo eleva de IND-CPA a IND-CCA2.',
              'Lo convierte en un esquema de firma.',
              'Reduce el tamaño de las claves.',
            ],
            correctIndex: 1,
            explanation:
              'El K-PKE interno solo es IND-CPA. FO añade la verificación que protege contra atacantes activos y lo lleva a IND-CCA2.',
          },
        ]}
      />

      <div className="text-center my-16">
        <button onClick={() => onChange('mlkem')} className="btn-quantum">
          Continuar a ML-KEM <ArrowRight size={18} />
        </button>
      </div>

      <FeedbackForm routeId="aplicaciones" routeName="las aplicaciones criptográficas" />
    </div>
  );
};

export default AplicacionesRoute;
