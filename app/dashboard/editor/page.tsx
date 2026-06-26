import { createClient } from "@/lib/supabase/server";
import { LiveEditor } from "./live-editor";
import type { Profile, ProfileSettings, Link, Embed } from "@/lib/types";

export default async function EditorPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: settings }, { data: links }, { data: embeds }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("profile_settings").select("*").eq("profile_id", user!.id).single(),
      supabase.from("links").select("*").eq("profile_id", user!.id).order("position"),
      supabase.from("embeds").select("*").eq("profile_id", user!.id).order("position"),
    ]);

  return (
    <LiveEditor
      profile={profile as Profile}
      settings={settings as ProfileSettings}
      links={(links ?? []) as Link[]}
      embeds={(embeds ?? []) as Embed[]}
    />
  );
}
