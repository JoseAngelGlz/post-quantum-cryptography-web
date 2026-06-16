import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Accessibility } from 'lucide-react';
import { useT } from '../../i18n';

// Declaración de accesibilidad: enlace en el pie de página que abre un modal
// con la información de accesibilidad y un correo de contacto.
const AccessibilityStatement: React.FC = () => {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-quantum-cyan transition-colors"
      >
        <Accessibility size={13} />
        {t('footer.a11y')}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-quantum-panel border border-quantum-border rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl text-left"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-quantum-fg-strong">
                  {t('a11y.title')}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-quantum-panel2 rounded-md transition-colors"
                  aria-label={t('a11y.close')}
                >
                  <X size={18} className="text-quantum-fg-mute" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-quantum-fg-soft leading-relaxed">
                <p>{t('a11y.body1')}</p>
                <p>{t('a11y.body2')}</p>
                <p>
                  {t('a11y.contact')}{' '}
                  <a
                    href={`mailto:${t('a11y.email')}`}
                    className="text-quantum-cyan underline underline-offset-2 hover:text-quantum-cyan/80 break-all"
                  >
                    {t('a11y.email')}
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityStatement;
