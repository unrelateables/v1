import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function validateSupabaseUrl(v?: string) {
  if (!v) return { ok: false, msg: "NOT SET" };
  let ok = true;
  const problems: string[] = [];
  if (!v.startsWith("https://")) {
    problems.push("must start with https://");
    ok = false;
  }
  if (!v.endsWith(".supabase.co")) {
    problems.push("must end with .supabase.co (NOT the dashboard URL)");
    ok = false;
  }
  if (v.includes("dashboard") || v.includes("/project/")) {
    problems.push("looks like the dashboard URL, not the API URL");
    ok = false;
  }
  if (v.endsWith("/")) {
    problems.push("has a trailing slash — remove it");
    ok = false;
  }
  return { ok, msg: ok ? "format looks correct" : problems.join("; ") };
}

export default async function DebugPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const urlCheck = validateSupabaseUrl(url);
  const urlFormat = /^https:\/\/[a-z0-9]+\.supabase\.co$/i.test(url || "");

  // Direct HTTP probe to the auth endpoint (bypasses the SDK)
  let probe: { status: string; body: string; ok: boolean } = {
    status: "(not run)",
    body: "",
    ok: false,
  };
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      method: "GET",
      cache: "no-store",
    });
    probe = {
      status: `${res.status} ${res.statusText}`,
      body: (await res.text()).slice(0, 500),
      ok: res.ok,
    };
  } catch (e: any) {
    probe = {
      status: "FETCH FAILED",
      body: `${e?.name || "Error"}: ${e?.message || String(e)}\n${e?.cause?.message || ""}`,
      ok: false,
    };
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Diagnostics</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Focused on the Supabase URL + network reachability.
          </p>
        </div>

        {/* URL display */}
        <div className="glass rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            NEXT_PUBLIC_SUPABASE_URL (current value)
          </p>
          <p className="mt-1 break-all rounded-lg bg-black/40 p-3 font-mono text-sm text-neutral-100">
            {url || "(empty)"}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className={urlFormat ? "text-emerald-400" : "text-red-400"}>
              {urlFormat ? "✓ correct format" : "✗ WRONG format"}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-300">{urlCheck.msg}</p>
        </div>

        {/* Expected format */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <p className="font-medium">It MUST look exactly like this:</p>
          <p className="mt-1 break-all rounded bg-black/40 p-2 font-mono text-amber-100">
            https://YOURPROJECTREF.supabase.co
          </p>
          <p className="mt-2 text-amber-300/80">
            NOT https://supabase.com/dashboard/project/xxx
            <br />
            NOT with a trailing /
          </p>
        </div>

        {/* HTTP probe */}
        <div
          className={`rounded-2xl border p-5 ${
            probe.ok ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <h2 className="text-sm font-medium">Direct network probe to {`/auth/v1/health`}</h2>
          <p className="mt-1 text-sm text-neutral-300">HTTP status: {probe.status}</p>
          <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-black/50 p-3 text-xs text-neutral-300">
            {probe.body || "(empty body)"}
          </pre>
        </div>

        {/* Keys */}
        <div className="glass rounded-xl p-4 space-y-2 text-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Keys</p>
          <p className="text-neutral-300">
            anon key: {anon ? "set" : "NOT SET"} · service role: {svc ? "set" : "NOT SET"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-300">
          <p className="font-medium text-neutral-100">If the URL is wrong:</p>
          <p className="mt-1 text-neutral-400">
            Vercel → Settings → Environment Variables → edit{" "}
            <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_SUPABASE_URL</code> → paste the
            correct value → Redeploy.
          </p>
          <p className="mt-3 font-medium text-neutral-100">Correct value location:</p>
          <p className="mt-1 text-neutral-400">
            Supabase → ⚙ Project Settings → API → <b>Project URL</b>
          </p>
        </div>
      </div>
    </main>
  );
}
