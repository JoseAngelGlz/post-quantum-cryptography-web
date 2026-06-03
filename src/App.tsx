import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import type { RouteId } from './routes';
import TopNav from './components/shared/TopNav';
import RouteTransition from './components/shared/RouteTransition';
import CookieBanner from './components/shared/CookieBanner';
import IntroRoute from './components/routes/IntroRoute';
import FundamentosRoute from './components/routes/FundamentosRoute';
import AplicacionesRoute from './components/routes/AplicacionesRoute';
import MLKEMRoute from './components/routes/MLKEMRoute';
import MLDSARoute from './components/routes/MLDSARoute';
import NoticiasRoute from './components/routes/NoticiasRoute';
import RecursosRoute from './components/routes/RecursosRoute';
import { useT } from './i18n';
import { useTheme } from './theme';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const [route, setRoute] = useState<RouteId>('intro');
  const t = useT();
  const { mode } = useTheme();
  const { pageView, themeDefault } = useAnalytics();

  const themeChangedRef = useRef(false);
  const initialModeRef = useRef(mode);
  const isFirstRenderRef = useRef(true);

  // Detecta si el usuario cambió de tema antes de que se cumpla el timeout de 60 s
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    themeChangedRef.current = true;
  }, [mode]);

  // Si pasado 1 minuto el usuario no cambió el tema, registra el tema inicial en analytics
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!themeChangedRef.current) {
        themeDefault(initialModeRef.current === 'dark' ? 'Oscuro' : 'Claro');
      }
    }, 60_000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Registra cada cambio de ruta en analytics
  useEffect(() => {
    pageView(route);
  }, [route, pageView]);

  // Navega a una ruta y hace scroll suave al inicio de la página
  const changeRoute = (r: RouteId) => {
    setRoute(r);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // Mapea el estado de ruta al componente correspondiente
  const renderRoute = () => {
    switch (route) {
      case 'intro':
        return <IntroRoute onChange={changeRoute} />;
      case 'fundamentos':
        return <FundamentosRoute onChange={changeRoute} />;
      case 'aplicaciones':
        return <AplicacionesRoute onChange={changeRoute} />;
      case 'mlkem':
        return <MLKEMRoute onChange={changeRoute} />;
      case 'mldsa':
        return <MLDSARoute onChange={changeRoute} />;
      case 'noticias':
        return <NoticiasRoute onChange={changeRoute} />;
      case 'recursos':
        return <RecursosRoute onChange={changeRoute} />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-bg text-quantum-fg relative overflow-x-hidden">
      {/* ── Navegación fija superior ── */}
      <TopNav current={route} onChange={changeRoute} />

      {/* ── Fondo de constelación ── */}
      <RouteTransition />

      {/* ── Contenido de la ruta activa con transición de opacidad ── */}
      <AnimatePresence mode="wait">
        <motion.main
          key={route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="pt-0"
        >
          {renderRoute()}
        </motion.main>
      </AnimatePresence>

      {/* ── Pie de página ── */}
      <footer className="border-t border-quantum-border mt-20 py-10 text-center text-sm text-quantum-fg-mute">
        <p>{t('footer.line1')}</p>
        <p className="mt-1 text-xs">{t('footer.line2')}</p>
      </footer>

      {/* ── Banner de cookies ── */}
      <CookieBanner onAccept={() => pageView(route)} />
    </div>
  );
}

export default App;
