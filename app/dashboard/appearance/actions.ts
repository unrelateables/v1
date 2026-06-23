"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidUrl } from "@/lib/utils";
import type { BgType, ParticleEffect, ProfileEffects } from "@/lib/types";

export type FormState = { error?: string; success?: boolean } | undefined;

export async function updateAppearanceAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bg_type = String(formData.get("bg_type") || "solid") as BgType;
  const bg_value = String(formData.get("bg_value") || "").trim();
  const accent_color = String(formData.get("accent_color") || "#6366f1");
  const text_color = String(formData.get("text_color") || "#ffffff");
  const audio_url = String(formData.get("audio_url") || "").trim();
  const audio_autoplay = formData.get("audio_autoplay") === "on";
  const glassmorphism = formData.get("glassmorphism") === "on";
  const typing_effect = formData.get("typing_effect") === "on";
  const is_public = formData.get("is_public") === "on";

  const particles = String(formData.get("particles") || "none") as ParticleEffect;
  const snow = formData.get("snow") === "on";
  const rain = formData.get("rain") === "on";
  const effects: ProfileEffects = { particles, snow, rain };

  if ((bg_type === "image" || bg_type === "video") && !isValidUrl(bg_value)) {
    return { error: "Background image/video must be a valid URL." };
  }
  if (audio_url && !isValidUrl(audio_url)) {
    return { error: "Audio URL must be a valid URL." };
  }

  const { error } = await supabase
    .from("profile_settings")
    .update({
      bg_type,
      bg_value: bg_value || null,
      accent_color,
      text_color,
      effects,
      audio_url: audio_url || null,
      audio_autoplay,
      glassmorphism,
      typing_effect,
      is_public,
    })
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }
  revalidatePath("/dashboard/appearance");
  return { success: true };
}
