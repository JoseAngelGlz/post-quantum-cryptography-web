import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import PQCNews from '../shared/PQCNews';
import FeedbackForm from '../shared/FeedbackForm';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const NoticiasRoute: React.FC<RouteProps> = (_props) => {
  const t = useT();
  return (
    <div>
      <Hero
        eyebrow={t('noticias.hero.eyebrow')}
        hueA={45}
        hueB={300}
        title={
          <>
            <span className="text-gradient-quantum">{t('noticias.hero.titleLine1')}</span>
            <br />
            {t('noticias.hero.titleLine2')}
          </>
        }
        subtitle={t('noticias.hero.subtitle')}
      />

      <ScrollSection
        eyebrow={t('noticias.s01.eyebrow')}
        title={
          <>
            {t('noticias.s01.title.a')}
            <span className="text-gradient-static">{t('noticias.s01.title.b')}</span>
          </>
        }
      >
        <p className="text-quantum-fg max-w-3xl mb-10 text-[17px] leading-relaxed">
          {t('noticias.s01.lead.a')}
          <span className="text-quantum-amber">{t('noticias.s01.lead.b')}</span>
          {t('noticias.s01.lead.c')}
          <span className="text-quantum-cyan">{t('noticias.s01.lead.d')}</span>
          {t('noticias.s01.lead.e')}
        </p>
        <PQCNews />
      </ScrollSection>

      <FeedbackForm routeId="noticias" />
    </div>
  );
};

export default NoticiasRoute;
