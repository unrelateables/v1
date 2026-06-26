import { createClient } from "@/lib/supabase/server";
import { LiveEditor } from "./live-editor";
import type { ProfileSettings } from "@/lib/types";

const DEFAULTS: Partial<ProfileSettings> = {
  bg_overlay: 30, layout: "centered", text_align: "center",
  font_family: "sans", radius: "full", button_style: "glass",
  button_size: "md", name_size: "md", avatar_shape: "circle",
  link_layout: "list", show_views: true, show_footer: true,
  custom_css: null, template: "default",
};

export default async function EditorPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: raw } = await supabase
    .from("profile_settings").select("*").eq("profile_id", user!.id).single();
  const settings = { ...DEFAULTS, ...raw } as ProfileSettings;
  return <LiveEditor settings={settings} />;
}
