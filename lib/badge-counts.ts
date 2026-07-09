import { createAdminClient } from "@/lib/supabase/admin";

export type BadgeCounts = Record<string, number>;

/**
 * Query the database for how many users actually have each badge.
 * Returns a map of badgeId -> count.
 */
export async function getBadgeCounts(): Promise<BadgeCounts> {
  try {
    const admin = createAdminClient();

    const { data: profiles } = await admin
      .from("profiles")
      .select("id, role, created_at");

    if (!profiles) return { owner: 1, staff: 0, early: 0 };

    const now = new Date();
    const cutoff = new Date("2026-12-31");
    const isEarlyWindow = now <= cutoff;

    let owner = 0;
    let staff = 0;
    let early = 0;

    const ownerId = process.env.OWNER_USER_ID;

    for (const p of profiles) {
      // Owner: exact match on OWNER_USER_ID, or first admin created
      const isOwner = ownerId ? p.id === ownerId : p.role === "admin";
      if (isOwner) {
        owner++;
        staff++;
      }

      // Staff: any admin (including owner)
      if (p.role === "admin" && !isOwner) {
        staff++;
      }

      // Early: signed up during the early window
      if (isEarlyWindow && p.created_at) {
        early++;
      }
    }

    // Ensure owner is at least 1 if OWNER_USER_ID is set but not in results
    if (ownerId && owner === 0) owner = 1;

    return { owner, staff, early };
  } catch {
    return { owner: 1, staff: 1, early: 0 };
  }
}
