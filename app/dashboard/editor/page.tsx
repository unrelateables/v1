import { createClient } from "@/lib/supabase/server";
import { safeProfile, safeSettings } from "@/lib/defaults";
import { LiveEditor } from "./live-editor";
import type { Link, Embed } from "@/lib/types";

export default async function EditorPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: rawSettings } = await supabase
    .from("profile_settings")
    .select("*")
    .eq("profile_id", user.id)
    .maybeSingle();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", user.id)
    .order("position");

  const { data: embeds } = await supabase
    .from("embeds")
    .select("*")
    .eq("profile_id", user.id)
    .order("position");

  return (
    <LiveEditor
      profile={safeProfile(profile)}
      settings={safeSettings(rawSettings)}
      links={(links ?? []) as Link[]}
      embeds={(embeds ?? []) as Embed[]}
    />
  );
}
