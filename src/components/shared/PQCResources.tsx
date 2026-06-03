import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, FlaskConical, GraduationCap, Shield, Wrench } from 'lucide-react';
import { useT } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';
import { useAnalytics } from '../../hooks/useAnalytics';

type ResourceType = 'standard' | 'paper' | 'course' | 'tool';

interface ResourceKey {
  id: string;
  url: string;
  type: ResourceType;
}

const resources: ResourceKey[] = [
  { id: 'fips203', url: 'https://doi.org/10.6028/NIST.FIPS.203', type: 'standard' },
  { id: 'fips204', url: 'https://doi.org/10.6028/NIST.FIPS.204', type: 'standard' },
  { id: 'fips205', url: 'https://doi.org/10.6028/NIST.FIPS.205', type: 'standard' },
  { id: 'pandora', url: 'https://pandora-ecc.netlify.app/simulation', type: 'paper' },
  { id: 'geogebra', url: 'https://www.geogebra.org/m/js4x7wfj', type: 'paper' },
  { id: 'genially', url: 'https://view.genially.com/67d80511d9ee7dc76780d0b1/', type: 'paper' },
  { id: 'asecuritysite', url: 'https://asecuritysite.com/pqc/', type: 'tool' },
  { id: 'crystals', url: 'https://pq-crystals.org/index.shtml', type: 'tool' },
  { id: 'cryptool', url: 'https://www.cryptool.org/en/cto/kyber/', type: 'tool' },
];

interface TypeMeta {
  labelKey: string;
  hex: string;
  icon: React.ReactNode;
  descKey: string;
}

const typeMeta: Record<ResourceType, TypeMeta> = {
  standard: {
    labelKey: 'res.cat.norm',
    descKey: 'res.cat.norm.desc',
    hex: '#5eead4',
    icon: <Shield size={16} />,
  },
  paper: {
    labelKey: 'res.cat.papers',
    descKey: 'res.cat.papers.desc',
    hex: '#a78bfa',
    icon: <FlaskConical size={16} />,
  },
  course: {
    labelKey: 'res.cat.learn',
    descKey: 'res.cat.learn.desc',
    hex: '#34d399',
    icon: <GraduationCap size={16} />,
  },
  tool: {
    labelKey: 'res.cat.tools',
    descKey: 'res.cat.tools.desc',
    hex: '#fbbf24',
    icon: <Wrench size={16} />,
  },
};

const ORDER: ResourceType[] = ['standard', 'paper', 'course', 'tool'];

// Tarjeta de recurso externo: muestra título, descripción, tipo y enlace; registra clic en analytics
const ResourceCard: React.FC<{ item: ResourceKey; index: number }> = ({ item, index }) => {
  const t = useT();
  const { resourceOpened } = useAnalytics();
  const meta = typeMeta[item.type];
  const { hex } = meta;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => resourceOpened(item.id, item.type, item.url)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4, borderColor: hex }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative flex flex-col rounded-2xl border bg-quantum-panel/60 backdrop-blur-sm overflow-hidden cursor-pointer p-5 transition-all"
      style={{ borderColor: 'rgb(var(--border))' }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${hex}, ${hex}33)` }}
      />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${hex}18, transparent 55%)` }}
      />

      <div className="relative flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-display font-semibold text-quantum-fg-strong text-base leading-snug">
            {t(`res.${item.id}.title` as TranslationKey)}
          </h4>
          <ExternalLink
            size={14}
            className="shrink-0 mt-0.5 transition-colors"
            style={{ color: hex }}
          />
        </div>
        <p className="text-sm text-quantum-fg-soft leading-relaxed">
          {t(`res.${item.id}.desc` as TranslationKey)}
        </p>
      </div>

      <div className="relative mt-4">
        <span
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
          style={{
            borderColor: `${hex}40`,
            background: `${hex}0d`,
            color: hex,
          }}
        >
          {meta.icon}
          {t(meta.labelKey as TranslationKey)}
        </span>
      </div>
    </motion.a>
  );
};

const PQCResources: React.FC = () => {
  const t = useT();
  const grouped = ORDER.map((type) => ({
    type,
    meta: typeMeta[type],
    items: resources.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-16">
      {grouped.map(({ type, meta, items }) => (
        <div key={type}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg border"
              style={{
                background: `${meta.hex}15`,
                borderColor: `${meta.hex}40`,
                color: meta.hex,
              }}
            >
              {meta.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-quantum-fg-strong">
                {t(meta.labelKey as TranslationKey)}
              </h3>
              <p className="text-xs text-quantum-fg-mute">
                {t(meta.descKey as TranslationKey)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <ResourceCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-quantum-fg-mute flex items-center gap-2 pt-4 border-t border-quantum-border/60">
        <BookOpen size={12} />
        {t('news.footer')}
      </p>
    </div>
  );
};

export default PQCResources;
