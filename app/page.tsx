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
    <main className="relative min-h-screen">
      {/* thin top accent line instead of a glow blob */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* nav */}
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-mono text-sm text-neutral-200">
          biolink
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/leaderboard"
            className="text-neutral-500 transition hover:text-neutral-200"
          >
            leaderboard
          </Link>
          <Link
            href="/login"
            className="text-neutral-500 transition hover:text-neutral-200"
          >
            log in
          </Link>
          <Link href="/signup" className="text-neutral-200 underline-offset-4 hover:underline">
            sign up
          </Link>
        </nav>
      </header>

      {/* hero — asymmetric: text wide, preview nudged right and slightly down */}
      <section className="mx-auto max-w-3xl px-6 pt-16">
        <div className="grid items-start gap-10 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-xs text-neutral-600">{"// v1 · free, no tiers"}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              A page for your links.
              <br />
              <span className="text-neutral-500">That&apos;s the whole thing.</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-400">
              Pick a background, add your links, maybe some music. It&apos;s your
              page. No watered-down free plan, nothing to unlock later.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/signup">
                <Button className="px-5 py-2.5 text-sm">Make yours →</Button>
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm text-neutral-500 underline-offset-4 transition hover:text-neutral-200 hover:underline"
              >
                who&apos;s on here?
              </Link>
            </div>
          </div>

          {/* preview, pulled to the right, overlaps slightly on large screens */}
          <div className="sm:mt-8 sm:translate-x-4">
            <ProfilePreview />
          </div>
        </div>
      </section>

      {/* what you can do — a plain list, not a card grid */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-xs text-neutral-600">{"// what's inside"}</p>
        <ul className="mt-5 space-y-3 text-[15px] text-neutral-300">
          <li className="flex gap-3">
            <span className="select-none text-neutral-600">—</span>
            <span>
              Backgrounds: solid, gradient, an image, or a looping video clip.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="select-none text-neutral-600">—</span>
            <span>
              Effects and a music player. Stars, snow, glassy cards — turn them
              on or leave them off.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="select-none text-neutral-600">—</span>
            <span>
              A view counter and per-link clicks, so you can tell what&apos;s
              working.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="select-none text-neutral-600">—</span>
            <span>
              YouTube, Spotify and SoundCloud embeds if you want them.
            </span>
          </li>
        </ul>
      </section>

      {/* closing line + footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-neutral-600">
            free forever · made solo
          </p>
          <div className="flex gap-5 text-sm text-neutral-500">
            <Link href="/signup" className="hover:text-neutral-200">
              sign up
            </Link>
            <Link href="/login" className="hover:text-neutral-200">
              log in
            </Link>
            <Link href="/leaderboard" className="hover:text-neutral-200">
              leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
