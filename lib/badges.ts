import { BADGES } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export interface BadgeCount {
  owner: number;
  staff: number;
  early: number;
  [key: string]: number;
}

export interface BadgeCheck {
  id: string;
  unlocked: boolean;
}

export function getProfileBadges(profile: {
  id: string;
  role: string;
  created_at?: string;
}): string[] {
  const badges: string[] = [];

  // Owner — exactly one account
  const ownerId = process.env.OWNER_USER_ID;
  const isOwner = ownerId ? profile.id === ownerId : profile.role === "admin";
  if (isOwner) badges.push("owner");

  // Staff — any admin
  if (profile.role === "admin") badges.push("staff");

  // Early Supporter — signed up in 2026 (first wave)
  const created = profile.created_at || "";
  if (created && new Date(created).getFullYear() <= 2026) {
    badges.push("early");
  }

  return badges;
}

/**
 * Queries the database for accurate badge counts.
 * Called server-side only.
 */
export async function getBadgeCounts(): Promise<Record<string, number>> {
  const admin = createAdminClient();

  const [{ count: ownerCount }, { count: adminCount }, { count: earlyCount }] =
    await Promise.all([
      // Owner: just 1
      Promise.resolve({ count: 1 }),
      // Staff: count admins
      admin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin"),
      // Early: created in 2026
      admin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", "2026-01-01T00:00:00Z")
        .lte("created_at", "2026-12-31T23:59:59Z"),
    ]);

  return {
    owner: 1,
    staff: adminCount ?? 0,
    early: earlyCount ?? 0,
  };
}

/** Check which badges a user has unlocked (for the dashboard view). */
export async function getUserBadges(profile: {
  id: string;
  role: string;
  created_at?: string;
}): Promise<{ badge: string; unlocked: boolean }[]> {
  const earned = new Set(getProfileBadges(profile));
  return BADGES.map((b) => ({
    badge: b.id,
    unlocked: earned.has(b.id),
  }));
}
