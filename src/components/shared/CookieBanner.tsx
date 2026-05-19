import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import posthog from 'posthog-js';
import { useT } from '../../i18n';

interface CookieBannerProps {
  onAccept?: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept }) => {
  const t = useT();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('quanta-cookie-consent');
    if (!consent) {
      setShown(true);
    } else if (consent === 'accepted') {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('quanta-cookie-consent', 'accepted');
    posthog.opt_in_capturing();
    onAccept?.();
    setShown(false);
  };

  const handleReject = () => {
    localStorage.setItem('quanta-cookie-consent', 'rejected');
    posthog.opt_out_capturing();
    setShown(false);
  };

  return (
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
                  {t('cookies.body')}
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
  );
};

export default CookieBanner;
