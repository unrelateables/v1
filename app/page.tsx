import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { redirect } from "next/navigation";
import { Bubbles } from "@/components/bubbles";

export default async function Landing() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* colorful bubbly backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-600/40 blur-[120px]" />
        <div className="absolute bottom-0 right-10 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/30 blur-[120px]" />
        <div className="absolute left-0 top-1/3 h-[24rem] w-[24rem] rounded-full bg-cyan-500/25 blur-[120px]" />
      </div>
      <Bubbles />

      <div className="flex flex-col items-center">
        {/* wiggly logo */}
        <div className="pop-in mb-8">
          <div className="wiggle flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-4xl font-black shadow-2xl shadow-fuchsia-500/40">
            b
          </div>
        </div>

        {/* headline */}
        <div
          className="pop-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="mb-5 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-fuchsia-300 backdrop-blur">
            ✦ free forever ✦
          </span>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
            your link,
            <br />
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              your whole vibe
            </span>{" "}
            🫧
          </h1>
        </div>

        <p
          className="pop-in mt-6 max-w-lg text-lg text-neutral-300/90"
          style={{ animationDelay: "0.2s" }}
        >
          Splashy backgrounds, sparkly effects, your own music, and a page
          that&apos;s 100% <span className="text-cyan-300">you</span>. Build it
          in seconds — totally free.
        </p>

        {/* CTAs */}
        <div
          className="pop-in mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href="/signup">
            <Button className="px-7 py-3.5 text-base font-bold shadow-lg shadow-fuchsia-500/30">
              🚀 Claim your page
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline" className="px-7 py-3.5 text-base">
              🏆 See the leaderboard
            </Button>
          </Link>
        </div>

        {/* feature pills */}
        <div
          className="pop-in mt-10 flex flex-wrap items-center justify-center gap-2.5"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { e: "🎨", t: "Themes" },
            { e: "✨", t: "Effects" },
            { e: "🎵", t: "Music" },
            { e: "📊", t: "Analytics" },
            { e: "🖼️", t: "Embeds" },
            { e: "👑", t: "Badges" },
          ].map((f) => (
            <span
              key={f.t}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-neutral-200 backdrop-blur transition hover:scale-105 hover:border-white/20"
            >
              <span aria-hidden>{f.e}</span>
              {f.t}
            </span>
          ))}
        </div>

        <p
          className="pop-in mt-12 text-xs text-neutral-500"
          style={{ animationDelay: "0.5s" }}
        >
          no paid features · free hosting · open to everyone · made with 💜
        </p>
      </div>
    </main>
  );
}
