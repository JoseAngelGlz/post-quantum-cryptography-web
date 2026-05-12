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
import QuizSummary from '../shared/QuizSummary';
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
          Alice quiere publicar una <strong className="text-quantum-cyan">clave pública</strong>{' '}
          que no revele su secreto. La estrategia: empezar de una pequeña semilla, expandirla
          en una matriz pública, y combinar esa matriz con un secreto pequeño{' '}
          <span className="font-mono">s</span> + un ruido <span className="font-mono">e</span>{' '}
          que vuelve la ecuación imposible de despejar.
        </p>

        <div className="space-y-3">
          {[
            {
              step: 1,
              icon: <Dice5 size={16} />,
              title: 'Lanza un dado',
              plain: (
                <>
                  Genera <strong>32 bytes aleatorios</strong>. De ahí saldrá todo lo demás:
                  guarda un único secreto y reproduce lo público a partir de él.
                </>
              ),
              formula: <Math>{`d \\xleftarrow{\\$} \\{0,1\\}^{256}`}</Math>,
              produces: 'd',
            },
            {
              step: 2,
              icon: <Hash size={16} />,
              title: 'Hashea la semilla',
              plain: (
                <>
                  La parte <span className="font-mono text-quantum-cyan">ρ</span> alimenta lo
                  público; <span className="font-mono text-quantum-amber">σ</span>, lo
                  privado. Un solo hash mezcla todo.
                </>
              ),
              formula: <Math>{`(\\rho, \\sigma) = \\text{SHA3-512}(d)`}</Math>,
              produces: 'ρ (pública) · σ (privada)',
            },
            {
              step: 3,
              icon: <Layers size={16} />,
              title: 'Expande ρ a la matriz A',
              plain: (
                <>
                  Usando <span className="font-mono">SHAKE-128</span>, alarga 32 bytes hasta
                  llenar una matriz <Math>{`k \\times k`}</Math>. La matriz <em>no se
                  publica</em>; solo se publica <span className="font-mono">ρ</span> y
                  cualquiera la regenera idéntica.
                </>
              ),
              formula: <Math>{`\\mathbf{A} \\leftarrow \\text{SHAKE-128}(\\rho)`}</Math>,
              produces: 'A · pública',
            },
            {
              step: 4,
              icon: <Waves size={16} />,
              title: 'Muestrea secretos pequeños',
              plain: (
                <>
                  De <span className="font-mono">σ</span> salen el secreto{' '}
                  <span className="font-mono text-quantum-amber">s</span> y el ruido{' '}
                  <span className="font-mono text-quantum-amber">e</span>: ambos con
                  coeficientes cercanos a cero ({'{−η, …, η}'}). Cuanto más pequeños,
                  más decodificable luego.
                </>
              ),
              formula: <Math>{`\\mathbf{s}, \\mathbf{e} \\sim B_{\\eta_1}^k \\leftarrow \\sigma`}</Math>,
              produces: 's, e · privados',
            },
            {
              step: 5,
              icon: <Sigma size={16} />,
              title: 'Mezcla todo · ecuación Module-LWE',
              plain: (
                <>
                  Esta es la operación crítica: multiplicar la matriz pública por el secreto,
                  añadirle ruido. El resultado <span className="font-mono">t</span> parece
                  un vector aleatorio cualquiera — el ruido <em>oculta</em>{' '}
                  <span className="font-mono">s</span> incluso si conoces{' '}
                  <span className="font-mono">A</span> y <span className="font-mono">t</span>.
                </>
              ),
              formula: <Math>{`\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e}`}</Math>,
              produces: 't · pública',
              highlight: true,
            },
            {
              step: 6,
              icon: <Package size={16} />,
              title: 'Empaqueta y guarda',
              plain: (
                <>
                  La <strong className="text-quantum-cyan">clave pública</strong> es{' '}
                  <span className="font-mono">(ρ, t)</span>: ~1.184 bytes en ML-KEM-768.
                  Alice guarda <span className="font-mono">s</span> a buen recaudo.
                </>
              ),
              formula: <Math>{`pk = (\\rho, \\mathbf{t}) \\quad sk = \\mathbf{s}`}</Math>,
              produces: 'pk, sk',
            },
          ].map((s) => (
            <StepCard key={s.step} palette="cyan" {...s} />
          ))}
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
          Bob recibe la clave pública de Alice. Genera un mensaje aleatorio{' '}
          <span className="font-mono">m</span>, lo codifica con el círculo{' '}
          <Math>{`\\mathbb{Z}_q`}</Math> (bit 0 → 0, bit 1 → q/2) y lo esconde dentro de su
          propia ecuación LWE. Lo que envía no son los datos en claro; es un{' '}
          <strong className="text-quantum-violet">paquete cifrado</strong>{' '}
          <span className="font-mono">(u, v)</span> que solo Alice sabrá abrir.
        </p>

        <div className="space-y-3">
          {[
            {
              step: 1,
              icon: <Dice5 size={16} />,
              title: 'Genera el mensaje aleatorio',
              plain: (
                <>
                  <strong>Solo 32 bytes</strong>. Esa <em>m</em> será la futura clave
                  compartida — pero no se transmite tal cual.
                </>
              ),
              formula: <Math>{`m \\xleftarrow{\\$} \\{0,1\\}^{256}`}</Math>,
              produces: 'm',
            },
            {
              step: 2,
              icon: <Hash size={16} />,
              title: 'Deriva clave y aleatoriedad (FO)',
              plain: (
                <>
                  Bob no usa azar bruto para el cifrado; saca todo del hash de{' '}
                  <span className="font-mono">m</span>. Eso permite que Alice{' '}
                  <strong>reconstruya</strong> después los cálculos de Bob y verifique
                  que no hubo manipulación.
                </>
              ),
              formula: <Math>{`(K, r) = \\text{Hash}(m, \\text{Hash}(pk))`}</Math>,
              produces: 'K (futura clave) · r (semilla del cifrado)',
            },
            {
              step: 3,
              icon: <Layers size={16} />,
              title: 'Recupera la matriz A',
              plain: (
                <>
                  La clave pública incluía <span className="font-mono">ρ</span>; Bob expande
                  exactamente la misma <span className="font-mono">A</span> que generó
                  Alice. Determinismo, no aleatoriedad.
                </>
              ),
              formula: <Math>{`\\mathbf{A} \\leftarrow \\text{SHAKE-128}(\\rho)`}</Math>,
              produces: 'A · pública',
            },
            {
              step: 4,
              icon: <Waves size={16} />,
              title: 'Muestrea ruidos pequeños',
              plain: (
                <>
                  De <span className="font-mono">r</span> salen tres vectores cercanos al
                  cero: <span className="font-mono">r</span> (aleatoriedad del cifrado),
                  <span className="font-mono"> e₁, e₂</span> (ruidos).
                </>
              ),
              formula: <Math>{`\\mathbf{r}, \\mathbf{e}_1 \\sim B_{\\eta_1}, \\quad e_2 \\sim B_{\\eta_2}`}</Math>,
              produces: 'r, e₁, e₂',
            },
            {
              step: 5,
              icon: <Sigma size={16} />,
              title: 'Construye u · primera mitad del paquete',
              plain: (
                <>
                  Una nueva ecuación LWE — esta vez, de Bob: la incógnita oculta es{' '}
                  <span className="font-mono">r</span>, no <span className="font-mono">s</span>.
                </>
              ),
              formula: <Math>{`\\mathbf{u} = \\mathbf{A}^T\\mathbf{r} + \\mathbf{e}_1`}</Math>,
              produces: 'u',
            },
            {
              step: 6,
              icon: <Lock size={16} />,
              title: 'Construye v · aquí se esconde el mensaje',
              plain: (
                <>
                  El mensaje codificado se suma <em>encima</em> de una ecuación LWE más.
                  Cuando Alice reste <span className="font-mono">sᵀ·u</span>, los trozos
                  LWE se cancelarán y emergerá <span className="font-mono">Encode(m)</span>.
                </>
              ),
              formula: <Math>{`v = \\mathbf{t}^T\\mathbf{r} + e_2 + \\text{Encode}(m)`}</Math>,
              produces: 'v',
              highlight: true,
            },
            {
              step: 7,
              icon: <Send size={16} />,
              title: 'Comprime y envía el ciphertext',
              plain: (
                <>
                  La compresión recorta bits poco significativos:{' '}
                  <span className="font-mono">(u, v)</span> aún cabe en{' '}
                  <strong>~1.088 bytes</strong> en ML-KEM-768.
                </>
              ),
              formula: <Math>{`c = \\text{Compress}(\\mathbf{u}, v)`}</Math>,
              produces: 'c · ciphertext',
            },
          ].map((s) => (
            <StepCard key={s.step} palette="violet" {...s} />
          ))}
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
          Alice recibe <span className="font-mono">c</span>. Su clave privada{' '}
          <span className="font-mono">s</span> hace que los términos LWE de Bob se cancelen
          exactamente al restar. Lo que queda es <em>casi</em>{' '}
          <span className="font-mono">Encode(m)</span> — basta redondear cada coeficiente
          al más cercano (0 ó q/2) para recuperar el mensaje. Luego, una verificación FO
          comprueba que nadie ha tocado <span className="font-mono">c</span> por el camino.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
                <Unlock size={16} />
              </div>
              <h4 className="font-display text-lg font-semibold text-quantum-cyan">
                Fase 1 · Descifrar
              </h4>
            </div>
            {[
              {
                step: 1,
                icon: <Package size={16} />,
                title: 'Descomprime el ciphertext',
                plain: 'Recupera los dos componentes (u, v) tal como los envió Bob.',
                formula: <Math>{`\\text{Decompress}(c) \\to (\\mathbf{u}, v)`}</Math>,
                produces: '(u, v)',
              },
              {
                step: 2,
                icon: <Sigma size={16} />,
                title: 'Cancela el ruido LWE de Bob',
                plain: (
                  <>
                    Resta <span className="font-mono">sᵀ·u</span> de{' '}
                    <span className="font-mono">v</span>: los términos{' '}
                    <span className="font-mono">sᵀ·Aᵀ·r</span> se anulan exactamente.
                    Queda <span className="font-mono">Encode(m) + ruido</span> pequeño.
                    Geométricamente es un <strong>CVP</strong> resoluble con la base
                    buena (s).
                  </>
                ),
                formula: <Math>{`w = v - \\mathbf{s}^T \\mathbf{u}`}</Math>,
                produces: 'w (ruidoso)',
                highlight: true,
              },
              {
                step: 3,
                icon: <Sparkles size={16} />,
                title: 'Decodifica con el código corrector',
                plain: (
                  <>
                    Cada coeficiente se redondea al más cercano entre 0 y q/2. Si el ruido
                    es menor que q/4 (que lo es con probabilidad 1 − 2⁻¹⁶⁴), se recupera
                    el bit original.
                  </>
                ),
                formula: <Math>{`m' = \\text{Decode}(w)`}</Math>,
                produces: "m'",
              },
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
                Fase 2 · Verificar (FO)
              </h4>
            </div>
            {[
              {
                step: 4,
                icon: <Hash size={16} />,
                title: 'Re-deriva la aleatoriedad de Bob',
                plain: (
                  <>
                    Como Bob obtuvo <span className="font-mono">r</span> de{' '}
                    <span className="font-mono">Hash(m)</span>, Alice — que ya tiene{' '}
                    <span className="font-mono">m'</span> — puede recalcular el mismo{' '}
                    <span className="font-mono">r'</span> y la misma clave{' '}
                    <span className="font-mono">K'</span>.
                  </>
                ),
                formula: <Math>{`(K', r') = \\text{Hash}(m', \\text{Hash}(pk))`}</Math>,
                produces: "K', r'",
              },
              {
                step: 5,
                icon: <Lock size={16} />,
                title: 'Recifra desde cero',
                plain: (
                  <>
                    Con <span className="font-mono">m'</span> y{' '}
                    <span className="font-mono">r'</span>, Alice repite literalmente el
                    Encaps. Obtiene un <span className="font-mono">c'</span> propio.
                  </>
                ),
                formula: <Math>{`c' = \\text{Encrypt}(pk, m', r')`}</Math>,
                produces: "c'",
              },
              {
                step: 6,
                icon: <CheckCircle2 size={16} />,
                title: 'Compara c y c\'',
                plain: (
                  <>
                    Si coinciden, el ciphertext era genuino → la clave es{' '}
                    <span className="text-quantum-mint">K = K'</span>. Si no, devuelve una
                    clave falsa Hash(z, c){' '}
                    <em>indistinguible</em> de una real (rechazo implícito).
                  </>
                ),
                formula: <Math>{`c \\stackrel{?}{=} c'`}</Math>,
                produces: 'K real o K falsa',
                highlight: true,
              },
            ].map((s) => (
              <StepCard key={s.step} palette="violet" compact {...s} />
            ))}
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
        quizId="mlkem-test"
        routeId="mlkem"
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

      <ScrollSection
        eyebrow="Cierre"
        title={<>Tu <span className="text-gradient-static">progreso</span></>}
      >
        <p className="text-slate-400 mb-6 text-[15px] max-w-2xl">
          Cada vez que has completado un cuestionario durante el recorrido, hemos guardado
          tu puntuación. Este es el balance global.
        </p>
        <QuizSummary />
      </ScrollSection>

      <FeedbackForm routeId="mlkem" routeName="ML-KEM y el simulador" />
    </div>
  );
};

export default MLKEMRoute;
