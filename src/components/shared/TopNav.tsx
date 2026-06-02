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

const order: RouteId[] = [
  'intro',
  'fundamentos',
  'aplicaciones',
  'mlkem',
  'mldsa',
  'noticias',
  'recursos',
];

const TopNav: React.FC<TopNavProps> = ({ current, onChange }) => {
  const { t, locale, setLocale } = useI18n();
  const { mode, toggle } = useTheme();
  const { themeChanged, languageChanged } = useAnalytics();

  const handleLocaleChange = (newLocale: 'es' | 'en') => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      languageChanged(newLocale);
    }
  };

  const handleThemeToggle = () => {
    toggle();
    const newTheme = mode === 'dark' ? 'Claro' : 'Oscuro';
    themeChanged(newTheme);
  };

  const routeLabels: Record<RouteId, string> = {
    intro: t('nav.intro'),
    fundamentos: t('nav.fundamentos'),
    aplicaciones: t('nav.aplicaciones'),
    mlkem: t('nav.mlkem'),
    mldsa: t('nav.mldsa'),
    noticias: t('nav.noticias'),
    recursos: t('nav.recursos'),
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-quantum-bg/70 border-b border-quantum-border/60"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-6 py-3">
        {/* Brand */}
        <button
          onClick={() => onChange('intro')}
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="PostQ"
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
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

        {/* Routes */}
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

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Progress badge */}
          <ProgressBadge />

          {/* Language pill */}
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

          {/* Mobile language toggle */}
          <button
            onClick={() => handleLocaleChange(locale === 'es' ? 'en' : 'es')}
            className="md:hidden px-2 py-1 rounded-full border border-quantum-border bg-quantum-panel/60 text-xs font-mono text-quantum-fg-soft hover:text-quantum-cyan"
            aria-label={t('nav.language')}
          >
            {locale.toUpperCase()}
          </button>

          {/* Theme toggle */}
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

export const BackToIntro: React.FC<{ onChange: (r: RouteId) => void }> = ({ onChange }) => (
  <button onClick={() => onChange('intro')} className="btn-ghost text-sm">
    <ArrowLeft size={14} /> Volver al inicio
  </button>
);
