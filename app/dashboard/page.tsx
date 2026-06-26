import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import type { Profile } from "@/lib/types";
import { safeProfile } from "@/lib/defaults";

export default async function DashboardHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rawProfile } = await supabase
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

  const p = safeProfile(rawProfile) as Profile | null;
  const pageUrl = p ? `/${p.username}` : "/";
  const stats = {
    totalViews: totalViews ?? 0,
    monthViews: monthViews ?? 0,
    linkCount: linkCount ?? 0,
  };

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs text-neutral-600">{"// dashboard"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Hey{p?.display_name ? `, ${p.display_name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Here&apos;s how your page is doing.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            total views
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {stats.totalViews}
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            views (30d)
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {stats.monthViews}
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            links
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {stats.linkCount}
          </p>
        </Card>
      </div>

      <Card className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            your page
          </p>
          <p className="mt-0.5 font-medium text-neutral-200">
            {process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "")}
            {pageUrl}
          </p>
        </div>
        <Link
          href={pageUrl}
          target="_blank"
          className="link-underline rounded-lg text-sm text-neutral-300"
        >
          open ↗
        </Link>
      </Card>
    </div>
  );
}
