import { motion } from 'framer-motion';
import {
  Calendar,
  ExternalLink,
  Globe,
  Lock,
  MessageCircle,
  Newspaper,
  Radio,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useT } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

type Palette = 'cyan' | 'violet' | 'pink' | 'mint' | 'amber' | 'rose' | 'blue';

const paletteHex: Record<Palette, string> = {
  cyan: '#5eead4',
  violet: '#a78bfa',
  pink: '#f472b6',
  mint: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  blue: '#60a5fa',
};

interface NewsKey {
  prefix: string; // e.g. 'news.f1'
  url?: string;
  palette: Palette;
  icon: React.ReactNode;
}

const featuredKeys: NewsKey[] = [
  { prefix: 'news.f1', url: 'https://csrc.nist.gov/projects/post-quantum-cryptography', palette: 'cyan', icon: <Shield size={18} /> },
  { prefix: 'news.f2', url: 'https://security.apple.com/blog/imessage-pq3/', palette: 'violet', icon: <MessageCircle size={18} /> },
  { prefix: 'news.f3', url: 'https://csrc.nist.gov/projects/post-quantum-cryptography', palette: 'pink', icon: <Radio size={18} /> },
];

const recentKeys: NewsKey[] = [
  { prefix: 'news.r1', url: 'https://csrc.nist.gov/projects/post-quantum-cryptography', palette: 'amber', icon: <Sparkles size={18} /> },
  { prefix: 'news.r2', url: 'https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF', palette: 'rose', icon: <Shield size={18} /> },
  { prefix: 'news.r3', url: 'https://blog.chromium.org/', palette: 'blue', icon: <Globe size={18} /> },
  { prefix: 'news.r4', url: 'https://signal.org/docs/specifications/pqxdh/', palette: 'mint', icon: <Lock size={18} /> },
];

interface NewsCardProps {
  k: NewsKey;
  variant?: 'hero' | 'featured' | 'compact';
  index?: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ k, variant = 'compact', index = 0 }) => {
  const t = useT();
  const hex = paletteHex[k.palette];
  const isHero = variant === 'hero';
  const isFeatured = variant === 'featured';

  const inner = (
    <>
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${hex}22, transparent 60%)` }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${hex}, ${hex}33)` }}
      />

      <div className="relative">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              background: `linear-gradient(135deg, ${hex}22, ${hex}0a)`,
              borderColor: `${hex}55`,
              color: hex,
            }}
          >
            {k.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-quantum-fg-mute font-mono">
              <Calendar size={11} />
              <span>{t(`${k.prefix}.date` as TranslationKey)}</span>
            </div>
          </div>
          {k.url && (
            <ExternalLink
              size={14}
              className="text-quantum-fg-mute group-hover:text-current shrink-0 transition-colors"
              style={{ color: hex }}
            />
          )}
        </div>

        <h4
          className={`font-display font-semibold text-quantum-fg-strong mb-2 leading-snug ${
            isHero ? 'text-xl md:text-2xl' : isFeatured ? 'text-lg' : 'text-base'
          }`}
        >
          {t(`${k.prefix}.title` as TranslationKey)}
        </h4>
        <p
          className={`text-quantum-fg-soft leading-relaxed mb-4 ${
            isHero ? 'text-[15px]' : 'text-sm'
          }`}
        >
          {t(`${k.prefix}.summary` as TranslationKey)}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{
                borderColor: `${hex}40`,
                background: `${hex}0d`,
                color: hex,
              }}
            >
              {t(`${k.prefix}.tag${n}` as TranslationKey)}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const baseClass =
    'group relative block text-left h-full rounded-2xl border bg-quantum-panel/60 backdrop-blur-sm overflow-hidden transition-all cursor-pointer';
  const padding = isHero ? 'p-6 md:p-8' : 'p-5';
  const wrapperStyle = { borderColor: 'rgb(var(--border))' } as React.CSSProperties;

  if (k.url) {
    return (
      <motion.a
        href={k.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        whileHover={{ y: -4, borderColor: hex }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={`${baseClass} ${padding}`}
        style={wrapperStyle}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -4, borderColor: hex }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`${baseClass} ${padding}`}
      style={wrapperStyle}
    >
      {inner}
    </motion.div>
  );
};

const PQCNews: React.FC = () => {
  const t = useT();
  const [heroItem, ...restFeatured] = featuredKeys;

  return (
    <div className="space-y-14">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-quantum-amber/15 text-quantum-amber">
            <Star size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl md:text-2xl font-bold text-quantum-fg-strong">
              {t('news.featured.title')}
            </h3>
            <p className="text-xs text-quantum-fg-mute">{t('news.featured.lead')}</p>
          </div>
          <span className="hidden sm:inline-flex chip text-[10px]">
            {featuredKeys.length} {t('news.featured.count')}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="lg:row-span-2">
            <NewsCard k={heroItem} variant="hero" index={0} />
          </div>
          {restFeatured.map((k, i) => (
            <NewsCard key={k.prefix} k={k} variant="featured" index={i + 1} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-quantum-cyan/15 text-quantum-cyan">
            <TrendingUp size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl md:text-2xl font-bold text-quantum-fg-strong">
              {t('news.recent.title')}
            </h3>
            <p className="text-xs text-quantum-fg-mute">{t('news.recent.lead')}</p>
          </div>
          <span className="hidden sm:inline-flex chip text-[10px]">
            {recentKeys.length} {t('news.recent.count')}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recentKeys.map((k, i) => (
            <NewsCard key={k.prefix} k={k} variant="compact" index={i} />
          ))}
        </div>
      </div>

      <p className="text-xs text-quantum-fg-mute flex items-center gap-2 pt-4 border-t border-quantum-border/60">
        <Newspaper size={12} />
        {t('news.footer')}
      </p>
    </div>
  );
};

export default PQCNews;
