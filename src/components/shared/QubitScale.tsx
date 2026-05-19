import type { ReactNode } from 'react';

interface QubitScaleProps {
  label?: ReactNode;
  value: number | null;
  onChange: (n: number) => void;
  /** Number of levels (1 qubit, 2 qubits, …, steps qubits). Default 5. */
  steps?: number;
  /** Compact variant (smaller dots / padding). */
  compact?: boolean;
  /** Use emoji instead of qubits. */
  emoji?: string[];
}

/**
 * Scale rendered as rows of qubits.  Level N = N glowing qubits.
 * Each qubit is a cyan→violet gradient sphere with a glow halo when active.
 * If emoji is provided, shows emoji instead of qubits.
 */
const QubitScale: React.FC<QubitScaleProps> = ({
  label,
  value,
  onChange,
  steps = 5,
  compact = false,
  emoji,
}) => {
  const dotSize = compact ? 6 : 8;
  const dotGap = compact ? 2 : 3;
  return (
    <div>
      {label && (
        <p className={`text-quantum-fg ${compact ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
          {label}
        </p>
      )}
      <div className={`flex ${compact ? 'gap-1.5' : 'gap-2'}`}>
        {Array.from({ length: steps }, (_, i) => {
          const level = i + 1;
          const active = value === level;
          const labelTxt = `${level} ${level === 1 ? 'qubit' : 'qubits'}`;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-label={labelTxt}
              title={labelTxt}
              className={`flex-1 flex flex-col items-center justify-end gap-1 rounded-xl border transition-all ${
                compact ? 'py-3 px-2.5' : 'py-4 px-3'
              } ${
                active
                  ? 'border-quantum-cyan bg-quantum-cyan/10 scale-105'
                  : 'border-quantum-border bg-quantum-panel/40 hover:border-quantum-cyan/40'
              }`}
              style={
                active
                  ? { boxShadow: '0 0 18px rgb(94 234 212 / 0.35)' }
                  : undefined
              }
            >
              <div
                className="flex items-center justify-center flex-wrap"
                style={{
                  gap: dotGap,
                  minHeight: emoji ? (compact ? 24 : 32) : dotSize + (compact ? 4 : 6),
                  maxWidth: compact ? 60 : 80,
                }}
              >
                {emoji ? (
                  <span style={{ fontSize: compact ? '20px' : '28px' }}>
                    {emoji[Math.min(level - 1, emoji.length - 1)]}
                  </span>
                ) : (
                  Array.from({ length: level }, (_, j) => (
                    <span
                      key={j}
                      className="block rounded-full"
                      style={{
                        width: dotSize,
                        height: dotSize,
                        background:
                          'radial-gradient(circle at 30% 30%, #5eead4 0%, #a78bfa 80%)',
                        boxShadow: active
                          ? '0 0 6px rgb(94 234 212 / 0.8), 0 0 2px rgb(167 139 250 / 0.6)'
                          : '0 0 3px rgb(94 234 212 / 0.35)',
                        opacity: active ? 1 : 0.85,
                      }}
                    />
                  ))
                )}
              </div>
              {!emoji && (
                <span
                  className={`font-mono ${compact ? 'text-[9px]' : 'text-[10px]'} ${
                    active ? 'text-quantum-cyan' : 'text-quantum-fg-mute'
                  }`}
                >
                  {level}q
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QubitScale;
