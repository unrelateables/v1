"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BADGES } from "@/lib/constants";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, id")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");
  return { supabase, admin: createAdminClient(), myId: user.id };
}

export async function banAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  await supabase.from("profiles").update({ banned: true }).eq("id", id);
  revalidatePath("/admin");
}

export async function unbanAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  await supabase.from("profiles").update({ banned: false }).eq("id", id);
  revalidatePath("/admin");
}

export async function resolveFlagAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  await supabase.from("flags").update({ resolved: true }).eq("id", id);
  revalidatePath("/admin");
}

/** Permanently delete a user + all their data. */
export async function deleteProfileAction(formData: FormData) {
  const { supabase, admin, myId } = await requireAdmin();
  const id = String(formData.get("id"));

  if (id === myId) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", id)
    .single();

  await Promise.all([
    supabase.from("links").delete().eq("profile_id", id),
    supabase.from("embeds").delete().eq("profile_id", id),
    supabase.from("views").delete().eq("profile_id", id),
    supabase.from("link_clicks").delete().eq("profile_id", id),
    supabase.from("flags").delete().eq("profile_id", id),
    supabase.from("profile_settings").delete().eq("profile_id", id),
    supabase.from("profiles").delete().eq("id", id),
  ]);

  await admin.auth.admin.deleteUser(id);

  if (profile?.username) revalidatePath(`/${profile.username}`);
  revalidatePath("/admin");
}

/** Promote a user to admin (or demote back to user). */
export async function setRoleAction(formData: FormData) {
  const { supabase, myId } = await requireAdmin();
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));

  if (id === myId) return;

  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin");
}

/** Grant or revoke a badge. */
export async function grantBadgeAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const badgeId = String(formData.get("badge"));

  const validBadge = BADGES.find((b) => b.id === badgeId);
  if (!validBadge) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("badges, equipped_badges")
    .eq("id", id)
    .single();

  if (!profile) return;

  const currentBadges: string[] = Array.isArray(profile.badges)
    ? profile.badges
    : [];

  if (currentBadges.includes(badgeId)) {
    const next = currentBadges.filter((b) => b !== badgeId);
    const equipped: string[] = Array.isArray(profile.equipped_badges)
      ? profile.equipped_badges.filter((b: string) => b !== badgeId)
      : [];
    await supabase
      .from("profiles")
      .update({ badges: next, equipped_badges: equipped })
      .eq("id", id);
  } else {
    const next = [...currentBadges, badgeId];
    const equipped: string[] = Array.isArray(profile.equipped_badges)
      ? [...profile.equipped_badges, badgeId]
      : [badgeId];
    await supabase
      .from("profiles")
      .update({ badges: next, equipped_badges: equipped })
      .eq("id", id);
  }

  revalidatePath("/admin");
}
