import { getBadge } from "@/lib/constants";
import { clsx } from "@/lib/utils";

export function BadgeChips({ badges }: { badges: string[] }) {
  if (!badges.length) return null;

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {badges.map((id) => {
        const def = getBadge(id);
        if (!def) return null;
        return (
          <span
            key={id}
            title={def.label}
            className={clsx(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm"
            )}
            style={{
              borderColor: `${def.color}55`,
              background: `${def.color}1a`,
              color: def.color,
            }}
          >
            <span aria-hidden>{def.emoji}</span>
            {def.label}
          </span>
        );
      })}
    </div>
  );
}
