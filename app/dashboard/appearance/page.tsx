import { createClient } from "@/lib/supabase/server";
import { AppearanceForm } from "./appearance-form";
import type { ProfileSettings } from "@/lib/types";

export default async function AppearancePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: settings } = await supabase
    .from("profile_settings")
    .select("*")
    .eq("profile_id", user!.id)
    .single();

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs text-neutral-600">{"// appearance"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Appearance</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Customize the look and feel of your page.
      </p>
      <div className="mt-6">
        <AppearanceForm settings={settings as ProfileSettings} />
      </div>
    </div>
  );
}
