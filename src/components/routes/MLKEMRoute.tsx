import { motion } from 'framer-motion';
import {
  ArrowDown,
  CheckCircle2,
  Eye,
  KeyRound,
  Lock,
  Send,
  ShieldCheck,
  Sparkles,
  Unlock,
} from 'lucide-react';
import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import Callout from '../shared/Callout';
import QuickQuiz from '../shared/QuickQuiz';
import FeedbackForm from '../shared/FeedbackForm';
import Math from '../shared/Math';
import MLKEMSimulator from '../MLKEMSimulator';
import type { RouteId } from '../../routes';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const params = [
  { variant: 'ML-KEM-512', sec: '≈ AES-128', k: 2, eta1: 3, eta2: 2 },
  { variant: 'ML-KEM-768', sec: '≈ AES-192', k: 3, eta1: 2, eta2: 2 },
  { variant: 'ML-KEM-1024', sec: '≈ AES-256', k: 4, eta1: 2, eta2: 2 },
];

const MLKEMRoute: React.FC<RouteProps> = ({ onChange }) => {
  return (
    <div>
      <Hero
        eyebrow="El plato fuerte"
        hueA={300}
        hueB={350}
        title={
          <>
            <span className="text-gradient-quantum">ML-KEM</span>
            <br />
            paso a paso
          </>
        }
        subtitle="El primer mecanismo de encapsulación de claves estandarizado por el NIST. Aquí lo destripamos pieza por pieza, y al final lo verás funcionar en directo."
      />

      {/* VISIÓN GENERAL */}
      <ScrollSection eyebrow="01 · Visión general" title="¿Qué hace ML-KEM?">
        <p className="text-slate-300 leading-relaxed text-[17px] mb-8">
          ML-KEM es un{' '}
          <span className="text-quantum-cyan font-semibold">
            mecanismo de encapsulación de claves (KEM)
          </span>
          . Permite a dos partes acordar una clave secreta compartida{' '}
          <Math>{`K`}</Math> a través de un canal totalmente público.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              n: '01',
              op: 'KeyGen()',
              produces: '(pk, sk)',
              who: 'Alice',
              icon: <KeyRound size={22} />,
              color: 'text-quantum-cyan',
            },
            {
              n: '02',
              op: 'Encaps(pk)',
              produces: '(c, K)',
              who: 'Bob',
              icon: <Send size={22} />,
              color: 'text-quantum-violet',
            },
            {
              n: '03',
              op: 'Decaps(sk, c)',
              produces: 'K',
              who: 'Alice',
              icon: <Unlock size={22} />,
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
                <span className="font-mono text-xs text-slate-500">{s.n}</span>
                <span className={s.color}>{s.icon}</span>
              </div>
              <div className="font-mono font-bold text-slate-100 text-lg mb-1">{s.op}</div>
              <div className="text-sm text-slate-400 mb-3">→ {s.produces}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500">
                Lo ejecuta · <span className={s.color}>{s.who}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <Callout variant="quote" title="Detalle clave">
          La aleatoriedad la introduce <strong>Bob</strong>, no Alice. Una clave pública
          se genera una vez y se puede usar muchas veces. Cada cifrado de Bob es
          independiente.
        </Callout>
      </ScrollSection>

      {/* PARÁMETROS */}
      <ScrollSection eyebrow="02 · Parámetros" title="Tres niveles de seguridad">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-quantum-border text-left">
                <th className="py-3 pr-4 text-slate-400 font-medium uppercase text-xs tracking-widest">Variante</th>
                <th className="py-3 pr-4 text-slate-400 font-medium uppercase text-xs tracking-widest">Seguridad</th>
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
            <p className="text-slate-400">Coeficientes por polinomio. Conecta con el código corrector: 256 bits del mensaje en 256 coeficientes.</p>
          </div>
          <div className="card-quantum p-5">
            <div className="text-quantum-violet font-mono font-bold mb-1">q = 3329</div>
            <p className="text-slate-400">Módulo. Elegido para que <Math>{`q/4`}</Math> absorba el ruido. Primo, permite NTT eficiente.</p>
          </div>
          <div className="card-quantum p-5">
            <div className="text-quantum-pink font-mono font-bold mb-1">k</div>
            <p className="text-slate-400">Dimensión del módulo. Más alto = más seguro y más lento. Determina la variante.</p>
          </div>
        </div>
      </ScrollSection>

      {/* KEYGEN */}
      <ScrollSection
        eyebrow="03 · Alice ejecuta"
        title={
          <>
            <span className="text-quantum-cyan">KeyGen</span> · generar claves
          </>
        }
      >
        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-6 items-start">
          <div className="card-quantum p-6 space-y-4 lg:col-span-3">
            <ol className="space-y-4">
              {[
                { step: 1, title: 'Genera semilla aleatoria', formula: <Math>{`d \\in \\{0,1\\}^{256}`}</Math>, note: '32 bytes' },
                { step: 2, title: 'Hash de la semilla', formula: <Math>{`(\\rho, \\sigma) = \\text{SHA3-512}(d)`}</Math>, note: 'separa públicos y secretos' },
                { step: 3, title: 'Expande ρ a la matriz pública', formula: <Math>{`\\mathbf{A} \\in R_q^{k \\times k} \\;\\leftarrow\\; \\text{SHAKE-128}(\\rho)`}</Math>, note: 'matriz determinista desde 32 bytes' },
                { step: 4, title: 'Muestrea secretos pequeños', formula: <Math>{`\\mathbf{s}, \\mathbf{e} \\sim B_{\\eta_1}^k \\;\\leftarrow\\; \\sigma`}</Math>, note: 'distribución binomial centrada' },
                { step: 5, title: 'Ecuación Module-LWE', formula: <Math>{`\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e}`}</Math>, note: 'aquí se esconde s', highlight: true },
                { step: 6, title: 'Publica y guarda', formula: <Math>{`pk = (\\rho, \\mathbf{t}) \\quad sk = \\mathbf{s}`}</Math>, note: 'pk pública, sk privada' },
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
                  <div className="font-mono font-bold text-2xl text-gradient-static shrink-0 w-10">
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-semibold text-slate-100">{s.title}</div>
                    <div className="my-2">{s.formula}</div>
                    <div className="text-xs text-slate-400">{s.note}</div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        <Callout variant="tip" title="Truco de tamaño">
          La matriz <Math>{`\\mathbf{A}`}</Math> ocupa kilobytes pero{' '}
          <strong className="text-quantum-cyan">no se publica entera</strong>: solo los 32
          bytes de <Math>{`\\rho`}</Math>. Bob la regenera idénticamente con SHAKE-128.
          Por eso la clave pública de ML-KEM-768 cabe en ~1.184 bytes.
        </Callout>
      </ScrollSection>

      {/* ENCAPS */}
      <ScrollSection
        eyebrow="04 · Bob ejecuta"
        title={
          <>
            <span className="text-quantum-violet">Encaps</span> · encapsular la clave
          </>
        }
      >
        <div className="card-quantum p-6 space-y-4">
          <ol className="space-y-4">
            {[
              { step: 1, title: 'Genera mensaje aleatorio', formula: <Math>{`m \\in \\{0,1\\}^{256}`}</Math>, note: '32 bytes · futura clave compartida' },
              { step: 2, title: 'Hash con la clave pública (FO)', formula: <Math>{`(K, r) = \\text{Hash}(m, \\text{Hash}(pk))`}</Math>, note: 'r es determinista, no aleatorio' },
              { step: 3, title: 'Reconstruye A desde ρ', formula: <Math>{`\\mathbf{A} \\leftarrow \\text{SHAKE-128}(\\rho)`}</Math>, note: 'misma matriz que Alice' },
              { step: 4, title: 'Muestrea ruidos pequeños', formula: <Math>{`\\mathbf{r}, \\mathbf{e}_1 \\sim B_{\\eta_1}, \\;\\; e_2 \\sim B_{\\eta_2}`}</Math>, note: 'a partir de r' },
              { step: 5, title: 'Primer componente', formula: <Math>{`\\mathbf{u} = \\mathbf{A}^T \\mathbf{r} + \\mathbf{e}_1`}</Math>, note: 'Module-LWE de Bob' },
              { step: 6, title: 'Segundo componente', formula: <Math>{`v = \\mathbf{t}^T \\mathbf{r} + e_2 + \\text{Encode}(m)`}</Math>, note: 'aquí entra el código corrector', highlight: true },
              { step: 7, title: 'Comprime y envía', formula: <Math>{`c = \\text{Compress}(\\mathbf{u}, v)`}</Math>, note: 'aprovecha el margen del corrector' },
            ].map((s) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: s.step * 0.04 }}
                className={`flex gap-4 items-start p-4 rounded-xl ${
                  s.highlight
                    ? 'bg-quantum-violet/5 border border-quantum-violet/30'
                    : 'border border-quantum-border/30'
                }`}
              >
                <div className="font-mono font-bold text-2xl text-gradient-static shrink-0 w-10">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="font-display font-semibold text-slate-100">{s.title}</div>
                  <div className="my-2">{s.formula}</div>
                  <div className="text-xs text-slate-400">{s.note}</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </ScrollSection>

      {/* DECAPS */}
      <ScrollSection
        eyebrow="05 · Alice recibe"
        title={
          <>
            <span className="text-quantum-pink">Decaps</span> · recuperar la clave
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-quantum p-6">
            <h4 className="font-display text-lg font-semibold text-quantum-cyan mb-4 flex items-center gap-2">
              <Lock size={18} /> Fase 1 · Descifrar
            </h4>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-mono text-slate-500">1</span>
                <span><Math>{`\\text{Descomprime}(c) \\to (\\mathbf{u}, v)`}</Math></span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-slate-500">2</span>
                <span>
                  <Math>{`w = v - \\mathbf{s}^T \\mathbf{u}`}</Math> · CVP con base buena
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-slate-500">3</span>
                <span>
                  <Math>{`m' = \\text{Decode}(w)`}</Math> · usa código corrector
                </span>
              </li>
            </ol>
          </div>

          <div className="card-quantum p-6 glow-violet">
            <h4 className="font-display text-lg font-semibold text-quantum-violet mb-4 flex items-center gap-2">
              <ShieldCheck size={18} /> Fase 2 · Verificar (FO)
            </h4>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-mono text-slate-500">4</span>
                <span><Math>{`(K', r') = \\text{Hash}(m', \\text{Hash}(pk))`}</Math></span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-slate-500">5</span>
                <span>Recifra: <Math>{`c' = \\text{Encrypt}(pk, m', r')`}</Math></span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-slate-500">6</span>
                <span>
                  <Math>{`c \\stackrel{?}{=} c'`}</Math>: si sí, <span className="text-quantum-mint">K = K'</span>; si no,{' '}
                  <span className="text-quantum-rose">K = Hash(z, c)</span>.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </ScrollSection>

      {/* CANCELACIÓN MATEMÁTICA */}
      <ScrollSection
        eyebrow="06 · La magia"
        title="La cancelación matemática"
      >
        <p className="text-slate-300 mb-8 text-[17px] leading-relaxed">
          ¿Por qué Alice consigue recuperar el mensaje? Sustituyendo <Math>{`v`}</Math> y{' '}
          <Math>{`\\mathbf{u}`}</Math> en <Math>{`w = v - \\mathbf{s}^T \\mathbf{u}`}</Math>:
        </p>

        <div className="card-quantum p-7 space-y-5 font-mono text-sm md:text-base text-slate-200">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Sustituyendo</div>
            <Math display>
              {`w = (\\mathbf{t}^T\\mathbf{r} + e_2 + \\text{Encode}(m)) - \\mathbf{s}^T(\\mathbf{A}^T\\mathbf{r} + \\mathbf{e}_1)`}
            </Math>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">
              Como <Math>{`\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e}`}</Math>:
            </div>
            <Math display>
              {`\\mathbf{t}^T\\mathbf{r} = \\mathbf{s}^T\\mathbf{A}^T\\mathbf{r} + \\mathbf{e}^T\\mathbf{r}`}
            </Math>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-quantum-cyan mb-2">
              Los términos <Math>{`\\mathbf{s}^T\\mathbf{A}^T\\mathbf{r}`}</Math> se cancelan:
            </div>
            <Math display>
              {`w = \\text{Encode}(m) + \\underbrace{(\\mathbf{e}^T\\mathbf{r} - \\mathbf{s}^T\\mathbf{e}_1 + e_2)}_{\\text{ruido pequeño}}`}
            </Math>
          </div>
        </div>

        <Callout variant="tip" title="¿Por qué funciona?">
          Todos los vectores con ruido son <strong className="text-quantum-cyan">pequeños</strong>.
          El producto de cosas pequeñas da una cosa pequeña. El código corrector absorbe
          ese ruido residual y recupera <Math>{`m`}</Math> exactamente.
        </Callout>

        <div className="mt-8 grid md:grid-cols-4 gap-3 text-center text-sm">
          {[
            { label: 'Module-LWE', desc: 't = As + e protege s' },
            { label: 'Anillo R_q', desc: 'todo se opera aquí' },
            { label: 'Código corrector', desc: 'absorbe ruido residual' },
            { label: 'CVP', desc: 'fácil con base buena' },
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
        eyebrow="07 · Una sutileza"
        title={<>¿Necesita Alice <Math>{`r`}</Math> para descifrar?</>}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-quantum p-7">
            <div className="flex items-center gap-3 mb-3 text-quantum-rose">
              <Eye size={20} />
              <span className="font-display font-semibold">Mito</span>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              "Si Bob necesita <Math>{`r`}</Math> para cifrar, Alice también lo necesitará
              para descifrar".
            </p>
          </div>
          <div className="card-quantum p-7 glow-cyan">
            <div className="flex items-center gap-3 mb-3 text-quantum-cyan">
              <CheckCircle2 size={20} />
              <span className="font-display font-semibold">Realidad</span>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              Para descifrar, Alice solo necesita <Math>{`\\mathbf{s}`}</Math>. La
              aleatoriedad <Math>{`\\mathbf{r}`}</Math> queda atrapada en{' '}
              <Math>{`\\mathbf{u}`}</Math> y <Math>{`v`}</Math> y{' '}
              <strong className="text-quantum-cyan">se cancela</strong> al calcular{' '}
              <Math>{`v - \\mathbf{s}^T \\mathbf{u}`}</Math>.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-slate-300 text-[17px] leading-relaxed mb-4">
            En FO, Alice <strong className="text-quantum-cyan">reconstruye</strong>{' '}
            <Math>{`r`}</Math> después de descifrar (vía <Math>{`\\text{Hash}(m')`}</Math>),
            no antes. El orden mental es:
          </p>
          <div className="space-y-2">
            {[
              'Descifrar con s → obtener m\'',
              'Calcular r\' = Hash(m\')',
              'Usar r\' para recifrar y verificar',
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
        title="Test de comprensión ML-KEM"
        questions={[
          {
            question:
              '¿Por qué Alice puede descifrar y un atacante no, si ambos ven la misma matriz A y el mismo ciphertext?',
            options: [
              'Porque Alice tiene un canal cuántico privado.',
              'Porque Alice posee el secreto s y los términos sᵀAᵀr se cancelan al calcular v − sᵀu.',
              'Porque Alice conoce el mensaje m de antemano.',
              'Porque Alice usa otra matriz A distinta.',
            ],
            correctIndex: 1,
            explanation:
              'Justo eso es la cancelación matemática. Sin s no puedes hacer la resta correctamente y solo te queda LWE para resolver — que es duro.',
          },
          {
            question:
              '¿Qué hace Bob con la "aleatoriedad" r en ML-KEM con FO?',
            options: [
              'La envía cifrada junto con el ciphertext.',
              'La elige como un número verdaderamente aleatorio independiente.',
              'La deriva determinísticamente como Hash(m), para que Alice pueda recalcularla al verificar.',
              'No la usa.',
            ],
            correctIndex: 2,
            explanation:
              'FO obliga a r = Hash(m). Esto permite a Alice rehacer los cálculos de Bob al verificar el ciphertext y detectar manipulaciones.',
          },
          {
            question:
              '¿Cuál de estas afirmaciones describe el papel del código corrector en ML-KEM?',
            options: [
              'Detecta errores en la matriz A pública.',
              'Codifica cada bit del mensaje en posiciones del círculo Z_q separadas q/2, para que el ruido residual menor que q/4 no impida recuperarlo.',
              'Reduce la dimensión del retículo durante el cifrado.',
              'Cifra cuánticamente el mensaje.',
            ],
            correctIndex: 1,
            explanation:
              'El bit 0 va a 0 y el bit 1 va a q/2. Ese margen de q/4 es exactamente la tolerancia al ruido que aparece tras la cancelación matemática.',
          },
        ]}
      />

      {/* SIMULADOR */}
      <ScrollSection
        eyebrow="08 · Manos a la obra"
        title={<>Simulador <span className="text-gradient-static">interactivo</span></>}
      >
        <p className="text-slate-300 mb-8 text-[17px] leading-relaxed max-w-3xl">
          Una versión didáctica de ML-KEM (Baby-Kyber) con parámetros pequeños{' '}
          (<Math>{`q=23`}</Math>, <Math>{`n=2`}</Math>) que cabe en pantalla. La lógica es
          idéntica al algoritmo real: solo cambian los tamaños.
        </p>
        <div className="card-quantum p-2 md:p-4">
          <MLKEMSimulator />
        </div>
      </ScrollSection>

      <ScrollSection eyebrow="Final" title="Lo has visto entero">
        <div className="card-quantum p-8 md:p-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-3 rounded-xl bg-quantum-cyan/10 text-quantum-cyan">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-100 mb-2">
                ML-KEM en una idea
              </h3>
              <p className="text-slate-300 text-[16px] leading-relaxed">
                Alice publica una ecuación con ruido que esconde su clave privada. Bob
                construye un ciphertext que mezcla el mensaje con esa misma ecuación
                ruidosa. Cuando Alice usa su clave privada al descifrar, los términos
                ruidosos grandes <strong className="text-quantum-cyan">se cancelan exactamente</strong> y solo queda el mensaje
                más un poco de ruido residual. Ese ruido residual es lo bastante pequeño
                para que el código corrector lo absorba. Al final, Alice añade una
                verificación (FO) recifrando para detectar manipulaciones. La seguridad
                descansa en que extraer la clave privada desde la pública es el problema
                LWE, que es duro incluso para ordenadores cuánticos.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <button onClick={() => onChange('intro')} className="btn-ghost">
            Volver al inicio
          </button>
          <button onClick={() => onChange('fundamentos')} className="btn-ghost">
            Repasar fundamentos
          </button>
          <button onClick={() => onChange('aplicaciones')} className="btn-ghost">
            Volver a aplicaciones
          </button>
        </div>
      </ScrollSection>

      <FeedbackForm routeId="mlkem" routeName="ML-KEM y el simulador" />
    </div>
  );
};

export default MLKEMRoute;
