type MonogramProps = {
  size?: number;
  className?: string;
};

export function Monogram({ size = 28, className }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      role="img"
      aria-label="Sachin monogram"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="mono-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#d8d8dc" />
          <stop offset="1" stopColor="#8d8d96" />
        </linearGradient>
        <radialGradient id="mono-glow" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="rgba(129,140,248,0.45)" />
          <stop offset="1" stopColor="rgba(129,140,248,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="128" height="128" rx="26" fill="#0a0a0d" />
      <rect x="0" y="0" width="128" height="128" rx="26" fill="url(#mono-glow)" />
      <rect
        x="1"
        y="1"
        width="126"
        height="126"
        rx="25"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
      />
      <text
        x="64"
        y="86"
        textAnchor="middle"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="64"
        fontWeight={700}
        letterSpacing="-2"
        fill="url(#mono-grad)"
      >
        SA
      </text>
    </svg>
  );
}