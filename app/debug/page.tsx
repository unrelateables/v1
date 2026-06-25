import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function mask(v?: string) {
  if (!v) return "❌ NOT SET";
  if (v.length < 12) return `✅ set (short: ${v.slice(0, 4)}…)`;
  return `✅ set (${v.slice(0, 6)}…${v.slice(-4)})`;
}

export default async function DebugPage() {
  const checks: { label: string; value: string; ok: boolean }[] = [];

  // 1. Env vars
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
  checks.push({ label: "NEXT_PUBLIC_SUPABASE_URL", value: mask(url), ok: !!url });
  checks.push({ label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: mask(anon), ok: !!anon });
  checks.push({ label: "SUPABASE_SERVICE_ROLE_KEY", value: mask(svc), ok: !!svc });

  // 2. DB connection + tables
  let dbOk = false;
  let dbMsg = "";
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    if (error) {
      dbMsg = `profiles table error: ${error.message}`;
    } else {
      dbOk = true;
      dbMsg = `profiles table OK — ${count ?? 0} rows`;
    }
  } catch (e: any) {
    dbMsg = `connection failed: ${e?.message || String(e)}`;
  }
  checks.push({ label: "Database / profiles table", value: dbMsg, ok: dbOk });

  // 3. Auth config test (can we reach auth admin list?)
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    checks.push({
      label: "Auth reachable",
      value: error ? `error: ${error.message}` : "OK",
      ok: !error,
    });
  } catch (e: any) {
    checks.push({
      label: "Auth reachable",
      value: `failed: ${e?.message || String(e)}`,
      ok: false,
    });
  }

  const allOk = checks.every((c) => c.ok);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Diagnostics</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Checks your environment + database connection. Delete this route once
          everything works.
        </p>

        <div
          className={`mt-6 rounded-xl border p-4 text-sm font-medium ${
            allOk
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {allOk ? "✓ Everything looks good." : "✗ Something is misconfigured — see below."}
        </div>

        <div className="mt-4 space-y-2">
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

        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-300">
          <p className="font-medium text-neutral-100">If the database check fails:</p>
          <p className="mt-1 text-neutral-400">
            Go to Supabase → SQL Editor → paste &amp; run the entire{" "}
            <code className="rounded bg-white/10 px-1">supabase/migrations/0001_init.sql</code>{" "}
            file.             It must say Success.
          </p>
          <p className="mt-3 font-medium text-neutral-100">If env vars are NOT SET:</p>
          <p className="mt-1 text-neutral-400">
            Vercel → Settings → Environment Variables → add all 4, then redeploy.
          </p>
        </div>
      </div>
    </main>
  );
}
