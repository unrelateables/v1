import { getBadge } from "@/lib/constants";
import type { BadgeDef } from "@/lib/constants";

export function BadgeChips({ badges }: { badges: string[] }) {
  if (!badges.length) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
      {badges.map((id) => {
        const def = getBadge(id);
        if (!def) return null;
        return <BadgePill key={id} def={def} />;
      })}
    </div>
  );
}

function BadgePill({ def }: { def: BadgeDef }) {
  return (
    <span
      title={def.label}
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-transform duration-150 hover:scale-105"
      style={{
        color: def.color,
        background: `${def.color}14`,
        border: `1px solid ${def.color}40`,
        boxShadow: `0 0 8px -2px ${def.color}50`,
      }}
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
        {def.id === "owner" && <path d="M5 16L3 8l5.5 4L12 5l3.5 7L21 8l-2 8H5z" />}
        {def.id === "verified" && <path d="M9 12l2 2 4-4M12 2l2.5 2.5L18 4l-.5 3.5L20 9l-2.5 2.5L18 15l-3.5-.5L12 22l-2.5-7.5L6 15l.5-3.5L4 9l2.5-2.5L6 3l3.5.5L12 1z" />}
        {def.id === "early" && <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />}
      </svg>
      {def.label}
    </span>
  );
}
