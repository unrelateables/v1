import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { redirect } from "next/navigation";
import { ProfilePreview } from "@/components/profile-preview";
import { Spotlight } from "@/components/spotlight";
import { Reveal } from "@/components/reveal";

export default async function Landing() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  const features = [
    "Backgrounds: solid, gradient, an image, or a looping video clip.",
    "Effects and a music player. Stars, snow, glassy cards — turn them on or leave them off.",
    "A view counter and per-link clicks, so you can tell what's working.",
    "YouTube, Spotify and SoundCloud embeds if you want them.",
  ];

  return (
    <main className="relative min-h-screen">
      {/* mouse-follow spotlight + drifting grid backdrop */}
      <Spotlight />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" aria-hidden />

      {/* thin top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* nav */}
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-mono text-sm text-neutral-200">
          biolink
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/leaderboard"
            className="link-underline text-neutral-500 transition hover:text-neutral-200"
          >
            leaderboard
          </Link>
          <Link
            href="/login"
            className="link-underline text-neutral-500 transition hover:text-neutral-200"
          >
            log in
          </Link>
          <Link
            href="/signup"
            className="link-underline text-neutral-200"
          >
            sign up
          </Link>
        </nav>
      </header>

      {/* hero — asymmetric: text wide, preview nudged right and slightly down */}
      <section className="mx-auto max-w-3xl px-6 pt-16">
        <div className="grid items-start gap-10 sm:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="font-mono text-xs text-neutral-600">
                {"// v1 · free, no tiers"}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-4 text-[2.75rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                A page for your links.
                <br />
                <span className="font-normal text-neutral-500">
                  That&apos;s the whole thing.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-400">
                Pick a background, add your links, maybe some music. It&apos;s your
                page — no watered-down free plan, nothing to unlock later.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link href="/signup">
                  <Button className="px-5 py-2.5 text-sm transition-transform duration-200 hover:-translate-y-0.5">
                    Make yours →
                  </Button>
                </Link>
                <Link
                  href="/leaderboard"
                  className="link-underline text-sm text-neutral-500 transition hover:text-neutral-200"
                >
                  who&apos;s on here?
                </Link>
              </div>
            </Reveal>
          </div>

          {/* preview — floats gently */}
          <div className="sm:mt-8 sm:translate-x-4">
            <Reveal delay={200}>
              <div className="breathe">
                <ProfilePreview />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* what you can do — a plain list, not a card grid */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <p className="font-mono text-xs text-neutral-600">{"// what's inside"}</p>
        </Reveal>
        <ul className="mt-5 space-y-3 text-[15px] text-neutral-300">
          {features.map((f, i) => (
            <Reveal as="li" key={i} delay={i * 90} className="flex gap-3">
              <span className="select-none text-neutral-600">—</span>
              <span>{f}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* closing line + footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-neutral-600">
            free forever · made solo
          </p>
          <div className="flex gap-5 text-sm text-neutral-500">
            <Link href="/signup" className="link-underline">
              sign up
            </Link>
            <Link href="/login" className="link-underline">
              log in
            </Link>
            <Link href="/leaderboard" className="link-underline">
              leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
