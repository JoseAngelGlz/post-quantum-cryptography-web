import { ExternalLink, FileText, BookOpen, Globe } from 'lucide-react';

interface Resource {
  title: string;
  description: string;
  url: string;
  type: 'standard' | 'paper' | 'course' | 'tool';
}

const resources: Resource[] = [
  {
    title: 'NIST FIPS 203 – ML-KEM',
    description: 'Estándar oficial del NIST para el mecanismo de encapsulamiento de claves basado en Module-Lattice. Define ML-KEM-512, ML-KEM-768 y ML-KEM-1024.',
    url: 'https://doi.org/10.6028/NIST.FIPS.203',
    type: 'standard',
  },
  {
    title: 'NIST FIPS 204 – ML-DSA',
    description: 'Estándar NIST para el esquema de firma digital basado en Module-Lattice (anteriormente CRYSTALS-Dilithium).',
    url: 'https://doi.org/10.6028/NIST.FIPS.204',
    type: 'standard',
  },
  {
    title: 'NIST FIPS 205 – SLH-DSA',
    description: 'Estándar NIST para el esquema de firma digital sin estado basado en funciones hash (anteriormente SPHINCS+).',
    url: 'https://doi.org/10.6028/NIST.FIPS.205',
    type: 'standard',
  },
  {
    title: 'On Lattices, Learning with Errors… (Regev, 2005)',
    description: 'Artículo seminal que introduce el problema LWE y su reducción desde SVP, estableciendo las bases teóricas de la criptografía de retículos moderna.',
    url: 'https://cims.nyu.edu/~regev/papers/qcrypto.pdf',
    type: 'paper',
  },
  {
    title: 'CRYSTALS-Kyber Algorithm Specification',
    description: 'Especificación técnica completa del algoritmo Kyber (ahora ML-KEM), incluyendo parámetros, algoritmos y análisis de seguridad.',
    url: 'https://pq-crystals.org/kyber/data/kyber-specification-round3-20210804.pdf',
    type: 'paper',
  },
  {
    title: 'PQCrypto 2024 – Conference Proceedings',
    description: 'Actas de la conferencia internacional sobre Criptografía Post-Cuántica, con los últimos avances en investigación del área.',
    url: 'https://pqcrypto.org',
    type: 'paper',
  },
  {
    title: 'Curso MIT – Mathematics for Computer Science',
    description: 'Fundamentos matemáticos necesarios para comprender los retículos: álgebra lineal, teoría de números y complejidad computacional.',
    url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
    type: 'course',
  },
  {
    title: 'The Learning with Errors Problem (Peikert)',
    description: 'Encuesta detallada sobre el problema LWE, sus variantes y aplicaciones criptográficas, ideal para profundizar en la base teórica de ML-KEM.',
    url: 'https://web.eecs.umich.edu/~cpeikert/pubs/lwesurvey.pdf',
    type: 'course',
  },
  {
    title: 'Open Quantum Safe (liboqs)',
    description: 'Biblioteca C de referencia con implementaciones de algoritmos PQC estándar, mantenida por la comunidad para investigación y experimentación.',
    url: 'https://openquantumsafe.org',
    type: 'tool',
  },
  {
    title: 'NIST PQC Project',
    description: 'Página oficial del proyecto de estandarización de criptografía post-cuántica del NIST, con todas las rondas, documentos y actualizaciones.',
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    type: 'tool',
  },
];

const typeConfig: Record<Resource['type'], { label: string; className: string; icon: React.ReactNode }> = {
  standard: {
    label: 'Estándar',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    icon: <FileText size={12} />,
  },
  paper: {
    label: 'Artículo',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    icon: <BookOpen size={12} />,
  },
  course: {
    label: 'Formación',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    icon: <BookOpen size={12} />,
  },
  tool: {
    label: 'Herramienta',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    icon: <Globe size={12} />,
  },
};

const Resources: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Recursos
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Colección de estándares, artículos académicos, cursos y herramientas para profundizar
          en la Criptografía Post-Cuántica.
        </p>
      </header>

      {/* Filter badges */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(typeConfig) as Resource['type'][]).map((type) => {
          const cfg = typeConfig[type];
          return (
            <span key={type} className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
              {cfg.icon}
              {cfg.label}
            </span>
          );
        })}
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {resources.map((resource) => {
          const cfg = typeConfig[resource.type];
          return (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>
                  {cfg.icon}
                  {cfg.label}
                </span>
                <ExternalLink
                  size={14}
                  className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5"
                />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {resource.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex-1 leading-relaxed">
                {resource.description}
              </p>
              <span className="text-xs text-blue-500 dark:text-blue-400 mt-3 font-mono truncate">
                {resource.url}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Resources;
