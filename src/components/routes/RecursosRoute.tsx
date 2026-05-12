import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import PQCResources from '../shared/PQCResources';
import FeedbackForm from '../shared/FeedbackForm';
import type { RouteId } from '../../routes';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const RecursosRoute: React.FC<RouteProps> = (_props) => {
  return (
    <div>
      <Hero
        eyebrow="Para profundizar"
        hueA={220}
        hueB={160}
        title={
          <>
            <span className="text-gradient-quantum">Recursos</span>
            <br />
            y referencias
          </>
        }
        subtitle="Estándares oficiales, papers seminales, cursos y herramientas. Todo lo que necesitas para ir más allá de esta web y construir sobre bases sólidas."
      />

      <ScrollSection
        eyebrow="Biblioteca curada"
        title={
          <>
            Dónde <span className="text-gradient-static">seguir aprendiendo</span>
          </>
        }
      >
        <p className="text-slate-300 max-w-3xl mb-10 text-[17px] leading-relaxed">
          Desde los documentos normativos del{' '}
          <span className="text-quantum-cyan">NIST</span> hasta el paper original de Regev,
          pasando por implementaciones de referencia y material formativo. Ordenado por tipo
          para que encuentres rápido lo que buscas.
        </p>
        <PQCResources />
      </ScrollSection>

      <FeedbackForm routeId="recursos" routeName="la sección de recursos" />
    </div>
  );
};

export default RecursosRoute;
