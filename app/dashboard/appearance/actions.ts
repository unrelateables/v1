"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidUrl } from "@/lib/utils";
import { getTemplate } from "@/lib/templates";

export type FormState = { error?: string; success?: boolean } | undefined;

const ALLOWED = (arr: string[]) => (v: string) =>
  arr.includes(v) ? v : arr[0];

const layoutOk = ALLOWED(["centered", "left", "card"]);
const alignOk = ALLOWED(["center", "left"]);
const fontOk = ALLOWED(["sans", "mono", "serif", "display"]);
const radiusOk = ALLOWED(["none", "sm", "md", "lg", "xl", "full"]);
const btnStyleOk = ALLOWED(["glass", "filled", "outline", "minimal"]);
const btnSizeOk = ALLOWED(["sm", "md", "lg"]);
const nameSizeOk = ALLOWED(["sm", "md", "lg", "xl"]);
const avatarOk = ALLOWED(["circle", "square", "rounded"]);
const linkLayoutOk = ALLOWED(["list", "grid"]);
const particleOk = ALLOWED(["none", "stars", "hearts"]);

export async function updateAppearanceAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const g = (k: string) => String(formData.get(k) ?? "");
  const on = (k: string) => formData.get(k) === "on";

  const bg_type = (g("bg_type") || "solid") as "solid" | "gradient" | "image" | "video";
  const bg_value = g("bg_value").trim();
  let bg_overlay = Math.max(0, Math.min(100, parseInt(g("bg_overlay")) || 30));
  const accent_color = g("accent_color") || "#6366f1";
  const text_color = g("text_color") || "#ffffff";
  const audio_url = g("audio_url").trim();
  const custom_css = g("custom_css").trim();

  // If a template was chosen, pull its overlay values for the fields not on the form.
  const templateId = g("template") || "default";
  const tmpl = getTemplate(templateId);

  if ((bg_type === "image" || bg_type === "video") && !isValidUrl(bg_value)) {
    return { error: "Background image/video must be a valid URL." };
  }
  if (audio_url && !isValidUrl(audio_url)) {
    return { error: "Audio URL must be a valid URL." };
  }
  if (custom_css.length > 10000) {
    return { error: "Custom CSS is too long (max 10,000 chars)." };
  }

  const effects = {
    particles: particleOk(g("particles")),
    snow: on("snow"),
    rain: on("rain"),
  };

  const payload: Record<string, unknown> = {
    bg_type,
    bg_value: bg_value || null,
    bg_overlay,
    accent_color,
    text_color,
    effects,
    audio_url: audio_url || null,
    audio_autoplay: on("audio_autoplay"),
    glassmorphism: on("glassmorphism"),
    typing_effect: on("typing_effect"),
    is_public: on("is_public"),
    layout: layoutOk(g("layout")),
    text_align: alignOk(g("text_align")),
    font_family: fontOk(g("font_family")),
    radius: radiusOk(g("radius")),
    button_style: btnStyleOk(g("button_style")),
    button_size: btnSizeOk(g("button_size")),
    name_size: nameSizeOk(g("name_size")),
    avatar_shape: avatarOk(g("avatar_shape")),
    link_layout: linkLayoutOk(g("link_layout")),
    show_views: on("show_views"),
    show_footer: on("show_footer"),
    custom_css: custom_css || null,
    template: templateId,
  };

  // Merge any template-only fields (e.g. when switching template, fields not
  // present on the form still get set). Here all fields are on the form, so
  // this is mostly a safety net.
  if (tmpl?.apply) {
    for (const [k, v] of Object.entries(tmpl.apply)) {
      if (!(k in payload)) payload[k] = v;
    }
  }

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

  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }
  revalidatePath("/dashboard/appearance");
  return { success: true };
}

/** Applies a template's settings immediately (called by the template picker). */
export async function applyTemplateAction(templateId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const tmpl = getTemplate(templateId);
  if (!tmpl) return { error: "Unknown template." };

  const { error } = await supabase
    .from("profile_settings")
    .update({ ...tmpl.apply, template: templateId })
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/appearance");
  return { success: true };
}
