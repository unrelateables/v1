import { BADGES } from "@/lib/constants";
import type { ProfilePage } from "@/lib/types";

// Users who signed up before this date are "Early Adopters".
export const EARLY_ADOPTER_CUTOFF = new Date("2026-12-31T00:00:00Z").getTime();

/**
 * Badges earned automatically from profile state. These are never
 * user-selectable and are merged with the user's chosen badges.
 */
export function computeAutoBadges(
  page: ProfilePage,
  viewCount = 0
): string[] {
  const earned: string[] = [];

  if (new Date(page.profile.created_at).getTime() <= EARLY_ADOPTER_CUTOFF) {
    earned.push("early");
  }
  if (page.settings.audio_url) {
    earned.push("music");
  }
  if (viewCount >= 100) {
    earned.push("100views");
  }

  return earned;
}

/** Merge user-selected + auto badges, deduped, preserving definition order. */
export function resolveBadges(
  selected: string[] | null | undefined,
  auto: string[]
): string[] {
  const set = new Set([...(selected ?? []), ...auto]);
  return BADGES.filter((b) => set.has(b.id)).map((b) => b.id);
}
