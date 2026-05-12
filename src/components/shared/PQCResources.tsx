import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, FlaskConical, GraduationCap, Shield, Wrench } from 'lucide-react';

type ResourceType = 'standard' | 'paper' | 'course' | 'tool';

interface Resource {
  title: string;
  description: string;
  url: string;
  type: ResourceType;
}

const resources: Resource[] = [
  {
    title: 'NIST FIPS 203 – ML-KEM',
    description:
      'Estándar oficial del NIST para el mecanismo de encapsulamiento de claves basado en Module-Lattice. Define ML-KEM-512, ML-KEM-768 y ML-KEM-1024.',
    url: 'https://doi.org/10.6028/NIST.FIPS.203',
    type: 'standard',
  },
  {
    title: 'NIST FIPS 204 – ML-DSA',
    description:
      'Estándar NIST para el esquema de firma digital basado en Module-Lattice (anteriormente CRYSTALS-Dilithium).',
    url: 'https://doi.org/10.6028/NIST.FIPS.204',
    type: 'standard',
  },
  {
    title: 'NIST FIPS 205 – SLH-DSA',
    description:
      'Estándar NIST para el esquema de firma digital sin estado basado en funciones hash (anteriormente SPHINCS+).',
    url: 'https://doi.org/10.6028/NIST.FIPS.205',
    type: 'standard',
  },
  {
    title: 'On Lattices, Learning with Errors… (Regev, 2005)',
    description:
      'Artículo seminal que introduce el problema LWE y su reducción desde SVP, estableciendo las bases teóricas de la criptografía de retículos moderna.',
    url: 'https://cims.nyu.edu/~regev/papers/qcrypto.pdf',
    type: 'paper',
  },
  {
    title: 'CRYSTALS-Kyber Algorithm Specification',
    description:
      'Especificación técnica completa del algoritmo Kyber (ahora ML-KEM), incluyendo parámetros, algoritmos y análisis de seguridad.',
    url: 'https://pq-crystals.org/kyber/data/kyber-specification-round3-20210804.pdf',
    type: 'paper',
  },
  {
    title: 'PQCrypto 2024 – Conference Proceedings',
    description:
      'Actas de la conferencia internacional sobre Criptografía Post-Cuántica, con los últimos avances en investigación del área.',
    url: 'https://pqcrypto.org',
    type: 'paper',
  },
  {
    title: 'Curso MIT – Mathematics for Computer Science',
    description:
      'Fundamentos matemáticos necesarios para comprender los retículos: álgebra lineal, teoría de números y complejidad computacional.',
    url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
    type: 'course',
  },
  {
    title: 'The Learning with Errors Problem (Peikert)',
    description:
      'Encuesta detallada sobre el problema LWE, sus variantes y aplicaciones criptográficas, ideal para profundizar en la base teórica de ML-KEM.',
    url: 'https://web.eecs.umich.edu/~cpeikert/pubs/lwesurvey.pdf',
    type: 'course',
  },
  {
    title: 'Open Quantum Safe (liboqs)',
    description:
      'Biblioteca C de referencia con implementaciones de algoritmos PQC estándar, mantenida por la comunidad para investigación y experimentación.',
    url: 'https://openquantumsafe.org',
    type: 'tool',
  },
  {
    title: 'NIST PQC Project',
    description:
      'Página oficial del proyecto de estandarización de criptografía post-cuántica del NIST, con todas las rondas, documentos y actualizaciones.',
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    type: 'tool',
  },
];

interface TypeMeta {
  label: string;
  hex: string;
  icon: React.ReactNode;
  description: string;
}

const typeMeta: Record<ResourceType, TypeMeta> = {
  standard: {
    label: 'Estándares',
    hex: '#5eead4',
    icon: <Shield size={16} />,
    description: 'Documentos oficiales NIST y organismos de estandarización.',
  },
  paper: {
    label: 'Papers y artículos',
    hex: '#a78bfa',
    icon: <FlaskConical size={16} />,
    description: 'Investigación académica fundamental en criptografía de retículos.',
  },
  course: {
    label: 'Cursos y libros',
    hex: '#34d399',
    icon: <GraduationCap size={16} />,
    description: 'Material formativo para aprender los fundamentos matemáticos.',
  },
  tool: {
    label: 'Herramientas y proyectos',
    hex: '#fbbf24',
    icon: <Wrench size={16} />,
    description: 'Implementaciones de referencia, bibliotecas y recursos de la comunidad.',
  },
};

const ORDER: ResourceType[] = ['standard', 'paper', 'course', 'tool'];

const ResourceCard: React.FC<{ item: Resource; index: number }> = ({ item, index }) => {
  const { hex } = typeMeta[item.type];

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4, borderColor: hex }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative flex flex-col rounded-2xl border bg-quantum-panel/60 backdrop-blur-sm overflow-hidden cursor-pointer p-5 transition-all"
      style={{ borderColor: '#1f2750' }}
    >
      {/* accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${hex}, ${hex}33)` }}
      />
      {/* radial glow */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${hex}18, transparent 55%)`,
        }}
      />

      <div className="relative flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4
            className="font-display font-semibold text-slate-100 text-base leading-snug group-hover:transition-colors"
            style={{ ['--hover-color' as string]: hex }}
          >
            {item.title}
          </h4>
          <ExternalLink
            size={14}
            className="shrink-0 mt-0.5 text-slate-500 group-hover:text-current transition-colors"
            style={{ color: hex }}
          />
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
      </div>

      <div className="relative mt-4">
        <span
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
          style={{
            borderColor: `${hex}40`,
            background: `${hex}0d`,
            color: hex,
          }}
        >
          {typeMeta[item.type].icon}
          {typeMeta[item.type].label}
        </span>
      </div>
    </motion.a>
  );
};

const PQCResources: React.FC = () => {
  const grouped = ORDER.map((type) => ({
    type,
    meta: typeMeta[type],
    items: resources.filter((r) => r.type === type),
  }));

  return (
    <div className="space-y-16">
      {grouped.map(({ type, meta, items }) => (
        <div key={type}>
          {/* section header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg border"
              style={{
                background: `${meta.hex}15`,
                borderColor: `${meta.hex}40`,
                color: meta.hex,
              }}
            >
              {meta.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-slate-100">{meta.label}</h3>
              <p className="text-xs text-slate-400">{meta.description}</p>
            </div>
            <span className="hidden sm:inline-flex chip text-[10px]">
              {items.length} {items.length === 1 ? 'recurso' : 'recursos'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <ResourceCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-slate-500 flex items-center gap-2 pt-4 border-t border-quantum-border/60">
        <BookOpen size={12} />
        Selección curada con fines didácticos. Los enlaces apuntan a las fuentes originales;
        verifica su disponibilidad antes de citarlos.
      </p>
    </div>
  );
};

export default PQCResources;
