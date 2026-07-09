import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  banAction,
  unbanAction,
  resolveFlagAction,
  deleteProfileAction,
  setRoleAction,
  grantBadgeAction,
} from "./actions";
import { BADGES } from "@/lib/constants";
import { getProfileBadges } from "@/lib/badges";
import { DeleteButton } from "./delete-button";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") redirect("/dashboard");

  const [{ data: profiles }, { data: flags }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("flags").select("*").eq("resolved", false).order("created_at", { ascending: false }),
  ]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="mt-1 text-sm text-neutral-400">Moderation tools</p>
          </div>
          <Link href="/dashboard" className="text-sm text-accent hover:underline">
            ← Dashboard
          </Link>
        </div>

        {/* Flags */}
        {flags && flags.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-medium text-amber-400">
              Open reports ({flags.length})
            </h2>
            <div className="space-y-2">
              {flags.map((flag) => (
                <div
                  key={flag.id}
                  className="glass flex items-center justify-between rounded-xl p-4"
                >
                  <div>
                    <p className="text-sm">{flag.reason}</p>
                    <p className="text-xs text-neutral-500">profile {flag.profile_id}</p>
                  </div>
                  <form action={resolveFlagAction}>
                    <input type="hidden" name="id" value={flag.id} />
                    <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
                      Resolve
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Users */}
        <section>
          <h2 className="mb-3 text-sm font-medium">Users ({profiles?.length ?? 0})</h2>
          <div className="space-y-2">
            {profiles?.map((p) => {
              const earnedBadges = getProfileBadges(p);
              return (
                <div
                  key={p.id}
                  className="glass rounded-xl p-4"
                >
                  {/* Header row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">@{p.username}</span>
                        {p.role === "admin" && (
                          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs text-amber-400">
                            admin
                          </span>
                        )}
                        {p.banned && (
                          <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-400">
                            banned
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-neutral-500">
                        {p.display_name || "—"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link
                        href={`/${p.username}`}
                        target="_blank"
                        className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                      >
                        View
                      </Link>
                      {/* Ban / Unban */}
                      {p.banned ? (
                        <form action={unbanAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/25">
                            Unban
                          </button>
                        </form>
                      ) : (
                        p.role !== "admin" && (
                          <form action={banAction}>
                            <input type="hidden" name="id" value={p.id} />
                            <button className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/25">
                              Ban
                            </button>
                          </form>
                        )
                      )}
                      {/* Promote / Demote */}
                      <form action={setRoleAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <input
                          type="hidden"
                          name="role"
                          value={p.role === "admin" ? "user" : "admin"}
                        />
                        <button
                          className="rounded-lg px-3 py-1.5 text-xs hover:opacity-80"
                          style={{
                            background: p.role === "admin" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                            color: p.role === "admin" ? "#f87171" : "#60a5fa",
                          }}
                        >
                          {p.role === "admin" ? "Demote" : "Make Admin"}
                        </button>
                      </form>
                      {/* Delete */}
                      <form
                        action={deleteProfileAction}
                        onSubmit={(e) => {
                          if (!confirm(`Permanently delete @${p.username}? This cannot be undone.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <button className="rounded-lg bg-red-900/30 px-3 py-1.5 text-xs text-red-500 hover:bg-red-900/50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Badge grants */}
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <p className="mb-1.5 text-[10px] uppercase tracking-wide text-neutral-600">
                      Grant badges
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {BADGES.map((b) => {
                        const has = earnedBadges.includes(b.id);
                        return (
                          <form key={b.id} action={grantBadgeAction}>
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="badge" value={b.id} />
                            <button
                              type="submit"
                              className="rounded-full border px-2.5 py-1 text-[10px] transition"
                              style={{
                                borderColor: has ? b.id === "owner" ? "#fbbf2455" : b.id === "staff" ? "#3b82f655" : "#d1d5db55" : "rgba(255,255,255,0.1)",
                                background: has ? "rgba(255,255,255,0.05)" : "transparent",
                                color: has ? "#fff" : "#737373",
                              }}
                            >
                              {has ? "✓ " : "+ "}{b.label}
                            </button>
                          </form>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
