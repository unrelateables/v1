import { createClient } from "@/lib/supabase/server";
import { LiveEditor } from "./live-editor";
import type { Profile, ProfileSettings, Link, Embed } from "@/lib/types";

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
};

export default async function EditorPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: rawSettings }, { data: links }, { data: embeds }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("profile_settings").select("*").eq("profile_id", user!.id).single(),
      supabase.from("links").select("*").eq("profile_id", user!.id).order("position"),
      supabase.from("embeds").select("*").eq("profile_id", user!.id).order("position"),
    ]);

  // Merge defaults for any columns that don't exist yet in the DB.
  const settings = { ...DEFAULTS, ...rawSettings } as ProfileSettings;

  return (
    <LiveEditor
      profile={profile as Profile}
      settings={settings}
      links={(links ?? []) as Link[]}
      embeds={(embeds ?? []) as Embed[]}
    />
  );
}
