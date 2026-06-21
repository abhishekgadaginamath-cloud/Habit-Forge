export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7f77dd" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7f77dd" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shieldGrad" x1="24" y1="6" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3d3878" />
          <stop offset="100%" stopColor="#1e1c3a" />
        </linearGradient>
        <linearGradient id="swordGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#d4d0f5" />
          <stop offset="100%" stopColor="#9b96d4" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="24" y1="14" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="60%" stopColor="#ef9f27" />
          <stop offset="100%" stopColor="#dc6803" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="24" cy="24" r="22" fill="url(#logoGlow)" />

      <path
        d="M24 5L34 13V29C34 35.627 24 43 24 43C24 43 14 35.627 14 29V13L24 5Z"
        fill="url(#shieldGrad)"
        stroke="#4a4580"
        strokeWidth="0.75"
      />

      <path
        d="M24 9L31 15V28.5C31 33.5 24 39.5 24 39.5C24 39.5 17 33.5 17 28.5V15L24 9Z"
        fill="#13121f"
        opacity="0.6"
      />

      <g filter="url(#glow)">
        <path
          d="M24 14 C22 18 20 20 20 23 C20 27 22 29 24 30 C26 29 28 27 28 23 C28 20 26 18 24 14Z"
          fill="url(#flameGrad)"
          opacity="0.95"
        />
        <path
          d="M24 18 C23 20 22 21.5 22 23 C22 25.2 23 26.5 24 27 C25 26.5 26 25.2 26 23 C26 21.5 25 20 24 18Z"
          fill="#fde68a"
          opacity="0.8"
        />
      </g>

      <line
        x1="24" y1="24" x2="24" y2="38"
        stroke="url(#swordGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="19.5" y="24.5" width="9" height="2"
        rx="1"
        fill="#c4bfed"
      />
      <rect
        x="23" y="35.5" width="2" height="3.5"
        rx="1"
        fill="#9b96d4"
      />

      <path
        d="M24 5L34 13V29C34 35.627 24 43 24 43C24 43 14 35.627 14 29V13L24 5Z"
        stroke="#7f77dd"
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
