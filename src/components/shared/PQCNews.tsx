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

interface NewsItem {
  displayDate: string;
  title: string;
  source: string;
  summary: string;
  url?: string;
  tags: string[];
  palette: Palette;
  icon: React.ReactNode;
}

const featured: NewsItem[] = [
  {
    displayDate: 'Ago 2024',
    title: 'NIST publica los primeros estándares post-cuánticos: FIPS 203, 204 y 205',
    source: 'NIST',
    summary:
      'Tras casi una década de evaluación, el NIST estandariza ML-KEM (FIPS 203), ML-DSA (FIPS 204) y SLH-DSA (FIPS 205). Empieza oficialmente la migración global a criptografía post-cuántica.',
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    tags: ['Estándar', 'ML-KEM', 'NIST'],
    palette: 'cyan',
    icon: <Shield size={18} />,
  },
  {
    displayDate: 'Feb 2024',
    title: 'Apple lanza PQ3 en iMessage, un protocolo post-cuántico desplegado a escala',
    source: 'Apple Security Research',
    summary:
      'iMessage combina ECDH con un KEM post-cuántico en su nuevo protocolo PQ3. Es el primer protocolo de mensajería ampliamente desplegado que protege frente a "cosecha ahora, descifra después".',
    url: 'https://security.apple.com/blog/imessage-pq3/',
    tags: ['Industria', 'Mensajería', 'Apple'],
    palette: 'violet',
    icon: <MessageCircle size={18} />,
  },
  {
    displayDate: 'Mar 2025',
    title: 'NIST selecciona HQC como respaldo a ML-KEM frente a un posible fallo en retículos',
    source: 'NIST CSRC',
    summary:
      'HQC, basado en códigos correctores, se elige como segundo KEM oficial. La idea: que la PQC no dependa de una única familia matemática. El borrador del estándar se espera para 2026.',
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    tags: ['Códigos', 'NIST', 'KEM'],
    palette: 'pink',
    icon: <Radio size={18} />,
  },
];

const recent: NewsItem[] = [
  {
    displayDate: '2026',
    title: 'Borrador del estándar HQC (Hamming Quasi-Cyclic) en revisión pública',
    source: 'NIST',
    summary:
      'El KEM basado en códigos correctores entra en su fase final de comentarios públicos. Su llegada permitirá desplegar modos híbridos ML-KEM + HQC en sistemas de alta criticidad.',
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    tags: ['HQC', 'Códigos', 'Estándar'],
    palette: 'amber',
    icon: <Sparkles size={18} />,
  },
  {
    displayDate: '2025–2026',
    title: 'CNSA 2.0: la NSA marca el calendario obligatorio para PQC en seguridad nacional',
    source: 'NSA / CNSS',
    summary:
      'La Commercial National Security Algorithm Suite 2.0 establece plazos progresivos para sustituir RSA-2048 y ECDH P-256 por ML-KEM y ML-DSA en sistemas gubernamentales y proveedores asociados.',
    url: 'https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF',
    tags: ['Política', 'NSA', 'Migración'],
    palette: 'rose',
    icon: <Shield size={18} />,
  },
  {
    displayDate: '2024–2025',
    title: 'Chrome activa por defecto el intercambio de claves híbrido X25519+ML-KEM en TLS 1.3',
    source: 'Google Chrome Security',
    summary:
      'Tras una fase experimental con Kyber, Chrome despliega ML-KEM-768 combinado con X25519 en todas las conexiones TLS 1.3 compatibles. Otros navegadores adoptan rápidamente la misma combinación.',
    url: 'https://blog.chromium.org/',
    tags: ['Navegadores', 'TLS', 'Despliegue'],
    palette: 'blue',
    icon: <Globe size={18} />,
  },
  {
    displayDate: '2023–2025',
    title: 'Signal y WhatsApp completan el despliegue de PQXDH en el handshake inicial',
    source: 'Signal Foundation',
    summary:
      'El handshake post-cuántico de Signal pasa de "nuevas conversaciones" a "todas las conversaciones". WhatsApp, basada en el protocolo Signal, sigue la misma ruta a lo largo de 2024-2025.',
    url: 'https://signal.org/docs/specifications/pqxdh/',
    tags: ['Mensajería', 'Signal', 'Industria'],
    palette: 'mint',
    icon: <Lock size={18} />,
  },
];

