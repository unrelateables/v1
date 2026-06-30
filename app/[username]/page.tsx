import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfilePage } from "@/lib/types";
import { getProfileBadges } from "@/lib/badges";
import { safeSettings } from "@/lib/defaults";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

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

export const revalidate = 0;

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

  // No profile or banned → 404
  if (!profile || profile.banned) notFound();

  // Use maybeSingle so missing settings row returns null (not an error)
  const { data: rawSettings } = await supabase
    .from("profile_settings")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const settings = safeSettings(rawSettings);

  // If settings exist and explicitly set to private → 404
  if (rawSettings && rawSettings.is_public === false) notFound();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("position");

  const { data: embeds } = await supabase
    .from("embeds")
    .select("*")
    .eq("profile_id", profile.id)
    .order("position");

  const page: ProfilePage = {
    profile,
    settings,
    links: links ?? [],
    embeds: embeds ?? [],
  };

  const badges = getProfileBadges(profile);
  return <ProfileView page={page} badges={badges} />;
}
