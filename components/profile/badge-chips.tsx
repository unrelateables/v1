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
      {/* guns.lol style: solid colored rounded-square tile with white icon */}
      <div
        className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] transition-transform duration-150 hover:scale-115"
        style={{
          background: rarity.color,
          boxShadow: `0 2px 8px -2px ${rarity.color}88`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          style={{ fill: "#fff" }}
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
