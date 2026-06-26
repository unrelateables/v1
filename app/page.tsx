import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { redirect } from "next/navigation";
import { ProfilePreview } from "@/components/profile-preview";

export default async function Landing() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* single, restrained background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]" />
      </div>

      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm text-black">
            b
          </span>
          biolink
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/leaderboard"
            className="text-neutral-400 transition hover:text-white"
          >
            Leaderboard
          </Link>
          <Link
            href="/login"
            className="text-neutral-400 transition hover:text-white"
          >
            Log in
          </Link>
          <Link href="/signup">
            <Button className="px-4 py-2 text-sm">Sign up</Button>
          </Link>
        </nav>
      </header>

      {/* hero — left copy, right preview */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-2 lg:pt-20">
        <div className="animate-fade-in">
          <p className="mb-5 text-sm font-medium text-neutral-400">
            a tiny corner of the internet, yours to decorate.
          </p>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            One page.
            <br />
            All your links.
            <br />
            <span className="text-neutral-500">No clutter.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-400">
            Drop a background, pick some effects, add your music, and you&apos;ve
            got a page that looks like you built it — because you did. Free,
            forever, no premium tiers lurking.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Link href="/signup">
              <Button className="px-6 py-3 text-sm font-semibold">
                Get your page
              </Button>
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm text-neutral-400 underline-offset-4 transition hover:text-white hover:underline"
            >
              or peek at the leaderboard →
            </Link>
          </div>

          {/* inline stats, factual */}
          <div className="mt-10 flex gap-8">
            <Stat label="price" value="$0" />
            <Stat label="setup" value="2 min" />
            <Stat label="catch" value="none" />
          </div>
        </div>

        {/* real product preview */}
        <div className="flex justify-center lg:justify-end">
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <ProfilePreview />
          </div>
        </div>
      </section>

      {/* features — prose, not pills */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
          <Feature
            title="Backgrounds that move"
            body="Solid colors, gradients, a still image, or a looping video. Your call."
          />
          <Feature
            title="Effects & music"
            body="Stars, snow, glassy cards, and a music player. Toggle what you like."
          />
          <Feature
            title="See who's looking"
            body="A view counter and per-link clicks, so you know what lands."
          />
        </div>
      </section>

      {/* footer, signed */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>built on a slow afternoon — hope you like it.</p>
          <div className="flex gap-5">
            <Link href="/signup" className="hover:text-white">
              Sign up
            </Link>
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
            <Link href="/leaderboard" className="hover:text-white">
              Leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-bold tracking-tight text-white">{value}</p>
      <p className="text-xs uppercase tracking-wide text-neutral-600">{label}</p>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-[#0a0a0f] p-7">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{body}</p>
    </div>
  );
}
