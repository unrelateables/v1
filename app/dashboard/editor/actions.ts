"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidUrl } from "@/lib/utils";

export type FormState = { error?: string; success?: boolean } | undefined;

const ok = (arr: string[], v: string) => (arr.includes(v) ? v : arr[0]);

export async function saveEditorAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const g = (k: string) => String(formData.get(k) ?? "");
  const on = (k: string) => formData.get(k) === "on";

  const bg_type = g("bg_type") as "solid" | "gradient" | "image" | "video";
  const bg_value = g("bg_value").trim();
  const audio_url = g("audio_url").trim();
  const custom_css = g("custom_css").trim();

  if ((bg_type === "image" || bg_type === "video") && !isValidUrl(bg_value)) {
    return { error: "Background image/video must be a valid URL." };
  }
  if (audio_url && !isValidUrl(audio_url)) {
    return { error: "Audio URL must be a valid URL." };
  }

  const payload: Record<string, unknown> = {
    bg_type,
    bg_value: bg_value || null,
    bg_overlay: Math.max(0, Math.min(100, parseInt(g("bg_overlay")) || 30)),
    accent_color: g("accent_color") || "#6366f1",
    text_color: g("text_color") || "#ffffff",
    effects: {
      particles: ok(["none", "stars", "hearts"], g("particles")),
      snow: on("snow"),
      rain: on("rain"),
    },
    audio_url: audio_url || null,
    audio_autoplay: on("audio_autoplay"),
    glassmorphism: on("glassmorphism"),
    typing_effect: on("typing_effect"),
    is_public: on("is_public"),
    layout: ok(["centered", "left"], g("layout")),
    text_align: ok(["center", "left"], g("text_align")),
    font_family: ok(["sans", "mono", "serif", "display"], g("font_family")),
    radius: ok(["none", "sm", "md", "lg", "xl", "full"], g("radius")),
    button_style: ok(["glass", "filled", "outline", "minimal"], g("button_style")),
    button_size: ok(["sm", "md", "lg"], g("button_size")),
    name_size: ok(["sm", "md", "lg", "xl"], g("name_size")),
    avatar_shape: ok(["circle", "square", "rounded"], g("avatar_shape")),
    link_layout: ok(["list", "grid"], g("link_layout")),
    show_views: on("show_views"),
    show_footer: on("show_footer"),
    custom_css: custom_css || null,
  };

  const { error } = await supabase
    .from("profile_settings")
    .update(payload)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/editor");
  return { success: true };
}
