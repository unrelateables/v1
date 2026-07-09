"use client";

import { useState } from "react";
import { BADGES, RARITY_INFO } from "@/lib/constants";
import { toggleBadgeAction } from "./actions";

export function BadgesClient({
  earnedBadges,
  equippedBadges,
  counts,
}: {
  earnedBadges: string[];
  equippedBadges: string[];
  counts: Record<string, number>;
}) {
  const [equipped, setEquipped] = useState<string[]>(equippedBadges);
  const [saving, setSaving] = useState(false);

  async function toggle(badgeId: string) {
    setSaving(true);
    const next = equipped.includes(badgeId)
      ? equipped.filter((b) => b !== badgeId)
      : [...equipped, badgeId];
    setEquipped(next);
    await toggleBadgeAction(next);
    setSaving(false);
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {BADGES.map((badge) => {
        const unlocked = earnedBadges.includes(badge.id);
        const isEquipped = equipped.includes(badge.id);
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

            {/* Equipped indicator */}
            {unlocked && isEquipped && (
              <span
                className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                style={{ background: rarity.color, color: "#000" }}
              >
                ✓
              </span>
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

            <span
              className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ color: rarity.color, background: `${rarity.color}15` }}
            >
              {rarity.label}
            </span>

            <h3 className="mt-2 text-sm font-semibold text-white">{badge.label}</h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400">{badge.description}</p>
            <p className="mt-3 text-[10px] text-neutral-600">
              <span style={{ color: rarity.color }}>{count.toLocaleString()}</span> users have this
            </p>

            {/* Equip / Unequip button */}
            {unlocked && (
              <button
                onClick={() => toggle(badge.id)}
                disabled={saving}
                className="mt-4 w-full rounded-full px-3 py-1.5 text-xs font-medium transition"
                style={
                  isEquipped
                    ? { background: `${rarity.color}20`, color: rarity.color, border: `1px solid ${rarity.color}40` }
                    : { background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {saving ? "Saving..." : isEquipped ? "Unequip" : "Equip"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
