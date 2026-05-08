import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScrollSectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({
  id,
  eyebrow,
  title,
  children,
  align = 'left',
  className = '',
}) => {
  return (
    <section
      id={id}
      className={`section-y px-6 md:px-10 max-w-6xl mx-auto ${className}`}
    >
      {(eyebrow || title) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}
        >
          {eyebrow && <div className="chip mb-4">{eyebrow}</div>}
          {title && (
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-slate-100">
              {title}
            </h2>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default ScrollSection;
