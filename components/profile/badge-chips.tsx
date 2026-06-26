import { getBadge } from "@/lib/constants";
import { clsx } from "@/lib/utils";
import type { BadgeDef } from "@/lib/constants";

export function BadgeChips({ badges }: { badges: string[] }) {
  if (!badges.length) return null;

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {badges.map((id) => {
        const def = getBadge(id);
        if (!def) return null;
        return <Badge key={id} def={def} />;
      })}
    </div>
  );
}

function Badge({ def }: { def: BadgeDef }) {
  return (
    <span
      title={def.label}
      className={clsx(
        "group relative inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-xs font-semibold tracking-wide backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5",
        def.rare && "badge-glow"
      )}
      style={{
        background: `linear-gradient(135deg, ${def.gradient[0]}, ${def.gradient[1]})`,
        boxShadow: `0 4px 14px -2px ${def.color}66, inset 0 1px 0 rgba(255,255,255,0.35)`,
        border: `1px solid ${def.color}`,
      }}
    >
      <span
        className="badge-shine inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] leading-none"
        style={{
          background: "rgba(0,0,0,0.28)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
        }}
      >
        <span aria-hidden>{def.emoji}</span>
      </span>
      <span className="relative z-10 text-white drop-shadow-sm">{def.label}</span>
      {def.rare && (
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white shadow"
          title="Rare"
        />
      )}
    </span>
  );
}
