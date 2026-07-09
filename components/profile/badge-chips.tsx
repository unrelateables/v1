import { getBadge, RARITY_INFO } from "@/lib/constants";
import type { BadgeDef, Rarity } from "@/lib/constants";

export function BadgeChips({
  badges,
  counts,
}: {
  badges: string[];
  counts?: Record<string, number>;
}) {
  if (!badges.length) return null;

  return (
    <div className="mt-1.5 flex items-center justify-center gap-1">
      {badges.map((id) => {
        const def = getBadge(id);
        if (!def) return null;
        return <BadgeIcon key={id} def={def} count={counts?.[id]} />;
      })}
    </div>
  );
}

function BadgeIcon({
  def,
  count,
}: {
  def: BadgeDef;
  count?: number;
}) {
  const rarity = RARITY_INFO[def.rarity as Rarity];

  return (
    <div className="group relative">
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-150 hover:scale-110"
        style={{
          background: "rgba(0,0,0,0.4)",
          border: `1px solid ${rarity.color}66`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 fill-current"
          style={{ color: rarity.color }}
        >
          <path d={def.icon} />
        </svg>
      </div>

      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-black/95 px-2 py-1.5 text-center opacity-0 shadow-xl ring-1 ring-white/10 backdrop-blur transition-all duration-100 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="block text-[9px] font-bold uppercase tracking-wider" style={{ color: rarity.color }}>
          {rarity.label}
        </span>
        <span className="mt-0.5 block text-[10px] font-medium text-white">{def.label}</span>
        {count !== undefined && (
          <span className="mt-0.5 block text-[9px] text-neutral-500">
            {count.toLocaleString()} owned
          </span>
        )}
      </span>
    </div>
  );
}
