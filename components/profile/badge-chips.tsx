import { getBadge, RARITY_INFO } from "@/lib/constants";
import type { BadgeDef, Rarity } from "@/lib/constants";

export function BadgeChips({ badges }: { badges: string[] }) {
  if (!badges.length) return null;

  return (
    <div className="mt-2 flex items-center justify-center gap-1.5">
      {badges.map((id) => {
        const def = getBadge(id);
        if (!def) return null;
        return <BadgeIcon key={id} def={def} />;
      })}
    </div>
  );
}

/* guns.lol-style: small icon badges with ore-style rarity border + glow */
function BadgeIcon({ def }: { def: BadgeDef }) {
  const rarity = RARITY_INFO[def.rarity as Rarity];

  return (
    <div className="group relative">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-150 hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${rarity.color}22, ${rarity.color}0a)`,
          border: `1.5px solid ${rarity.color}80`,
          boxShadow: `0 0 8px -1px ${rarity.color}55, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" style={{ color: rarity.color }}>
          <path d={def.icon} />
        </svg>
        {/* rarity dot */}
        <span
          className="absolute -right-0.5 -bottom-0.5 h-1.5 w-1.5 rounded-full"
          style={{ background: rarity.border, boxShadow: `0 0 4px ${rarity.border}` }}
        />
      </div>

      {/* Tooltip with rarity, description, and count */}
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 w-max max-w-[200px] translate-y-0.5 rounded-lg bg-black/95 p-2.5 text-center opacity-0 shadow-xl ring-1 ring-white/10 backdrop-blur transition-all duration-100 group-hover:translate-y-0 group-hover:opacity-100">
        {/* rarity label */}
        <span
          className="block text-[9px] font-bold uppercase tracking-wider"
          style={{ color: rarity.border }}
        >
          {def.rarity}
        </span>
        {/* badge name */}
        <span className="mt-0.5 block text-[11px] font-semibold text-white">
          {def.label}
        </span>
        {/* description */}
        {def.description && (
          <span className="mt-1 block text-[9px] leading-relaxed text-neutral-400">
            {def.description}
          </span>
        )}
        {/* rarity count */}
        <span className="mt-1.5 block text-[9px] text-neutral-600">
          <span style={{ color: rarity.color }}>{def.count.toLocaleString()}</span>
          {" "}in existence
        </span>
      </span>
    </div>
  );
}
