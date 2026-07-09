"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProfileBadges } from "@/lib/badges";

/** Save equipped badges. Only earned badges can be equipped. */
export async function toggleBadgeAction(equippedList: string[]) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Only allow equipping earned badges
  const earned = getProfileBadges(profile);
  const valid = equippedList.filter((b) => earned.includes(b));

  const { error } = await supabase
    .from("profiles")
    .update({ equipped_badges: valid })
    .eq("id", user.id);

  if (error) return { error: error.message };

  if (profile.username) revalidatePath(`/${profile.username}`);
  return { success: true };
}
