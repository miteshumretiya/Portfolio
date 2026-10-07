// Logo mark (a network node) and the "bloom" avatar.

export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g stroke="var(--color-lime)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 16V5M16 16l9.5 5.5M16 16l-9.5 5.5" />
      </g>
      <g fill="var(--color-lime)">
        <circle cx="16" cy="16" r="3.2" />
        <circle cx="16" cy="4.5" r="2.2" />
        <circle cx="26" cy="22" r="2.2" />
        <circle cx="6" cy="22" r="2.2" />
      </g>
      <g fill="currentColor">
        <circle cx="26" cy="10" r="1.5" />
        <circle cx="6" cy="10" r="1.5" />
        <circle cx="16" cy="27.5" r="1.5" />
      </g>
    </svg>
  );
}

const PETALS = 12;

export function Bloom({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Mitesh Umretiya monogram"
      className={className}
    >
      <defs>
        <radialGradient id="petal" cx="50%" cy="85%" r="90%">
          <stop offset="0" stopColor="#ff8a5c" />
          <stop offset="0.6" stopColor="#ff5a36" />
          <stop offset="1" stopColor="#d23a1a" />
        </radialGradient>
      </defs>
      <g className="bloom-petals" style={{ transformOrigin: "60px 60px" }}>
        {Array.from({ length: PETALS }, (_, i) => (
          <ellipse
            key={i}
            cx="60"
            cy="27"
            rx="12.5"
            ry="25"
            fill="url(#petal)"
            transform={`rotate(${(360 / PETALS) * i} 60 60)`}
          />
        ))}
      </g>
      <circle cx="60" cy="60" r="27" fill="#0f1a12" />
      <circle cx="60" cy="60" r="27" fill="none" stroke="rgb(255 255 255 / .12)" />
      <text
        x="60"
        y="69"
        textAnchor="middle"
        fill="#eef3ea"
        style={{ font: "italic 30px var(--font-serif)" }}
      >
        MU
      </text>
    </svg>
  );
}
