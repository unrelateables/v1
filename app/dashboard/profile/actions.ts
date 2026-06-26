"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isReservedUsername,
  USERNAME_REGEX,
  SELECTABLE_BADGES,
} from "@/lib/constants";

export type FormState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName = String(formData.get("display_name") || "").trim().slice(0, 48);
  const bio = String(formData.get("bio") || "").trim().slice(0, 280);
  const username = String(formData.get("username") || "").trim();
  const avatarUrl = String(formData.get("avatar_url") || "").trim() || null;

  // collect selected badges (only allow user-selectable ones)
  const selectedBadges = formData.getAll("badges").map(String);
  const validBadges = selectedBadges.filter((b) =>
    SELECTABLE_BADGES.some((def) => def.id === b)
  );

  if (!username || username.length < 3 || username.length > 24 || !USERNAME_REGEX.test(username)) {
    return { error: "Username must be 3-24 chars: letters, numbers, underscore." };
  }
  if (isReservedUsername(username)) {
    return { error: "That username is reserved." };
  }

  // ensure username is unique (excluding current user)
  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle();
  if (taken) return { error: "That username is already taken." };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
      username,
      avatar_url: avatarUrl,
      badges: validBadges,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/profile`);
  revalidatePath(`/${username}`);
  return { success: true };
}
