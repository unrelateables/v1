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

  const since30 = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  const since7 = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  // Fetch stats
  const [
    { count: totalViews },
    { count: monthViews },
    { count: linkCount },
    { data: recentLinks },
    { data: recentViews },
  ] = await Promise.all([
    supabase.from("views").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase
      .from("views")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id)
      .gte("created_at", since30),
    supabase.from("links").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
    // Links for per-link analytics
    supabase.from("links").select("id, title, url").eq("profile_id", user.id).order("position"),
    // Views for 7-day chart
    supabase
      .from("views")
      .select("created_at")
      .eq("profile_id", user.id)
      .gte("created_at", since7)
      .order("created_at", { ascending: true }),
  ]);

  const p = safeProfile(rawProfile) as Profile | null;
  const pageUrl = p ? `/${p.username}` : "/";
  const stats = {
    totalViews: totalViews ?? 0,
    monthViews: monthViews ?? 0,
    linkCount: linkCount ?? 0,
  };

  // Build 7-day chart data
  const days: { label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count =
      (recentViews ?? []).filter((v: any) => {
        const vd = new Date(v.created_at);
        return vd >= d && vd < next;
      }).length ?? 0;
    days.push({
      label: d.toLocaleDateString("en", { weekday: "short" }),
      count,
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs text-neutral-600">{"// dashboard"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Hey{p?.display_name ? `, ${p.display_name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Here&apos;s how your page is doing.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            total views
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{stats.totalViews}</p>
        </Card>
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            views (30d)
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{stats.monthViews}</p>
        </Card>
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            links
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{stats.linkCount}</p>
        </Card>
      </div>

      {/* Page link */}
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
        <Link href={pageUrl} target="_blank" className="link-underline rounded-lg text-sm text-neutral-300">
          open ↗
        </Link>
      </Card>

      {/* 7-day visitor chart */}
      <Card className="mt-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
          visitors (last 7 days)
        </p>
        <div className="mt-4 flex items-end justify-between gap-2" style={{ height: 100 }}>
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-indigo-500/40 transition-all"
                style={{
                  height: `${(d.count / maxDay) * 70}px`,
                  minHeight: d.count > 0 ? 4 : 2,
                  background: d.count > 0 ? undefined : "rgba(255,255,255,0.05)",
                }}
              />
              <span className="text-[9px] text-neutral-500">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Per-link analytics */}
      {recentLinks && recentLinks.length > 0 && (
        <Card className="mt-4">
          <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            link clicks
          </p>
          <LinkClicksChart links={recentLinks} profileId={user.id} />
        </Card>
      )}
    </div>
  );
}

async function LinkClicksChart({ links, profileId }: { links: any[]; profileId: string }) {
  const supabase = createClient();
  const results = await Promise.all(
    links.map(async (link) => {
      const { count } = await supabase
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("link_id", link.id);
      return { title: link.title, clicks: count ?? 0 };
    })
  );
  const max = Math.max(1, ...results.map((r) => r.clicks));

  return (
    <div className="mt-4 space-y-2">
      {results.map((r, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-24 truncate text-xs text-neutral-400">{r.title}</span>
          <div className="h-5 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-indigo-500/50"
              style={{ width: `${(r.clicks / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs font-medium tabular-nums text-neutral-300">
            {r.clicks}
          </span>
        </div>
      ))}
    </div>
  );
}
