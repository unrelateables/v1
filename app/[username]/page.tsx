import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfilePage, ProfileSettings } from "@/lib/types";
import { getProfileBadges } from "@/lib/badges";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

const DEFAULTS: Partial<ProfileSettings> = {
  bg_overlay: 30,
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
  glassmorphism: true,
  typing_effect: false,
  is_public: true,
  audio_autoplay: false,
  bg_type: "solid",
  bg_value: null,
  accent_color: "#6366f1",
  text_color: "#ffffff",
  audio_url: null,
  effects: { particles: "none", snow: false, rain: false },
};

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url, banned")
    .eq("username", params.username)
    .maybeSingle();

  if (!profile || profile.banned) return {};

  const title = profile.display_name || profile.username;
  const description = profile.bio || `@${profile.username} on biolink`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${SITE_URL}/${profile.username}`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function UsernamePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .maybeSingle();

  if (!profile || profile.banned) notFound();

  const [
    { data: settings },
    { data: links },
    { data: embeds },
  ] = await Promise.all([
    supabase.from("profile_settings").select("*").eq("profile_id", profile.id).single(),
    supabase.from("links").select("*").eq("profile_id", profile.id).order("position"),
    supabase.from("embeds").select("*").eq("profile_id", profile.id).order("position"),
  ]);

  if (!settings?.is_public) notFound();

  // Merge defaults for any columns missing from the DB.
  const safeSettings = { ...DEFAULTS, ...settings } as ProfileSettings;

  const page: ProfilePage = {
    profile,
    settings: safeSettings,
    links: links ?? [],
    embeds: embeds ?? [],
  };

  const badges = getProfileBadges(profile);

  return <ProfileView page={page} badges={badges} />;
}
