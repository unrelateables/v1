import { Reveal } from "@/components/reveal";

/**
 * Visual showcase: mini profile cards rendered in different themes,
 * so visitors SEE the customization instead of reading about it.
 */

const THEMES = [
  {
    id: "gradient",
    label: "Gradients",
    bg: "linear-gradient(135deg,#6366f1,#ec4899)",
    avatar: "linear-gradient(135deg,#fbbf24,#f472b6)",
    handle: "kira",
  },
  {
    id: "dark",
    label: "Dark video",
    bg: "linear-gradient(135deg,#0f172a,#000000)",
    avatar: "linear-gradient(135deg,#22d3ee,#3b82f6)",
    handle: "noctis",
  },
  {
    id: "warm",
    label: "Sunset",
    bg: "linear-gradient(135deg,#fb7185,#f59e0b)",
    avatar: "linear-gradient(135deg,#fcd34d,#fb923c)",
    handle: "sora",
  },
];

const EFFECTS = [
  { emoji: "✦", label: "Stars", desc: "drift across the screen" },
  { emoji: "❄", label: "Snow", desc: "soft falling particles" },
  { emoji: "♪", label: "Music", desc: "your track, looping" },
  { emoji: "▶", label: "Embeds", desc: "YouTube & Spotify" },
];

export function FeatureShowcase() {
  return (
    <>
      {/* Theme variety — three mini profile cards */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Reveal>
          <p className="font-mono text-xs text-neutral-600">{"// themes"}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Make it unmistakably yours
          </h2>
          <p className="mt-2 text-[15px] text-neutral-400">
            Every page is fully themeable. Solid colors, gradients, images, or a
            looping video — pick a vibe and go.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {THEMES.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <MiniProfile
                bg={t.bg}
                avatar={t.avatar}
                name={t.handle}
                label={t.label}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Effects & extras — icon list with visuals */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Reveal>
          <p className="font-mono text-xs text-neutral-600">{"// extras"}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Then add the details
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EFFECTS.map((e, i) => (
            <Reveal key={e.label} delay={i * 80}>
              <div className="glass rounded-2xl p-5 text-center transition-transform duration-200 hover:-translate-y-1">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-lg">
                  {e.emoji}
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{e.label}</p>
                <p className="mt-1 text-xs text-neutral-500">{e.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

function MiniProfile({
  bg,
  avatar,
  name,
  label,
}: {
  bg: string;
  avatar: string;
  name: string;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/30">
      {/* label tag */}
      <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-3 py-2">
        <span className="font-mono text-[10px] text-neutral-500">@{name}</span>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-neutral-400">
          {label}
        </span>
      </div>

      {/* themed card body */}
      <div
        className="flex flex-col items-center px-4 py-6 text-center"
        style={{ background: bg }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
          style={{ background: avatar }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 text-xs font-semibold text-white">{name}</p>
        <div className="mt-4 w-full space-y-1.5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-lg bg-white/15 py-1.5 backdrop-blur-sm"
            >
              <div className="mx-auto h-1 w-16 rounded-full bg-white/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
