export default function MikuAvatar({
  size = 48,
  className = "",
  mood = "default",
}: {
  size?: number;
  className?: string;
  mood?: "default" | "sleepy" | "thinking";
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Miku"
    >
      <defs>
        <linearGradient id="miku-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a1424" />
          <stop offset="1" stopColor="#1b1038" />
        </linearGradient>
        <linearGradient id="miku-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4ff0e8" />
          <stop offset="1" stopColor="#12a3b8" />
        </linearGradient>
        <linearGradient id="miku-hair-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2bc8c2" />
          <stop offset="1" stopColor="#0d7f95" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="60" fill="url(#miku-bg)" />
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="none"
        stroke="#22d3ee"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* twin tails */}
      <path
        d="M22 44 C 2 58, 6 96, 20 116 C 30 102, 32 72, 34 50 Z"
        fill="url(#miku-hair-dark)"
      />
      <path
        d="M98 44 C 118 58, 114 96, 100 116 C 90 102, 88 72, 86 50 Z"
        fill="url(#miku-hair-dark)"
      />
      {/* hair ties */}
      <rect x="26" y="40" width="12" height="8" rx="4" fill="#a78bfa" />
      <rect x="82" y="40" width="12" height="8" rx="4" fill="#a78bfa" />

      {/* face */}
      <circle cx="60" cy="64" r="29" fill="#ffe4d1" />

      {/* bangs */}
      <path
        d="M31 62 C 29 38, 43 26, 60 26 C 77 26, 91 38, 89 62 C 84 48, 76 43, 70 45 C 67 39, 53 39, 50 45 C 44 43, 36 48, 31 62 Z"
        fill="url(#miku-hair)"
      />

      {/* headphones */}
      <path
        d="M28 56 C 28 30, 92 30, 92 56"
        stroke="#232733"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="20" y="50" width="14" height="26" rx="7" fill="#232733" />
      <rect x="86" y="50" width="14" height="26" rx="7" fill="#232733" />
      <rect x="23" y="55" width="8" height="16" rx="4" fill="#4ff0e8" />
      <rect x="89" y="55" width="8" height="16" rx="4" fill="#4ff0e8" />

      {/* eyes: closed while sleepy (cozy), lifted while thinking (terminal) */}
      {mood === "sleepy" ? (
        <>
          <path d="M44 66 Q49 70 54 66" stroke="#0e7490" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M66 66 Q71 70 76 66" stroke="#0e7490" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="49" cy={mood === "thinking" ? 63 : 66} rx="5" ry="7.5" fill="#0e7490" />
          <ellipse cx="71" cy={mood === "thinking" ? 63 : 66} rx="5" ry="7.5" fill="#0e7490" />
          <circle cx="47" cy={mood === "thinking" ? 60 : 63} r="2.2" fill="#ffffff" />
          <circle cx="69" cy={mood === "thinking" ? 60 : 63} r="2.2" fill="#ffffff" />
          <circle cx="50.5" cy={mood === "thinking" ? 65 : 68} r="1.2" fill="#a5f3fc" />
          <circle cx="72.5" cy={mood === "thinking" ? 65 : 68} r="1.2" fill="#a5f3fc" />
        </>
      )}

      {/* brows */}
      <path d="M43 56 Q49 54 55 56" stroke="#0d7f95" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M65 56 Q71 54 77 56" stroke="#0d7f95" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* blush */}
      <ellipse cx="42" cy="74" rx="5" ry="3" fill="#ffb3c1" opacity="0.75" />
      <ellipse cx="78" cy="74" rx="5" ry="3" fill="#ffb3c1" opacity="0.75" />

      {/* mouth */}
      <path
        d="M55 77 Q60 82 65 77"
        stroke="#c2607a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
