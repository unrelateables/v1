import type { ProfileSettings } from "@/lib/types";

/** Safe defaults for every column. Merged with DB data so pages never crash. */
export const SETTINGS_DEFAULTS: Partial<ProfileSettings> = {
  bg_type: "solid",
  bg_value: null,
  bg_overlay: 30,
  accent_color: "#6366f1",
  text_color: "#ffffff",
  effects: { particles: "none", snow: false, rain: false },
  audio_url: null,
  audio_autoplay: false,
  glassmorphism: true,
  typing_effect: false,
  is_public: true,
  layout: "centered",
  text_align: "center",
  font_family: "sans",
  radius: "full",
  button_style: "glass",
  button_size: "md",
  name_size: "md",
  avatar_shape: "circle",
  link_layout: "list",
  show_views: true,
  show_footer: true,
  custom_css: null,
  template: "default",
  // New effect fields
  gradient_overlay: "none",
  overlay_color1: "#6366f1",
  overlay_color2: "#0a0a0a",
  overlay_intensity: 40,
  border_glow: "none",
  page_entry: "fade",
  username_effect: "none",
  hover_effect: "lift",
  cursor_effect: "none",
  monochrome_icons: false,
  custom_font: "none",
  social_links: [],
  spin_avatar: false,
  show_profile_age: false,
  discord_id: null,
  spotify_track_id: null,
};

/** Safe defaults for a profile row (in case columns are missing). */
export function safeProfile(raw: any): any {
  return {
    ...raw,
    badges: raw?.badges ?? [],
    role: raw?.role ?? "user",
    equipped_badges: raw?.equipped_badges ?? null,
  };
}

/** Merge raw DB row with safe defaults. Never returns undefined fields. */
export function safeSettings(raw: any): ProfileSettings {
  return {
    profile_id: raw?.profile_id ?? "",
    ...SETTINGS_DEFAULTS,
    ...raw,
    effects: {
      ...(SETTINGS_DEFAULTS.effects as object),
      ...(raw?.effects ?? {}),
    },
  } as ProfileSettings;
}
