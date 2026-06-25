import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function mask(v?: string) {
  if (!v) return "NOT SET";
  if (v.length < 12) return `set (short: ${v.slice(0, 4)}…)`;
  return `set (${v.slice(0, 6)}…${v.slice(-4)})`;
}

export default async function DebugPage() {
  const checks: { label: string; value: string; ok: boolean }[] = [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
  checks.push({ label: "NEXT_PUBLIC_SUPABASE_URL", value: mask(url), ok: !!url });
  checks.push({ label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: mask(anon), ok: !!anon });
  checks.push({ label: "SUPABASE_SERVICE_ROLE_KEY", value: mask(svc), ok: !!svc });

  // DB connection + profiles table
  let dbOk = false;
  let dbMsg = "";
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    if (error) dbMsg = `profiles table error: ${error.message}`;
    else {
      dbOk = true;
      dbMsg = `profiles table OK — ${count ?? 0} rows`;
    }
  } catch (e: any) {
    dbMsg = `connection failed: ${e?.message || String(e)}`;
  }
  checks.push({ label: "Database / profiles table", value: dbMsg, ok: dbOk });

  // ---- LIVE SIGNUP PROBE ----
  // Attempt a real (throwaway) signup so we can see the RAW Supabase response,
  // bypassing the form + redirects + browser cache entirely.
  let probe: {
    ok: boolean;
    error: string | null;
    errorCode: string | null;
    hasUser: boolean;
    hasSession: boolean;
    raw: string;
  } = { ok: false, error: null, errorCode: null, hasUser: false, hasSession: false, raw: "" };

  try {
    const supabase = createClient();
    const testEmail = `probe-${Date.now()}@debug.test`;
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: "TestPassword123!",
    });
    probe = {
      ok: !error,
      error: error ? error.message || "(no message)" : null,
      errorCode: error ? String(error.name || error.status || "") : null,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      raw: JSON.stringify({ error, user: data?.user?.id ?? null }, null, 2),
    };
    // clean up: delete the throwaway user if created
    if (data?.user && svc) {
      const { createClient: mk } = await import("@supabase/supabase-js");
      const admin = mk(url!, svc!, { auth: { persistSession: false } });
      await admin.auth.admin.deleteUser(data.user.id).catch(() => {});
    }
  } catch (e: any) {
    probe = {
      ok: false,
      error: e?.message || String(e),
      errorCode: null,
      hasUser: false,
      hasSession: false,
      raw: String(e?.stack || e),
    };
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Diagnostics</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Environment + database + a live signup probe.
          </p>
        </div>

        {/* Config checks */}
        <div className="space-y-2">
          {checks.map((c) => (
            <div key={c.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-neutral-500">
                  {c.label}
                </span>
                <span className={c.ok ? "text-emerald-400" : "text-red-400"}>
                  {c.ok ? "OK" : "FAIL"}
                </span>
              </div>
              <p className="mt-1 break-all text-sm text-neutral-200">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Signup probe */}
        <div
          className={`rounded-2xl border p-5 ${
            probe.ok ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Live signup probe</h2>
            <span className={probe.ok ? "text-emerald-400" : "text-red-400"}>
              {probe.ok ? "OK" : "FAIL"}
            </span>
          </div>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-neutral-500">error:</dt>
              <dd className="break-all text-neutral-200">{probe.error ?? "(none)"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-neutral-500">code/status:</dt>
              <dd className="text-neutral-200">{probe.errorCode || "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-neutral-500">user created:</dt>
              <dd className="text-neutral-200">{probe.hasUser ? "yes" : "no"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-neutral-500">session returned:</dt>
              <dd className="text-neutral-200">{probe.hasSession ? "yes" : "no"}</dd>
            </div>
          </dl>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-neutral-400">raw response</summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-black/50 p-3 text-xs text-neutral-300">
              {probe.raw}
            </pre>
          </details>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-300">
          <p className="font-medium text-neutral-100">Tell me the exact text shown above for:</p>
          <ul className="mt-1 list-inside list-disc text-neutral-400">
            <li>the red/green <b>Live signup probe</b> box</li>
            <li>especially the <b>error</b> and <b>code/status</b> lines</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
