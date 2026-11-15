/**
 * Neutral original Maryam avatar placeholder drawn for ETM.
 *
 * The `mood` API is preserved so the theme reactions keep working:
 * cozy -> sleepy, terminal -> thinking. Replace this illustration when the
 * final designer art arrives.
 */
export default function MaryamAvatar({
  size = 48,
  className = "",
  mood = "default",
}: {
  size?: number;
  className?: string;
  mood?: "default" | "sleepy" | "thinking";
}) {
  const thinking = mood === "thinking";
  const sleepy = mood === "sleepy";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Maryam"
    >
      <defs>
        <linearGradient id="maryam-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a1424" />
          <stop offset="1" stopColor="#241a3d" />
        </linearGradient>
        <linearGradient id="maryam-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="maryam-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2b5a" />
          <stop offset="1" stopColor="#1d1530" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="60" fill="url(#maryam-bg)" />
      <circle
        cx="60"
        cy="60"
        r="57"
        fill="none"
        stroke="url(#maryam-ring)"
        strokeOpacity="0.55"
        strokeWidth="2"
      />

      {/* shoulders */}
      <path
        d="M22 120 C 24 94, 40 84, 60 84 C 80 84, 96 94, 98 120 Z"
        fill="#151b33"
      />
      <path
        d="M48 86 L 60 98 L 72 86"
        fill="none"
        stroke="#22d3ee"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* short hair shape */}
      <path
        d="M32 65 C 28 38, 42 24, 60 24 C 78 24, 92 38, 88 65 C 86 52, 82 45, 76 41 C 71 37, 49 37, 44 41 C 38 45, 34 52, 32 65 Z"
        fill="url(#maryam-hair)"
      />

      {/* face */}
      <circle cx="60" cy="62" r="27" fill="#f3c9a8" />

      {/* fringe / side hair */}
      <path
        d="M33 60 C 33 38, 45 29, 60 29 C 75 29, 87 38, 87 60 C 82 50, 75 46, 68 46 C 62 46, 58 49, 54 46 C 47 46, 39 50, 33 60 Z"
        fill="url(#maryam-hair)"
      />
      <path
        d="M33 58 C 29 68, 30 78, 34 84 C 37 76, 38 68, 38 61 Z"
        fill="url(#maryam-hair)"
      />
      <path
        d="M87 58 C 91 68, 90 78, 86 84 C 83 76, 82 68, 82 61 Z"
        fill="url(#maryam-hair)"
      />

      {/* eyes */}
      {sleepy ? (
        <>
          <path
            d="M45 64 Q50 68 55 64"
            stroke="#2b2140"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M65 64 Q70 68 75 64"
            stroke="#2b2140"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse cx="50" cy={thinking ? 61 : 64} rx="4.6" ry="6.8" fill="#2b2140" />
          <ellipse cx="70" cy={thinking ? 61 : 64} rx="4.6" ry="6.8" fill="#2b2140" />
          <circle cx="48.4" cy={thinking ? 58.4 : 61.4} r="1.8" fill="#ffffff" />
          <circle cx="68.4" cy={thinking ? 58.4 : 61.4} r="1.8" fill="#ffffff" />
          <circle cx="51.6" cy={thinking ? 63.4 : 66.4} r="1" fill="#c4b5fd" />
          <circle cx="71.6" cy={thinking ? 63.4 : 66.4} r="1" fill="#c4b5fd" />
        </>
      )}

      {/* brows */}
      <path
        d="M44 54 Q50 51 56 54"
        stroke="#2b2140"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M64 54 Q70 51 76 54"
        stroke="#2b2140"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* blush */}
      <ellipse cx="43" cy="72" rx="4.5" ry="2.6" fill="#e8a0a8" opacity="0.6" />
      <ellipse cx="77" cy="72" rx="4.5" ry="2.6" fill="#e8a0a8" opacity="0.6" />

      {/* mouth */}
      <path
        d="M55 75 Q60 80 65 75"
        stroke="#9d4f63"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* small AI spark, replacing the old vocaloid accessories */}
      <path
        d="M96 24 L 98 30 L 104 32 L 98 34 L 96 40 L 94 34 L 88 32 L 94 30 Z"
        fill="#a78bfa"
        opacity="0.9"
      />
    </svg>
  );
}
