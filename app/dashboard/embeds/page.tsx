import { createClient } from "@/lib/supabase/server";
import { EmbedsManager } from "./embeds-manager";

export default async function EmbedsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: embeds } = await supabase
    .from("embeds")
    .select("*")
    .eq("profile_id", user!.id)
    .order("position", { ascending: true });

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs text-neutral-600">{"// embeds"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Embeds</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Add YouTube, Spotify, or SoundCloud blocks to your page.
      </p>
      <div className="mt-6">
        <EmbedsManager embeds={embeds ?? []} />
      </div>
    </div>
  );
}
