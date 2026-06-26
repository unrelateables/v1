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
  try {
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

    const settings = { ...DEFAULTS, ...rawSettings } as ProfileSettings;

    return (
      <LiveEditor
        profile={profile as Profile}
        settings={settings}
        links={(links ?? []) as Link[]}
        embeds={(embeds ?? []) as Embed[]}
      />
    );
  } catch (e: any) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
        <p className="font-semibold">Failed to load editor</p>
        <p className="mt-1 text-xs text-red-400/70">{e?.message || String(e)}</p>
        <p className="mt-3 text-xs text-neutral-500">
          Make sure you ran the ALTER SQL in Supabase to add the new design columns.
        </p>
      </div>
    );
  }
}
