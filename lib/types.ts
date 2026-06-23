export type BgType = "solid" | "gradient" | "image" | "video";

export type ParticleEffect = "none" | "stars" | "hearts";

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
  created_at: string;
}

export interface ProfileSettings {
  profile_id: string;
  bg_type: BgType;
  bg_value: string | null;
  accent_color: string;
  text_color: string;
  effects: ProfileEffects;
  audio_url: string | null;
  audio_autoplay: boolean;
  glassmorphism: boolean;
  typing_effect: boolean;
  is_public: boolean;
  updated_at: string;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon: string | null;
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