const NewsCard: React.FC<{
  item: NewsItem;
  variant?: 'hero' | 'featured' | 'compact';
  index?: number;
}> = ({ item, variant = 'compact', index = 0 }) => {
  const hex = paletteHex[item.palette];
  const isHero = variant === 'hero';
  const isFeatured = variant === 'featured';

  const inner = (
    <>
      {/* gradient overlay */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${hex}22, transparent 60%)`,
        }}
      />
      {/* accent stripe */}
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
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <Calendar size={11} />
              <span>{item.displayDate}</span>
              <span className="text-slate-600">·</span>
              <span style={{ color: hex }} className="truncate">
                {item.source}
              </span>
            </div>
          </div>
          {item.url && (
            <ExternalLink
              size={14}
              className="text-slate-500 group-hover:text-current shrink-0 transition-colors"
              style={{ color: hex }}
            />
          )}
        </div>

        <h4
          className={`font-display font-semibold text-slate-100 mb-2 leading-snug ${
            isHero ? 'text-xl md:text-2xl' : isFeatured ? 'text-lg' : 'text-base'
          }`}
        >
          {item.title}
        </h4>
        <p
          className={`text-slate-400 leading-relaxed mb-4 ${
            isHero ? 'text-[15px]' : 'text-sm'
          }`}
        >
          {item.summary}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{
                borderColor: `${hex}40`,
                background: `${hex}0d`,
                color: hex,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const baseClass =
    'group relative block text-left h-full rounded-2xl border bg-quantum-panel/60 backdrop-blur-sm overflow-hidden transition-all cursor-pointer';
  const padding = isHero ? 'p-6 md:p-8' : 'p-5';

  const wrapperStyle = {
    borderColor: '#1f2750',
  } as React.CSSProperties;

  if (item.url) {
    return (
      <motion.a
        href={item.url}
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
  const [heroItem, ...restFeatured] = featured;

  return (
    <div className="space-y-14">
      {/* Featured */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-quantum-amber/15 text-quantum-amber">
            <Star size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl md:text-2xl font-bold text-slate-100">
              Hitos destacados
            </h3>
            <p className="text-xs text-slate-400">
              Los puntos de inflexión que están definiendo la transición post-cuántica.
            </p>
          </div>
          <span className="hidden sm:inline-flex chip text-[10px]">
            {featured.length} noticias
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Hero card spans 2 cols on lg */}
          <div className="lg:row-span-2">
            <NewsCard item={heroItem} variant="hero" index={0} />
          </div>
          {restFeatured.map((item, i) => (
            <NewsCard
              key={item.title}
              item={item}
              variant="featured"
              index={i + 1}
            />
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-quantum-cyan/15 text-quantum-cyan">
            <TrendingUp size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl md:text-2xl font-bold text-slate-100">
              Recientes
            </h3>
            <p className="text-xs text-slate-400">
              Lo último en estándares, despliegues y políticas relacionadas con PQC.
            </p>
          </div>
          <span className="hidden sm:inline-flex chip text-[10px]">
            {recent.length} actualizaciones
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recent.map((item, i) => (
            <NewsCard key={item.title} item={item} variant="compact" index={i} />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500 flex items-center gap-2 pt-4 border-t border-quantum-border/60">
        <Newspaper size={12} />
        Selección curada con fines didácticos. Las fechas reflejan el calendario público
        previsto por los organismos correspondientes; consulta las fuentes para el detalle
        más actualizado.
      </p>
    </div>
  );
};

export default PQCNews;
