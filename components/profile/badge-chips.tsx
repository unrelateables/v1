import { getBadge } from "@/lib/constants";
import type { BadgeDef } from "@/lib/constants";

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

/* guns.lol-style: small circular icon badges with colored ring + glow */
function BadgeIcon({ def }: { def: BadgeDef }) {
  return (
    <div className="group relative">
      <div
        title={def.label}
        className="flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
        style={{
          background: `${def.color}1a`,
          border: `1.5px solid ${def.color}80`,
          boxShadow: `0 0 6px -1px ${def.color}60`,
        }}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" style={{ color: def.color }}>
          <path d={def.icon} />
        </svg>
      </div>
      {/* Tooltip */}
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 translate-y-0.5 whitespace-nowrap rounded-md bg-black/90 px-2 py-0.5 text-[9px] font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-100 group-hover:translate-y-0 group-hover:opacity-100">
        {def.label}
      </span>
    </div>
  );
}
