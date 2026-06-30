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

export interface ProfilePage {
  profile: Profile;
  settings: ProfileSettings;
  links: Link[];
  embeds: Embed[];
}
