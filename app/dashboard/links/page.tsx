import { createClient } from "@/lib/supabase/server";
import { LinksManager } from "./links-manager";

export default async function LinksPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", user!.id)
    .order("position", { ascending: true });

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs text-neutral-600">{"// links"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Links</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Add the links you want people to visit.
      </p>
      <div className="mt-6 space-y-6">
        <LinksManager links={links ?? []} />
      </div>
    </div>
  );
}
