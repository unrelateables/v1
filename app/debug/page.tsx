export const dynamic = "force-dynamic";
export const revalidate = 0;

function len(v?: string) {
  return v ? `${v.length} chars` : "0 (NOT SET)";
}
function ends(v?: string) {
  if (!v || v.length < 12) return "—";
  return `${v.slice(0, 4)}…${v.slice(-4)}`;
}

export default async function DebugPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const urlTrailingSlash = url?.endsWith("/");
  const urlLooksRight = /^https:\/\/[a-z0-9]+\.supabase\.co$/i.test(url || "");

  // ---- RAW FETCH PROBES (capture the true underlying error) ----
  async function probe(label: string, endpoint: string) {
    const result: { label: string; ok: boolean; status: string; body: string; err: string } = {
      label,
      ok: false,
      status: "",
      body: "",
      err: "",
    };
    const target = `${url}${endpoint}`;
    try {
      const res = await fetch(target, {
        method: "GET",
        cache: "no-store",
        headers: { apikey: anon || "" },
      });
      result.ok = res.ok;
      result.status = `${res.status} ${res.statusText}`;
      result.body = (await res.text()).slice(0, 400);
    } catch (e: any) {
      result.status = "THREW";
      result.err =
        `${e?.name || "Error"}: ${e?.message || "(no message)"}\n` +
        `cause: ${e?.cause?.message || e?.cause || "(none)"}\n` +
        `code: ${e?.cause?.code || "(none)"}\n` +
        `hostname: ${e?.hostname || "(none)"}`;
    }
    return result;
  }

  const probes = await Promise.all([
    probe("Auth health", "/auth/v1/health"),
    probe("REST root", "/rest/v1/"),
    // RAW signup POST — captures the actual 500 response body
    (async () => {
      const result: { label: string; ok: boolean; status: string; body: string; err: string } = {
        label: "Auth signup POST",
        ok: false,
        status: "",
        body: "",
        err: "",
      };
      try {
        const res = await fetch(`${url}/auth/v1/signup`, {
          method: "POST",
          cache: "no-store",
          headers: {
            apikey: anon || "",
            authorization: `Bearer ${anon || ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: `rawprobe-${Date.now()}@debug.local`,
            password: "TestPassword123!",
          }),
        });
        result.ok = res.ok;
        result.status = `${res.status} ${res.statusText}`;
        result.body = (await res.text()).slice(0, 800);
      } catch (e: any) {
        result.status = "THREW";
        result.err = `${e?.name || "Error"}: ${e?.message || "(no message)"}`;
      }
      return result;
    })(),
  ]);

  // ---- SIGNUP PROBE with full error serialization ----
  let signup: { ok: boolean; name: string; message: string; status: any; cause: string } = {
    ok: false,
    name: "",
    message: "",
    status: "",
    cause: "",
  };
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: `probe-${Date.now()}@debug.test`,
      password: "TestPassword123!",
    });
    if (error) {
      signup = {
        ok: false,
        name: error.name,
        message: error.message,
        status: (error as any).status,
        cause: (error as any)?.cause?.message || JSON.stringify((error as any)?.cause || ""),
      };
    } else {
      signup = {
        ok: true,
        name: "none",
        message: `user ${data.user?.id ? "created" : "null"}`,
        status: "",
        cause: "",
      };
      // cleanup
      if (data.user && svc) {
        const { createClient: mk } = await import("@supabase/supabase-js");
        mk(url!, svc!, { auth: { persistSession: false } })
          .auth.admin.deleteUser(data.user.id)
          .catch(() => {});
      }
    }
  } catch (e: any) {
    signup = {
      ok: false,
      name: e?.name || "Error",
      message: e?.message || String(e),
      status: "",
      cause: e?.cause?.message || "",
    };
  }

  return (
    <main className="min-h-screen px-6 py-12 text-neutral-100">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Diagnostics</h1>
          <p className="mt-1 text-sm text-neutral-400">Raw network + auth probe.</p>
        </div>

        {/* URL */}
        <Section title="NEXT_PUBLIC_SUPABASE_URL">
          <code className="block break-all rounded bg-black/40 p-3 font-mono text-sm">
            {url || "(empty)"}
          </code>
          <p className="mt-2 text-sm">
            trailing slash:{" "}
            <span className={urlTrailingSlash ? "text-red-400" : "text-emerald-400"}>
              {urlTrailingSlash ? "YES (BAD — remove it)" : "no (good)"}
            </span>{" "}
            · format:{" "}
            <span className={urlLooksRight ? "text-emerald-400" : "text-red-400"}>
              {urlLooksRight ? "correct" : "WRONG"}
            </span>
          </p>
        </Section>

        {/* Keys */}
        <Section title="Keys">
          <p className="text-sm">anon: {len(anon)} ({ends(anon)})</p>
          <p className="text-sm">service_role: {len(svc)} ({ends(svc)})</p>
          <p className="mt-1 text-xs text-neutral-500">
            A Supabase anon key is ~200 chars & starts with &quot;eyJ&quot;. If the length
            looks short, it&apos;s probably truncated/partial.
          </p>
        </Section>

        {/* Raw fetch probes */}
        {probes.map((p) => (
          <Section key={p.label} title={`Raw fetch: ${p.label}`}>
            <p className="text-sm">
              status:{" "}
              <span className={p.ok ? "text-emerald-400" : "text-red-400"}>{p.status}</span>
            </p>
            {p.body && (
              <pre className="mt-2 overflow-auto rounded bg-black/40 p-2 text-xs text-neutral-300">
                {p.body}
              </pre>
            )}
            {p.err && (
              <pre className="mt-2 overflow-auto rounded bg-red-500/10 p-2 text-xs text-red-300">
                {p.err}
              </pre>
            )}
          </Section>
        ))}

        {/* Signup */}
        <Section title="Signup probe">
          <p className="text-sm">
            result:{" "}
            <span className={signup.ok ? "text-emerald-400" : "text-red-400"}>
              {signup.ok ? "OK" : "FAIL"}
            </span>
          </p>
          <pre className="mt-2 overflow-auto rounded bg-black/40 p-2 text-xs text-neutral-300">
            {`name:    ${signup.name}\nmessage: ${signup.message || "(empty)"}\nstatus:  ${signup.status}\ncause:   ${signup.cause}`}
          </pre>
        </Section>

        <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-300">
          Paste back <b>everything</b> on this page — especially the two &quot;Raw fetch&quot;
          statuses and any red error text. That tells us whether it&apos;s a network/DNS issue
          or an auth-config issue.
        </p>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">{title}</p>
      {children}
    </div>
  );
}
