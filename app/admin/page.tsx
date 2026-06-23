import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { banAction, unbanAction, resolveFlagAction } from "./actions";

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
            {profiles?.map((p) => (
              <div
                key={p.id}
                className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
              >
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
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${p.username}`}
                    target="_blank"
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    View
                  </Link>
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
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
