import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import type { RouteId } from '../../routes';
import { useI18n } from '../../i18n';
import { useTheme } from '../../theme';
import { useAnalytics } from '../../hooks/useAnalytics';
import ProgressBadge from './ProgressBadge';

interface TopNavProps {
  current: RouteId;
  onChange: (r: RouteId) => void;
}

// Orden lineal de las rutas para el menú de navegación
const order: RouteId[] = [
  'intro',
  'fundamentos',
  'aplicaciones',
  'mlkem',
  'mldsa',
  'recursos',
];

// Barra de navegación fija: logo, menú de rutas, selector de idioma y tema
const TopNav: React.FC<TopNavProps> = ({ current, onChange }) => {
  const { t, locale, setLocale } = useI18n();
  const { mode, toggle } = useTheme();
  const { themeChanged, languageChanged } = useAnalytics();

  // Cambia el locale solo si es diferente al actual y lo registra en analytics
  const handleLocaleChange = (newLocale: 'es' | 'en') => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      languageChanged(newLocale);
    }
  };

  // Alterna el tema y registra el cambio en analytics
  const handleThemeToggle = () => {
    toggle();
    const newTheme = mode === 'dark' ? 'Claro' : 'Oscuro';
    themeChanged(newTheme);
  };

  // Traduce cada RouteId a su etiqueta localizada para el menú
  const routeLabels: Record<RouteId, string> = {
    intro: t('nav.intro'),
    fundamentos: t('nav.fundamentos'),
    aplicaciones: t('nav.aplicaciones'),
    mlkem: t('nav.mlkem'),
    mldsa: t('nav.mldsa'),
    recursos: t('nav.recursos'),
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-quantum-bg/70 border-b border-quantum-border/60"
    >
      {/* ── Logo ── */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-6 py-3">
        <button
          onClick={() => onChange('intro')}
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="PostQ"
        >
          <img
            src={`${import.meta.env.BASE_URL}q-orbita.svg`}
            alt="PostQ"
            className="w-9 h-9 rounded-lg object-contain group-hover:scale-105 transition-transform"
          />
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="font-display font-bold text-quantum-fg-strong group-hover:text-quantum-cyan transition-colors">
              PostQ
            </span>
            <span className="text-[10px] uppercase tracking-widest text-quantum-fg-mute">
              {t('brand.tagline')}
            </span>
          </div>
        </button>

        {/* ── Menú de rutas ── */}
        <nav className="flex items-center gap-1 text-sm overflow-x-auto scrollbar-none">
          {order.map((r) => (
            <button
              key={r}
              onClick={() => onChange(r)}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                current === r
                  ? 'text-quantum-cyan bg-quantum-cyan/10'
                  : 'text-quantum-fg-soft hover:text-quantum-fg-strong'
              }`}
            >
              {routeLabels[r]}
            </button>
          ))}
        </nav>

        {/* ── Controles: progreso, idioma, tema ── */}
        <div className="flex items-center gap-2 shrink-0">
          <ProgressBadge />

          {/* Selector de idioma (escritorio) */}
          <div
            className="hidden md:flex items-center text-xs font-mono rounded-full border border-quantum-border bg-quantum-panel/60 overflow-hidden"
            role="group"
            aria-label={t('nav.language')}
          >
            <button
              onClick={() => handleLocaleChange('es')}
              className={`px-2.5 py-1 transition-colors ${
                locale === 'es'
                  ? 'bg-quantum-cyan/15 text-quantum-cyan'
                  : 'text-quantum-fg-mute hover:text-quantum-fg-strong'
              }`}
              aria-pressed={locale === 'es'}
            >
              ES
            </button>
            <button
              onClick={() => handleLocaleChange('en')}
              className={`px-2.5 py-1 transition-colors ${
                locale === 'en'
                  ? 'bg-quantum-cyan/15 text-quantum-cyan'
                  : 'text-quantum-fg-mute hover:text-quantum-fg-strong'
              }`}
              aria-pressed={locale === 'en'}
            >
              EN
            </button>
          </div>

          {/* Selector de idioma (móvil: alterna entre ES y EN) */}
          <button
            onClick={() => handleLocaleChange(locale === 'es' ? 'en' : 'es')}
            className="md:hidden px-2 py-1 rounded-full border border-quantum-border bg-quantum-panel/60 text-xs font-mono text-quantum-fg-soft hover:text-quantum-cyan"
            aria-label={t('nav.language')}
          >
            {locale.toUpperCase()}
          </button>

          {/* Botón de alternancia de tema */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full border border-quantum-border bg-quantum-panel/60 text-quantum-fg-soft hover:text-quantum-cyan hover:border-quantum-cyan/40 transition-colors"
            aria-label={mode === 'dark' ? t('nav.theme.toLight') : t('nav.theme.toDark')}
            title={mode === 'dark' ? t('nav.theme.toLight') : t('nav.theme.toDark')}
          >
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNav;

// Botón auxiliar para volver a la introducción desde cualquier ruta
export const BackToIntro: React.FC<{ onChange: (r: RouteId) => void }> = ({ onChange }) => (
  <button onClick={() => onChange('intro')} className="btn-ghost text-sm">
    <ArrowLeft size={14} /> Volver al inicio
  </button>
);
