import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfilePage } from "@/lib/types";
import { getProfileBadges, getBadgeCounts } from "@/lib/badges";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UsernamePage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { debug?: string };
}) {
  const debug = searchParams.debug === "1";
  const supabase = createClient();
  const admin = createAdminClient();

  // Query profile case-insensitively
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", params.username)
    .maybeSingle();

  if (debug) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 font-mono text-xs text-neutral-300">
        <h1 className="mb-4 text-lg font-bold text-white">DEBUG: @{params.username}</h1>
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4">
{`PROFILE QUERY:
  error: ${profileErr?.message || "none"}
  found: ${profile ? "YES" : "NO"}
  data:  ${JSON.stringify(profile, null, 2)}`}
        </pre>
      </main>
    );
  }

  if (!profile) {
    notFound();
  }

  if (profile.banned) {
    notFound();
  }

  // Self-heal: create settings row if missing
  let { data: rawSettings, error: settingsErr } = await supabase
    .from("profile_settings")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  let settingsDebug = "exists";

  if (!rawSettings) {
    settingsDebug = "missing, creating...";
    const { error: insErr } = await admin
      .from("profile_settings")
      .insert({ profile_id: profile.id });
    if (insErr) {
      settingsDebug = `insert failed: ${insErr.message}`;
    }
    const { data: created } = await supabase
      .from("profile_settings")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    rawSettings = created;
  }

  const settings = safeSettings(rawSettings);

  // Show the privacy gate + settings in debug
  const isPrivate = rawSettings && rawSettings.is_public === false;

  if (debug) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 font-mono text-xs text-neutral-300">
        <h1 className="mb-4 text-lg font-bold text-white">DEBUG: @{params.username}</h1>
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4">
{`SETTINGS QUERY:
  error: ${settingsErr?.message || "none"}
  status: ${settingsDebug}
  is_public: ${rawSettings?.is_public}
  GATE: ${isPrivate ? "PRIVATE -> 404" : "PUBLIC -> render"}
  data:  ${JSON.stringify(rawSettings, null, 2)}`}
        </pre>
      </main>
    );
  }

  // Only 404 if explicitly private (and we have settings)
  if (isPrivate) {
    notFound();
  }

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

  const socialLinks = Array.isArray(settings.social_links)
    ? settings.social_links
    : [];

  const page: ProfilePage = {
    profile,
    settings,
    links: links ?? [],
    embeds: embeds ?? [],
    socialLinks,
  };

  const badges = getProfileBadges(profile);
  return <ProfileView page={page} badges={badges} />;
}
