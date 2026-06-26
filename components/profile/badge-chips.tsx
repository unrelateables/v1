import { getBadge } from "@/lib/constants";
import { clsx } from "@/lib/utils";
import type { BadgeDef } from "@/lib/constants";

export function BadgeChips({ badges }: { badges: string[] }) {
  if (!badges.length) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {badges.map((id) => {
        const def = getBadge(id);
        if (!def) return null;
        return <BadgeTile key={id} def={def} />;
      })}
    </div>
  );
}

function BadgeTile({ def }: { def: BadgeDef }) {
  return (
    <div className="group relative">
      <div
        title={def.label}
        className={clsx(
          "relative flex h-9 w-9 items-center justify-center rounded-xl text-base transition-transform duration-200 hover:scale-110 hover:-translate-y-0.5",
          def.rare && "holo-ring badge-float"
        )}
        style={{
          background: `linear-gradient(135deg, ${def.gradient[0]}, ${def.gradient[1]})`,
          boxShadow: `0 4px 12px -2px ${def.color}77, inset 0 1px 0 rgba(255,255,255,0.4)`,
        }}
      >
        <span
          className="badge-shine flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
          aria-hidden
        >
          {def.emoji}
        </span>
        {def.rare && (
          <span
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            title="Rare"
          />
        )}
      </div>

      {/* Label tooltip on hover */}
      <span
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-black/90 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100"
        style={{ color: def.color }}
      >
        {def.label}
      </span>
    </div>
  );
}
