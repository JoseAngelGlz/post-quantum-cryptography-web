import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import PQCNews from '../shared/PQCNews';
import FeedbackForm from '../shared/FeedbackForm';
import type { RouteId } from '../../routes';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const NoticiasRoute: React.FC<RouteProps> = (_props) => {
  return (
    <div>
      <Hero
        eyebrow="Pulso del sector"
        hueA={45}
        hueB={300}
        title={
          <>
            <span className="text-gradient-quantum">Noticias</span>
            <br />
            post-cuánticas
          </>
        }
        subtitle="Hitos, estándares y despliegues que están definiendo la transición a criptografía post-cuántica. Una selección curada para tener el contexto actual a mano."
      />

      <ScrollSection
        eyebrow="Selección curada"
        title={
          <>
            Lo que <span className="text-gradient-static">está pasando</span>
          </>
        }
      >
        <p className="text-slate-300 max-w-3xl mb-10 text-[17px] leading-relaxed">
          Desde que el NIST publicó los primeros estándares en 2024, la PQC ha pasado del
          paper académico al despliegue masivo. Aquí tienes los movimientos que conviene
          tener en el radar — los <span className="text-quantum-amber">destacados</span>{' '}
          marcan el contexto histórico, los <span className="text-quantum-cyan">recientes</span>{' '}
          el calendario actual.
        </p>
        <PQCNews />
      </ScrollSection>

      <FeedbackForm routeId="noticias" routeName="el bloque de noticias" />
    </div>
  );
};

export default NoticiasRoute;
