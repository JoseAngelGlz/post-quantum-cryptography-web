import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import posthog from 'posthog-js';
import { useT } from '../../i18n';
import { useAnalytics } from '../../hooks/useAnalytics';

interface CookieBannerProps {
  onAccept?: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept }) => {
  const t = useT();
  const { cookieConsent } = useAnalytics();
  const [shown, setShown] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('postq-cookie-consent');
    if (!consent) {
      setShown(true);
    } else if (consent === 'accepted') {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('postq-cookie-consent', 'accepted');
    posthog.opt_in_capturing();
    cookieConsent('Aceptado');
    onAccept?.();
    setShown(false);
  };

  const handleReject = () => {
    localStorage.setItem('postq-cookie-consent', 'rejected');
    posthog.opt_out_capturing();
    cookieConsent('Rechazado');
    setShown(false);
  };

  return (
    <>
      <AnimatePresence>
        {shown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6"
          >
            <div className="max-w-md mx-auto bg-quantum-panel border border-quantum-border rounded-2xl p-5 md:p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-quantum-fg-strong text-sm md:text-base">
                    {t('cookies.title')}
                  </h3>
                  <p className="text-xs md:text-sm text-quantum-fg-soft mt-2">
                    {t('cookies.body')}{' '}
                    <button
                      type="button"
                      onClick={() => setPolicyOpen(true)}
                      className="underline underline-offset-2 text-quantum-cyan hover:text-quantum-cyan/80 transition-colors"
                    >
                      {t('cookies.policy')}
                    </button>
                  </p>
                </div>
                <button
                  onClick={handleReject}
                  className="shrink-0 p-1 hover:bg-quantum-panel2 rounded-md transition-colors"
                  aria-label={t('cookies.close')}
                >
                  <X size={16} className="text-quantum-fg-mute" />
                </button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 rounded-lg border border-quantum-border text-quantum-fg-soft hover:bg-quantum-panel2 transition-colors text-sm font-medium"
                >
                  {t('cookies.reject')}
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2 rounded-lg bg-quantum-cyan/15 border border-quantum-cyan/40 text-quantum-cyan hover:bg-quantum-cyan/25 transition-colors text-sm font-medium"
                >
                  {t('cookies.accept')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {policyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setPolicyOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-quantum-panel border border-quantum-border rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-quantum-fg-strong">
                  {t('cookies.policy')}
                </h2>
                <button
                  onClick={() => setPolicyOpen(false)}
                  className="p-1 hover:bg-quantum-panel2 rounded-md transition-colors"
                >
                  <X size={18} className="text-quantum-fg-mute" />
                </button>
              </div>

              <CookiePolicyContent t={t} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Contenido del modal de política de cookies: qué cookies se usan, finalidad,
// conservación y cómo revocar el consentimiento. Todos los textos vienen de translations.ts
const CookiePolicyContent: React.FC<{ t: ReturnType<typeof useT> }> = ({ t }) => {
  return (
    <div className="space-y-5 text-sm text-quantum-fg-soft leading-relaxed">
      <section>
        <h3 className="font-semibold text-quantum-fg-strong mb-2">{t('cookies.policy.q1.title')}</h3>
        <p>
          {t('cookies.policy.q1.body.a')}
          <span className="text-quantum-cyan font-mono">{t('cookies.policy.q1.body.b')}</span>
          {t('cookies.policy.q1.body.c')}
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-quantum-fg-strong mb-2">{t('cookies.policy.q2.title')}</h3>
        <p>{t('cookies.policy.q2.body')}</p>
      </section>

      <section>
        <h3 className="font-semibold text-quantum-fg-strong mb-2">{t('cookies.policy.q3.title')}</h3>
        <p>
          {t('cookies.policy.q3.body.a')}
          <strong>{t('cookies.policy.q3.body.b')}</strong>
          {t('cookies.policy.q3.body.c')}
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-quantum-fg-strong mb-2">{t('cookies.policy.q4.title')}</h3>
        <p>
          {t('cookies.policy.q4.body.a')}
          <span className="font-mono text-quantum-cyan">{t('cookies.policy.q4.body.b')}</span>
          {t('cookies.policy.q4.body.c')}
        </p>
      </section>
    </div>
  );
};

export default CookieBanner;
