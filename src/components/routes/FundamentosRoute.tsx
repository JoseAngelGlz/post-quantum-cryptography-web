import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Hash, Key, Layers3, Sigma, Target, Workflow } from 'lucide-react';
import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import Callout from '../shared/Callout';
import QuickQuiz from '../shared/QuickQuiz';
import FeedbackForm from '../shared/FeedbackForm';
import LatticeViz from '../shared/LatticeViz';
import ZqCircle from '../shared/ZqCircle';
import Math from '../shared/Math';
import type { RouteId } from '../../routes';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const FundamentosRoute: React.FC<RouteProps> = ({ onChange }) => {
  const [basisToggle, setBasisToggle] = useState<'good' | 'bad'>('good');

  return (
    <div>
      <Hero
        eyebrow="Camino lineal"
        hueA={170}
        hueB={210}
        title={
          <>
            <span className="text-gradient-quantum">Fundamentos</span>
            <br />
            matemáticos
          </>
        }
        subtitle="Antes del algoritmo, las piezas: retículos, vectores cortos, ruido controlado y polinomios. Cada concepto es una pieza de ML-KEM."
      />

      {/* RETÍCULOS */}
      <ScrollSection
        eyebrow="01 · Retículos"
        title={<>El tablero donde sucede todo</>}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              Un <span className="text-quantum-cyan font-semibold">retículo</span> es el
              conjunto de todas las combinaciones lineales <em>enteras</em> de un conjunto
              de vectores linealmente independientes (la <em>base</em>).
            </p>
            <p>
              Imagínalo como una cuadrícula infinita de puntos en el espacio,
              <span className="text-quantum-violet"> no necesariamente</span> alineada con
              los ejes.
            </p>
            <Math display>
              {`\\Lambda = \\left\\{ \\sum_{i=1}^n a_i \\, \\mathbf{b}_i \\;\\middle|\\; a_i \\in \\mathbb{Z} \\right\\}`}
            </Math>
            <p className="text-slate-400 text-sm">
              Los vectores <Math>{`\\mathbf{b}_i`}</Math> forman la base; las combinaciones
              con coeficientes enteros generan el retículo.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <LatticeViz goodBasis size={360} />
            <p className="mt-3 text-xs text-slate-400 text-center max-w-xs">
              Los vectores rosa y violeta son la <span className="text-quantum-pink">base</span>.
              Los puntos cian son <span className="text-quantum-cyan">todo el retículo</span>.
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* BASES BUENAS VS MALAS */}
      <ScrollSection
        eyebrow="02 · El truco fundamental"
        title={
          <>
            Bases <span className="text-quantum-mint">buenas</span> vs{' '}
            <span className="text-quantum-rose">malas</span>
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
                Base buena
              </button>
              <button
                onClick={() => setBasisToggle('bad')}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  basisToggle === 'bad'
                    ? 'border-quantum-rose bg-quantum-rose/10 text-quantum-rose'
                    : 'border-quantum-border text-slate-400'
                }`}
              >
                Base mala
              </button>
            </div>
            <LatticeViz goodBasis={basisToggle === 'good'} size={360} />
            <p className="text-xs text-slate-400 text-center max-w-xs">
              {basisToggle === 'good'
                ? 'Vectores cortos, casi ortogonales: las cosas son fáciles.'
                : 'Vectores largos, casi paralelos: las cosas se vuelven imposibles.'}
            </p>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              Lo más curioso: <span className="text-quantum-cyan font-semibold">ambas bases generan exactamente el mismo retículo</span>.
              Los puntos cian son los mismos. Lo que cambia son los <em>vectores</em> con
              los que describes esos puntos.
            </p>
            <p>
              Con una base <span className="text-quantum-mint">buena</span> (corta y casi
              ortogonal) los problemas computacionales son fáciles. Con una base{' '}
              <span className="text-quantum-rose">mala</span> (larga y paralela) son
              astronómicamente difíciles.
            </p>
            <Callout variant="tip" title="Esta es la clave criptográfica">
              La <strong className="text-quantum-cyan">clave privada</strong> es una base buena.
              La <strong className="text-quantum-violet">clave pública</strong> es una base mala
              del mismo retículo. Quien tiene la base buena resuelve los problemas; quien
              solo ve la mala no puede.
            </Callout>
          </div>
        </div>
      </ScrollSection>

      {/* SVP */}
      <ScrollSection
        eyebrow="03 · SVP"
        title="Shortest Vector Problem"
      >
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              <strong className="text-quantum-cyan">Pregunta:</strong> dado un retículo,
              encuentra el vector no nulo más corto.
            </p>
            <Math display>{`\\text{SVP}(\\Lambda) = \\arg\\min_{\\mathbf{v} \\in \\Lambda \\setminus \\{0\\}} \\|\\mathbf{v}\\|`}</Math>
            <p>
              En 2 dimensiones es trivial visualmente. Pero la dificultad{' '}
              <span className="text-quantum-violet">crece exponencialmente</span> con la
              dimensión, especialmente si solo dispones de una base mala.
            </p>
            <p className="text-slate-400 text-sm">
              SVP es <span className="font-mono">NP-difícil</span> bajo reducciones
              aleatorias. Es el problema más estudiado de la geometría de retículos.
            </p>
          </div>
          <div className="card-quantum p-6 space-y-3">
            <div className="text-xs uppercase tracking-widest text-slate-400">Intuición</div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-quantum-mint/10 text-quantum-mint shrink-0">
                <Target size={18} />
              </div>
              <p className="text-sm text-slate-300">
                Con base buena: el vector corto es uno de la propia base.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-quantum-rose/10 text-quantum-rose shrink-0">
                <Target size={18} />
              </div>
              <p className="text-sm text-slate-300">
                Con base mala: hay que combinar vectores con coeficientes enteros muy específicos.
              </p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* CVP */}
      <ScrollSection
        eyebrow="04 · CVP"
        title="Closest Vector Problem"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col items-center">
            <LatticeViz goodBasis showTarget size={380} />
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              <strong className="text-quantum-cyan">Pregunta:</strong> dado un punto{' '}
              <Math>{`\\mathbf{t}`}</Math> del espacio (no necesariamente del retículo),
              encuentra el punto del retículo más cercano a <Math>{`\\mathbf{t}`}</Math>.
            </p>
            <Math display>{`\\text{CVP}(\\Lambda, \\mathbf{t}) = \\arg\\min_{\\mathbf{v} \\in \\Lambda} \\|\\mathbf{v} - \\mathbf{t}\\|`}</Math>
            <p>
              Es la versión "con objetivo" de SVP. CVP es{' '}
              <span className="text-quantum-violet">al menos tan difícil</span> como SVP.
            </p>
            <Callout variant="info" title="Por qué importa para ML-KEM">
              Descifrar en ML-KEM es{' '}
              <strong className="text-quantum-cyan">esencialmente resolver un CVP</strong>.
              Alice, con base buena, lo hace trivialmente. Un atacante, con base mala, no
              puede.
            </Callout>
          </div>
        </div>
      </ScrollSection>

      {/* LWE */}
      <ScrollSection
        eyebrow="05 · LWE"
        title={<>Learning <span className="text-gradient-static">With Errors</span></>}
      >
        <div className="space-y-6 text-slate-300 leading-relaxed text-[17px]">
          <p>
            Es <span className="text-quantum-cyan font-semibold">el</span> problema directamente conectado a ML-KEM. Funciona así:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-quantum p-6">
              <div className="text-xs uppercase tracking-widest text-quantum-rose mb-3">Sin ruido</div>
              <Math display>{`b_i = \\mathbf{a}_i \\cdot \\mathbf{s} \\pmod{q}`}</Math>
              <p className="text-sm text-slate-400 mt-3">
                Trivial: con suficientes muestras, eliminación gaussiana recupera{' '}
                <Math>{`\\mathbf{s}`}</Math> al instante.
              </p>
            </div>
            <div className="card-quantum p-6 glow-cyan">
              <div className="text-xs uppercase tracking-widest text-quantum-cyan mb-3">Con ruido</div>
              <Math display>{`b_i = \\mathbf{a}_i \\cdot \\mathbf{s} + e_i \\pmod{q}`}</Math>
              <p className="text-sm text-slate-400 mt-3">
                Astronómicamente difícil. El ruido <Math>{`e_i`}</Math> se amplifica al
                despejar y destruye cualquier intento.
              </p>
            </div>
          </div>

          <Callout variant="quote" title="LWE = CVP geométricamente">
            Las muestras LWE definen un retículo. Encontrar{' '}
            <Math>{`\\mathbf{s}`}</Math> equivale a encontrar el punto del retículo más
            cercano a un objetivo. Resolver LWE <em>es</em> resolver CVP.
          </Callout>

          <div className="card-quantum p-7 mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-quantum-violet/10 text-quantum-violet">
                <Sigma size={18} />
              </div>
              <h4 className="font-display text-lg font-semibold text-slate-100">
                Teorema de Regev (2005)
              </h4>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              Si existe un algoritmo eficiente que resuelve LWE en el caso medio, entonces
              existe un algoritmo eficiente que resuelve los problemas de retículos
              (SVP, CVP) en el peor caso. Esta reducción "peor-caso a caso-medio" da una
              garantía mucho más fuerte que la de RSA.
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* Module-LWE */}
      <ScrollSection
        eyebrow="06 · Module-LWE"
        title="La variante eficiente"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              ML-KEM no usa LWE puro. Usa{' '}
              <span className="text-quantum-cyan font-semibold">Module-LWE</span>: en lugar de
              vectores de enteros, vectores de polinomios del anillo{' '}
              <Math>{`R_q`}</Math>.
            </p>
            <p>
              Misma seguridad, claves <span className="text-quantum-mint">mucho más pequeñas</span>:
              de megabytes a kilobytes.
            </p>
            <Math display>{`\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e} \\quad \\text{donde } \\mathbf{A} \\in R_q^{k \\times k}`}</Math>
          </div>

          <div className="card-quantum p-7 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan">
                <Layers3 size={18} />
              </div>
              <h4 className="font-display text-lg font-semibold text-slate-100">
                Anillo <Math>{`R_q = \\mathbb{Z}_q[x]/(x^n+1)`}</Math>
              </h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-quantum-cyan">•</span>
                <span><strong>Suma:</strong> coeficiente a coeficiente módulo <Math>{`q`}</Math>.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-quantum-violet">•</span>
                <span><strong>Multiplicación:</strong> producto de polinomios; cuando aparece <Math>{`x^n`}</Math>, se sustituye por <Math>{`-1`}</Math>.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-quantum-pink">•</span>
                <span>En ML-KEM: <Math>{`n=256`}</Math>, <Math>{`q=3329`}</Math>.</span>
              </li>
            </ul>
          </div>
        </div>
      </ScrollSection>

      {/* CÓDIGOS CORRECTORES */}
      <ScrollSection
        eyebrow="07 · Códigos correctores"
        title={<>El más simple posible: <span className="text-quantum-cyan">el círculo</span></>}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex justify-center">
            <ZqCircle q={17} />
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed text-[17px]">
            <p>
              ML-KEM codifica cada bit del mensaje en{' '}
              <span className="text-quantum-cyan font-semibold">lados opuestos del círculo</span>{' '}
              <Math>{`\\mathbb{Z}_q`}</Math>:
            </p>
            <div className="card-quantum p-5 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-quantum-cyan mb-1">bit 0</div>
                <Math display>{`0`}</Math>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-quantum-pink mb-1">bit 1</div>
                <Math display>{`\\lceil q/2 \\rceil`}</Math>
              </div>
            </div>
            <p>
              Distancia entre las dos palabras código: <Math>{`q/2`}</Math>. Capacidad de
              corrección: cualquier ruido menor que <Math>{`q/4`}</Math>.
            </p>
            <p>
              El mensaje son 256 bits y cada uno se mete en un coeficiente distinto del
              polinomio. El "código corrector" actúa{' '}
              <span className="text-quantum-violet">256 veces en paralelo</span>.
            </p>
            <Callout variant="info" title="Probabilidad de fallo">
              En ML-KEM-768 los parámetros están elegidos para que el ruido total esté por
              debajo de <Math>{`q/4`}</Math> con probabilidad astronómicamente alta:
              aproximadamente <Math>{`2^{-164}`}</Math>.
            </Callout>
          </div>
        </div>
      </ScrollSection>

      <QuickQuiz
        title="Mini-test de retículos"
        questions={[
          {
            question:
              'Si dos bases distintas generan el mismo retículo, ¿por qué importa cuál tenemos?',
            options: [
              'Porque cambia la posición de los puntos del retículo.',
              'Porque solo una base buena (corta y casi ortogonal) hace fáciles los problemas SVP/CVP.',
              'Porque las bases malas no contienen al vector cero.',
              'Porque ML-KEM solo funciona con bases ortonormales.',
            ],
            correctIndex: 1,
            explanation:
              'Los puntos del retículo son los mismos. Lo que cambia es la dificultad de moverte por él: la base buena es la clave privada, la mala es la pública.',
          },
          {
            question: '¿Qué relación hay entre LWE y CVP?',
            options: [
              'LWE es un problema sobre números primos; CVP es sobre vectores.',
              'Resolver LWE equivale geométricamente a resolver CVP en un retículo asociado.',
              'CVP solo aplica en dimensión 2; LWE en cualquier dimensión.',
              'Son problemas no relacionados.',
            ],
            correctIndex: 1,
            explanation:
              'Las muestras LWE definen un retículo, y encontrar el secreto s equivale a encontrar el punto del retículo más cercano a un objetivo: exactamente CVP.',
          },
          {
            question: '¿Por qué ML-KEM puede tolerar el ruido en el descifrado?',
            options: [
              'Porque el algoritmo cuántico de Shor lo elimina.',
              'Porque el código corrector basado en el círculo Z_q absorbe ruidos menores que q/4.',
              'Porque la matriz A se publica entera para cancelarlo.',
              'Porque ML-KEM no usa ruido en descifrado.',
            ],
            correctIndex: 1,
            explanation:
              'El bit 0 va a la posición 0, el bit 1 va a q/2. Mientras el ruido sea menor que q/4 en cada coeficiente, la decodificación es correcta.',
          },
        ]}
      />

      {/* HASHES */}
      <ScrollSection
        eyebrow="08 · Funciones hash"
        title="SHA-3, SHAKE y la magia de las semillas"
      >
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              icon: <Hash size={20} />,
              title: 'SHA3-256 / SHA3-512',
              desc: 'Hashes de tamaño fijo. Toman cualquier entrada y producen 256 ó 512 bits.',
              color: 'text-quantum-cyan',
            },
            {
              icon: <Workflow size={20} />,
              title: 'SHAKE-128 / SHAKE-256',
              desc: 'XOF (Extendable Output Function): producen tantos bytes como pidas desde una semilla.',
              color: 'text-quantum-violet',
            },
            {
              icon: <Key size={20} />,
              title: 'Determinismo',
              desc: 'Misma entrada → misma salida. Cambiar un bit cambia toda la salida (efecto avalancha).',
              color: 'text-quantum-pink',
            },
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
          Cuatro roles que juegan los hashes en ML-KEM
        </h3>
        <div className="space-y-3">
          {[
            {
              n: '1',
              title: 'Expandir semilla → matriz A',
              desc: 'Alice publica solo 32 bytes (ρ). SHAKE-128 regenera la matriz completa de forma determinista.',
            },
            {
              n: '2',
              title: 'Generar secretos pseudoaleatorios',
              desc: 'Vectores s, e, r se muestrean expandiendo otra semilla con SHAKE.',
            },
            {
              n: '3',
              title: 'Derivar la clave compartida final',
              desc: 'K = Hash(m, otros datos) para uniformizar la salida.',
            },
            {
              n: '4',
              title: 'Detectar manipulaciones (Fujisaki-Okamoto)',
              desc: 'r = Hash(m) permite a Alice rehacer los cálculos de Bob y verificar.',
            },
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
        eyebrow="Cadena lógica"
        title="Por qué todo encaja"
      >
        <div className="card-quantum p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {['SVP difícil', 'CVP difícil', 'LWE difícil', 'ML-KEM seguro'].map((s, i) => (
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
          La seguridad de ML-KEM se reduce, paso a paso, a la dificultad de un problema
          geométrico que llevamos décadas estudiando y que la cuántica no sabe atacar.
        </p>
      </ScrollSection>

      <div className="text-center my-16">
        <button
          onClick={() => onChange('aplicaciones')}
          className="btn-quantum"
        >
          Continuar a Aplicaciones <ArrowRight size={18} />
        </button>
      </div>

      <FeedbackForm routeId="fundamentos" routeName="los fundamentos matemáticos" />
    </div>
  );
};

export default FundamentosRoute;
