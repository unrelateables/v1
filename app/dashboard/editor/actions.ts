"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProfileSettings } from "@/lib/types";

/** Save settings from the live editor (receives the full settings object). */
export async function saveEditorAction(settings: ProfileSettings) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const {
    // exclude these (not table columns or computed)
    profile_id,
    updated_at,
    ...payload
  } = settings;

  // Try full update with all columns (including new design columns)
  const { error } = await supabase
    .from("profile_settings")
    .update(payload)
    .eq("profile_id", user.id);

  if (error) {
    // Fallback: only original columns (in case new columns don't exist yet)
    const basic: Record<string, unknown> = {
      bg_type: payload.bg_type,
      bg_value: payload.bg_value,
      accent_color: payload.accent_color,
      text_color: payload.text_color,
      audio_url: payload.audio_url,
      audio_autoplay: payload.audio_autoplay,
      glassmorphism: payload.glassmorphism,
      typing_effect: payload.typing_effect,
      is_public: payload.is_public,
      effects: payload.effects,
    };
    const { error: err2 } = await supabase
      .from("profile_settings")
      .update(basic)
      .eq("profile_id", user.id);
    if (err2) return { error: err2.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  if (profile?.username) revalidatePath(`/${profile.username}`);
  return { success: true };
}

export async function applyTemplateAction(templateId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { getTemplate } = await import("@/lib/templates");
  const tmpl = getTemplate(templateId);
  if (!tmpl) return { error: "Unknown template" };

  const { error } = await supabase
    .from("profile_settings")
    .update(tmpl)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  if (profile?.username) revalidatePath(`/${profile.username}`);
  return { success: true };
}
