import { ShieldCheck, Zap, Lock, AlertTriangle } from 'lucide-react';

const Introduction: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Introducción a la Criptografía Post-Cuántica
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          La llegada de los ordenadores cuánticos representa una amenaza directa a los sistemas
          criptográficos actuales. Esta aplicación explora las bases matemáticas y los algoritmos
          que formarán la criptografía del futuro.
        </p>
      </header>

      {/* Alert card */}
      <div className="flex gap-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">¿Por qué importa?</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            El algoritmo de Shor, ejecutado en un ordenador cuántico suficientemente potente,
            podría romper RSA, ECDSA y Diffie-Hellman en tiempo polinomial, comprometiendo
            la mayor parte de la infraestructura de clave pública actual.
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-500" size={22} />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Seguridad Cuántica</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Los algoritmos PQC están diseñados para resistir ataques tanto de ordenadores
            clásicos como cuánticos, basándose en problemas matemáticos intratables.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-green-500" size={22} />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Estándar NIST</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            En 2024, el NIST publicó los primeros estándares PQC: ML-KEM (FIPS 203),
            ML-DSA (FIPS 204) y SLH-DSA (FIPS 205), basados en retículos y funciones hash.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="text-purple-500" size={22} />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Familias de Algoritmos</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Las principales familias son: Retículos (Lattices), Códigos de Corrección de Errores,
            Funciones Hash y Polinomios Multivariante.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Cronología del Proceso NIST PQC
        </h3>
        <div className="space-y-3">
          {[
            { year: '2016', event: 'NIST lanza la convocatoria de propuestas para algoritmos PQC.' },
            { year: '2017', event: '69 algoritmos son presentados al proceso de estandarización.' },
            { year: '2022', event: 'Se seleccionan CRYSTALS-Kyber, CRYSTALS-Dilithium, FALCON y SPHINCS+.' },
            { year: '2024', event: 'Publicación oficial de FIPS 203, 204 y 205 como estándares definitivos.' },
          ].map((item) => (
            <div key={item.year} className="flex gap-4 items-start">
              <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded shrink-0 mt-0.5">
                {item.year}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.event}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
