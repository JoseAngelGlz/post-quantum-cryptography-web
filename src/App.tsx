import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import type { RouteId } from './routes';
import TopNav from './components/shared/TopNav';
import IntroRoute from './components/routes/IntroRoute';
import FundamentosRoute from './components/routes/FundamentosRoute';
import AplicacionesRoute from './components/routes/AplicacionesRoute';
import MLKEMRoute from './components/routes/MLKEMRoute';
import NoticiasRoute from './components/routes/NoticiasRoute';

function App() {
  const [route, setRoute] = useState<RouteId>('intro');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const changeRoute = (r: RouteId) => {
    setRoute(r);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

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
      case 'noticias':
        return <NoticiasRoute onChange={changeRoute} />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-bg text-slate-200 relative overflow-x-hidden">
      <TopNav current={route} onChange={changeRoute} />

      <AnimatePresence mode="wait">
        <motion.main
          key={route}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="pt-0"
        >
          {renderRoute()}
        </motion.main>
      </AnimatePresence>

      <footer className="border-t border-quantum-border mt-20 py-10 text-center text-sm text-slate-500">
        <p>
          Criptografía Post-Cuántica · ML-KEM (FIPS 203, NIST 2024)
        </p>
        <p className="mt-1 text-xs">
          José Ángel González Álamo · Universidad de La Laguna
        </p>
      </footer>
    </div>
  );
}

export default App;
