export default function NeonHabitLogo({ size = 110 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 14px rgba(139,92,246,0.7)) drop-shadow(0 0 28px rgba(139,92,246,0.35))" }}
    >
      <defs>
        <linearGradient id="calBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="barGrad2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Calendar body */}
      <rect x="12" y="22" width="72" height="62" rx="9" ry="9" fill="url(#calBody)" />
      <rect x="12" y="22" width="72" height="62" rx="9" ry="9" fill="none" stroke="rgba(109,40,217,0.3)" strokeWidth="1.5" />

      {/* Calendar header bar */}
      <rect x="12" y="22" width="72" height="18" rx="9" ry="9" fill="rgba(109,40,217,0.15)" />
      <rect x="12" y="31" width="72" height="9" fill="rgba(109,40,217,0.15)" />

      {/* Binding rings */}
      {[24, 36, 48, 60, 72].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y="14" width="8" height="14" rx="4" fill="#7c3aed" opacity="0.9" />
          <rect x={x - 3} y="16" width="6" height="10" rx="3" fill="#a78bfa" opacity="0.6" />
        </g>
      ))}

      {/* Cute face */}
      <circle cx="30" cy="53" r="2.5" fill="#7c3aed" opacity="0.8" />
      <circle cx="28" cy="63" r="2" fill="#a78bfa" opacity="0.5" />
      {/* Smile */}
      <path d="M 24 59 Q 29 65 34 59" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Cheek dot */}
      <circle cx="36" cy="61" r="3" fill="rgba(236,72,153,0.3)" />

      {/* Progress bars */}
      <rect x="46" y="68" width="9" height="14" rx="2" fill="url(#barGrad)" opacity="0.9" />
      <rect x="58" y="58" width="9" height="24" rx="2" fill="url(#barGrad2)" opacity="0.95" />
      <rect x="70" y="50" width="9" height="32" rx="2" fill="url(#barGrad)" />

      {/* Upward arrow (swoosh) */}
      <path
        d="M 42 80 C 52 75, 65 60, 82 44"
        stroke="url(#arrowGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />
      <polygon
        points="82,44 76,48 80,54"
        fill="#c084fc"
        filter="url(#glow)"
      />

      {/* 4-point sparkle stars */}
      <g filter="url(#glow)">
        {/* Top-right big sparkle */}
        <path d="M 90 20 L 92 14 L 94 20 L 100 22 L 94 24 L 92 30 L 90 24 L 84 22 Z" fill="#e9d5ff" opacity="0.95" />
        {/* Small top sparkle */}
        <path d="M 76 10 L 77.2 7 L 78.4 10 L 81.4 11.2 L 78.4 12.4 L 77.2 15.4 L 76 12.4 L 73 11.2 Z" fill="#c4b5fd" opacity="0.8" />
        {/* Tiny star */}
        <path d="M 100 38 L 101 36 L 102 38 L 104 39 L 102 40 L 101 42 L 100 40 L 98 39 Z" fill="#f5d0fe" opacity="0.7" />
      </g>
    </svg>
  );
}
