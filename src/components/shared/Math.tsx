import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  children: string;
  display?: boolean;
  className?: string;
}

// Renderiza una expresión LaTeX a HTML mediante KaTeX.
// display=true la centra en bloque; false la deja en línea.
const Math: React.FC<MathProps> = ({ children, display = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode: display,
        throwOnError: false,
        strict: 'ignore',
      });
    } catch {
      return children;
    }
  }, [children, display]);

  return (
    <span
      className={`${display ? 'block my-4 text-center' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Math;
