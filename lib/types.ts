export type BgType = "solid" | "gradient" | "image" | "gif" | "video";
export type ParticleEffect = "none" | "stars" | "hearts";
export type Layout = "centered" | "left" | "card";
export type TextAlign = "center" | "left";
export type FontFamily = "sans" | "mono" | "serif" | "display";
export type Radius = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type ButtonStyle = "glass" | "filled" | "outline" | "minimal";
export type ButtonSize = "sm" | "md" | "lg";
export type NameSize = "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square" | "rounded";
export type LinkLayout = "list" | "grid";

// ── New effect types ──
export type OverlayType = "none" | "dark" | "light" | "gradient-v" | "gradient-h" | "vignette" | "radial";
export type NameEffect = "none" | "typewriter" | "rainbow" | "glitch" | "wave" | "gradient";
export type HoverEffect = "none" | "glow" | "pulse" | "shake" | "lift" | "slide";
export type CursorEffect = "none" | "spark" | "rainbow" | "trail" | "ripple" | "hearts";
export type PageEntry = "none" | "fade" | "slide-up" | "zoom" | "blur" | "flip";
export type BorderGlow = "none" | "glow" | "pulse" | "shake";
export type CustomFont = "none" | "poppins" | "inter" | "roboto-mono" | "playfair" | "bebas" | "dancing" | "press-start";

// Aliases used across components
export type PageAnimation = PageEntry;
export type UsernameEffectType = NameEffect;
export type CursorEffectType = CursorEffect;
export type HoverEffectType = HoverEffect;

export interface ProfileEffects {
  particles: ParticleEffect;
  snow: boolean;
  rain: boolean;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  banned: boolean;
  badges: string[];
  equipped_badges: string[] | null;
  created_at: string;
}

export interface ProfileSettings {
  profile_id: string;
  bg_type: BgType;
  bg_value: string | null;
  bg_overlay: number;
  accent_color: string;
  text_color: string;
  effects: ProfileEffects;
  audio_url: string | null;
  audio_autoplay: boolean;
  glassmorphism: boolean;
  typing_effect: boolean;
  is_public: boolean;
  layout: Layout;
  text_align: TextAlign;
  font_family: FontFamily;
  radius: Radius;
  button_style: ButtonStyle;
  button_size: ButtonSize;
  name_size: NameSize;
  avatar_shape: AvatarShape;
  link_layout: LinkLayout;
  show_views: boolean;
  show_footer: boolean;
  custom_css: string | null;
  template: string;
  // ── New effect fields ──
  gradient_overlay: OverlayType;
  overlay_color1: string | null;
  overlay_color2: string | null;
  overlay_intensity: number;
  border_glow: "none" | "accent" | "rainbow" | "soft" | "pulse" | "shake";
  page_entry: PageEntry;
  username_effect: NameEffect;
  hover_effect: HoverEffect;
  cursor_effect: CursorEffectType;
  monochrome_icons: boolean;
  custom_font: CustomFont;
  social_links: SocialLink[];
  spin_avatar: boolean;
  show_profile_age: boolean;
  discord_id: string | null;
  spotify_track_id: string | null;
  updated_at: string;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon: string | null; // Can be emoji text or image/GIF URL
  position: number;
  created_at: string;
}

export interface Embed {
  id: string;
  profile_id: string;
  provider: "youtube" | "spotify" | "soundcloud" | "custom";
  embed_id: string;
  position: number;
  created_at: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ProfilePage {
  profile: Profile;
  settings: ProfileSettings;
  links: Link[];
  embeds: Embed[];
  socialLinks?: SocialLink[];
}
