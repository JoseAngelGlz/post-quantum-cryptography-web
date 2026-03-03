import { ExternalLink, Info } from 'lucide-react';

const Lattices: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Lattices (Retículos)
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Un retículo es un conjunto discreto de puntos en el espacio n-dimensional con una
          estructura periódica. Formalmente, dado un conjunto de vectores base
          {' '}<span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">B = &#123;b₁, …, bₙ&#125;</span>,
          el retículo se define como todas las combinaciones enteras de esos vectores.
        </p>
      </header>

      {/* Definition cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Problema SVP (Shortest Vector Problem)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Dado un retículo, encontrar el vector no nulo más corto. Se cree que este problema
            es difícil incluso para ordenadores cuánticos, constituyendo la base de seguridad
            de muchos esquemas PQC.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Problema CVP (Closest Vector Problem)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Dado un retículo y un punto arbitrario, encontrar el punto del retículo más cercano.
            El CVP es NP-difícil y su variante Learning With Errors (LWE) es la base de ML-KEM.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            LWE (Learning With Errors)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Introducido por Regev (2005). Dado{' '}
            <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">
              (A, b = As + e mod q)
            </span>
            , recuperar{' '}
            <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">s</span>.
            La variante Module-LWE (MLWE) es la base matemática de ML-KEM.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            NTRU y Ring-LWE
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Las variantes de anillo trabajan con polinomios truncados, ofreciendo mayor eficiencia.
            FALCON (FIPS 206) utiliza retículos NTRU, mientras que Kyber/ML-KEM usa Module-LWE
            sobre anillos de polinomios.
          </p>
        </div>
      </div>

      {/* GeoGebra applet placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Visualización Interactiva de Retículos 2D
          </h3>
          <a
            href="https://www.geogebra.org/m/js4x7wfj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Abrir GeoGebra <ExternalLink size={14} />
          </a>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Mueve el punto objetivo y utiliza los controles del applet para observar cómo cambia
            el vector más cercano (CVP) y el vector más corto del retículo (SVP).
          </p>
        </div>

        <iframe
          title="GeoGebra SVP/CVP Applet"
          src="https://www.geogebra.org/material/iframe/id/js4x7wfj/width/1000/height/600/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/true/ctl/false"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
          style={{ height: '560px' }}
          loading="lazy"
          allowFullScreen
        />

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Fuente del recurso interactivo: GeoGebra Material <span className="font-mono">js4x7wfj</span>.
          Para documentación académica del TFG, cita explícitamente el autor/material original.
        </p>
      </div>
    </div>
  );
};

export default Lattices;
