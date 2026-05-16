import Hero from '../shared/Hero';
import ScrollSection from '../shared/ScrollSection';
import PQCResources from '../shared/PQCResources';
import FeedbackForm from '../shared/FeedbackForm';
import type { RouteId } from '../../routes';
import { useT } from '../../i18n';

interface RouteProps {
  onChange: (r: RouteId) => void;
}

const RecursosRoute: React.FC<RouteProps> = (_props) => {
  const t = useT();
  return (
    <div>
      <Hero
        eyebrow={t('recursos.hero.eyebrow')}
        hueA={220}
        hueB={160}
        title={
          <>
            <span className="text-gradient-quantum">{t('recursos.hero.titleLine1')}</span>
            <br />
            {t('recursos.hero.titleLine2')}
          </>
        }
        subtitle={t('recursos.hero.subtitle')}
      />

      <ScrollSection
        eyebrow={t('recursos.s01.eyebrow')}
        title={
          <>
            {t('recursos.s01.title.a')}
            <span className="text-gradient-static">{t('recursos.s01.title.b')}</span>
          </>
        }
      >
        <p className="text-quantum-fg max-w-3xl mb-10 text-[17px] leading-relaxed">
          {t('recursos.s01.lead.a')}
        </p>
        <PQCResources />
      </ScrollSection>

      <FeedbackForm routeId="recursos" />
    </div>
  );
};

export default RecursosRoute;
