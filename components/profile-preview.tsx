// A static, self-contained preview of a biolink profile card.
// Shown on the landing page so visitors see the real product, not hype.

export function ProfilePreview() {
  return (
    <div className="relative w-full max-w-xs">
      {/* glow behind card */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d0b14] shadow-2xl shadow-black/50">
        {/* faux browser top */}
        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 truncate text-[10px] text-neutral-500">
            biolink.app/maya
          </span>
        </div>

        {/* card body */}
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-xl font-bold text-white">
            M
          </div>
          <p className="mt-3 text-sm font-semibold text-white">Maya</p>
          <p className="text-[11px] text-neutral-500">@maya</p>

          <div className="mt-3 flex gap-1.5">
            <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[9px] font-medium text-indigo-300">
              👑 owner
            </span>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
            designer &amp; part-time ghost 👻
          </p>

          <div className="mt-5 w-full space-y-2">
            {["website", "twitter", "github", "discord"].map((t) => (
              <div
                key={t}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] py-2 text-[11px] font-medium capitalize text-neutral-300"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
