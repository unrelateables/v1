import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export default async function DashboardHome() {
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

  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  const [{ count: totalViews }, { count: monthViews }, { count: linkCount }] =
    await Promise.all([
      supabase.from("views").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
      supabase
        .from("views")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id)
        .gte("created_at", since),
      supabase.from("links").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
    ]);

  const pageUrl = profile ? `/${profile.username}` : "/";

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-neutral-500">Total views</p>
          <p className="mt-2 text-3xl font-bold">{totalViews ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-neutral-500">Views (30d)</p>
          <p className="mt-2 text-3xl font-bold">{monthViews ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-neutral-500">Links</p>
          <p className="mt-2 text-3xl font-bold">{linkCount ?? 0}</p>
        </Card>
      </div>

      <Card className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-400">Your page</p>
          <p className="font-medium">
            {process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "")}
            {pageUrl}
          </p>
        </div>
        <Link
          href={pageUrl}
          target="_blank"
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Open ↗
        </Link>
      </Card>
    </div>
  );
}
