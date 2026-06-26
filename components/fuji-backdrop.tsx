/**
 * A very subtle Mount Fuji scene at the bottom of the landing.
 * Low-opacity silhouette + warm horizon glow + faint snow cap.
 * Reads as atmosphere, not an illustration.
 */
export function FujiBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55vh] overflow-hidden"
      aria-hidden
    >
      {/* faint rising-sun glow behind the peak */}
      <div
        className="absolute left-1/2 bottom-[28%] h-40 w-40 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(251,113,133,0.18) 0%, rgba(251,146,60,0.08) 50%, transparent 70%)",
        }}
      />

      {/* warm sunset horizon wash */}
      <div
        className="absolute inset-x-0 bottom-0 h-full"
        style={{
          background:
            "linear-gradient(to top, rgba(244,114,182,0.06) 0%, rgba(251,146,60,0.04) 30%, transparent 65%)",
        }}
      />

      {/* Mount Fuji cone — centered, faint */}
      <svg
        className="absolute inset-x-0 bottom-[6%] mx-auto h-[48%] w-[70%] max-w-2xl"
        viewBox="0 0 1000 420"
        preserveAspectRatio="xMidYMax meet"
        fill="currentColor"
      >
        {/* main body */}
        <path
          className="text-neutral-800/55"
          d="M0 420 L415 420 L492 44 Q500 34 508 44 L585 420 Z"
        />
        {/* snow cap */}
        <path
          className="text-white/[0.06]"
          d="M455 150 L492 44 Q500 34 508 44 L545 150 Q530 158 515 152 L500 162 L485 152 Q470 158 455 150 Z"
        />
        {/* snow streaks */}
        <path
          className="text-white/[0.04]"
          d="M470 175 L478 320 M520 175 L512 320 M495 165 L495 340"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* distant low ridges in front (darkest) */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[22%] w-full text-neutral-900/80"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 160 L0 110 Q140 78 280 96 T560 88 Q700 66 860 94 T1160 84 Q1300 62 1440 100 L1440 160 Z" />
      </svg>
    </div>
  );
}
