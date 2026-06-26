import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfileBadges } from "@/lib/badges";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — biolink",
  description: "See who's getting the most views.",
};

export const revalidate = 60;

interface LeaderRow {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  view_count: number;
  created_at: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_leaderboard", {
    limit_count: 100,
  });

  const rows = (data ?? []) as LeaderRow[];

  return (
    <main className="relative min-h-screen px-6 py-12">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-neutral-400 transition hover:text-white"
          >
            ← Home
          </Link>
          <h1 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
            Leaderboard
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Everyone on biolink, ranked by profile views.
          </p>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
            Couldn&apos;t load the leaderboard.
            <p className="mt-2 text-xs text-red-400/70">
              Make sure you ran the leaderboard SQL in Supabase.
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-neutral-400">
            No public profiles yet.{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Be the first!
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-2">
            {rows.map((row, index) => {
              const name = row.display_name || row.username;
              const isOwner = getProfileBadges({
                id: row.id,
                role: row.role,
              }).includes("owner");
              return (
                <Link
                  key={row.id}
                  href={`/${row.username}`}
                  className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-white/20"
                >
                  {/* rank */}
                  <div className="flex w-8 shrink-0 justify-center text-lg font-bold">
                    {index < 3 ? (
                      <span className="text-2xl">{MEDALS[index]}</span>
                    ) : (
                      <span className="text-neutral-500">{index + 1}</span>
                    )}
                  </div>

                  {/* avatar */}
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {row.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={row.avatar_url}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-neutral-500">
                        {row.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* name */}
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate font-semibold">
                      <span className="truncate group-hover:text-accent">
                        {name}
                      </span>
                      {isOwner && (
                        <span title="Owner" aria-hidden>
                          👑
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      @{row.username}
                    </p>
                  </div>

                  {/* views */}
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold tabular-nums">
                      {formatCount(row.view_count)}
                    </p>
                    <p className="text-xs text-neutral-500">views</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-neutral-600">
          Updates every minute · sorted by total views
        </p>
      </div>
    </main>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
