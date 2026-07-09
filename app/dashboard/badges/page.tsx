import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BADGES, RARITY_INFO } from "@/lib/constants";
import { getProfileBadges, getBadgeCounts } from "@/lib/badges";
import type { BadgeCount } from "@/lib/badges";

export default async function BadgesPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  const myBadges = getProfileBadges(profile);
  const counts = await getBadgeCounts();

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs text-neutral-600">{"// badges"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Badges</h1>
      <p className="mt-1 text-sm text-neutral-500">
        You have {myBadges.length} of {BADGES.length} badges.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {BADGES.map((badge) => {
          const unlocked = myBadges.includes(badge.id);
          const rarity = RARITY_INFO[badge.rarity];
          const count = counts[badge.id] ?? 0;

          return (
            <div
              key={badge.id}
              className="relative overflow-hidden rounded-2xl border p-5 transition"
              style={{
                borderColor: unlocked ? rarity.color + "55" : "rgba(255,255,255,0.06)",
                background: unlocked
                  ? `linear-gradient(135deg, ${rarity.color}10, transparent)`
                  : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Locked overlay */}
              {!unlocked && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-center">
                    <svg viewBox="0 0 24 24" className="mx-auto h-6 w-6 fill-current text-neutral-500">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-500">
                      Locked
                    </p>
                  </div>
                </div>
              )}

              {/* Badge icon */}
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: `${rarity.color}15`,
                  border: `1.5px solid ${rarity.color}50`,
                  boxShadow: unlocked ? `0 0 12px -2px ${rarity.color}40` : "none",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 fill-current"
                  style={{ color: unlocked ? rarity.color : "#525252" }}
                >
                  <path d={badge.icon} />
                </svg>
              </div>

              {/* Rarity tag */}
              <span
                className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{
                  color: rarity.color,
                  background: `${rarity.color}15`,
                }}
              >
                {rarity.label}
              </span>

              {/* Name */}
              <h3 className="mt-2 text-sm font-semibold text-white">
                {badge.label}
              </h3>

              {/* Description */}
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                {badge.description}
              </p>

              {/* Count */}
              <p className="mt-3 text-[10px] text-neutral-600">
                <span style={{ color: rarity.color }}>{count.toLocaleString()}</span> users have this
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
