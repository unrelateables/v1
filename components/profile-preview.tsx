// An embedded preview of a real-looking biolink profile.
// Designed to read like a screenshot pasted into the page, not a marketing mockup.

export function ProfilePreview() {
  const links = [
    { label: "portfolio", tag: "/work" },
    { label: "twitter", tag: "@maya" },
    { label: "github", tag: "/maya-dev" },
    { label: "discord", tag: "mayas server" },
  ];

  return (
    <div className="w-full max-w-[17rem]">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11] shadow-xl shadow-black/40">
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <span className="ml-2 truncate font-mono text-[10px] text-neutral-600">
            yoursite.com/maya
          </span>
        </div>

        <div className="px-5 py-7">
          {/* avatar + identity */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-neutral-800 text-base font-semibold text-neutral-300">
              M
            </div>
            <p className="font-display mt-2.5 text-[15px] text-white">maya</p>
            <p className="font-mono text-[10px] text-neutral-600">@maya</p>
            <p className="mt-1.5 max-w-[12rem] text-[11px] leading-snug text-neutral-500">
              designer, occasional ghost online
            </p>
          </div>

          {/* link rows */}
          <div className="mt-5 space-y-1.5">
            {links.map((l) => (
              <div
                key={l.label}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <span className="text-[11px] font-medium text-neutral-300">
                  {l.label}
                </span>
                <span className="font-mono text-[10px] text-neutral-600">
                  {l.tag}
                </span>
              </div>
            ))}
          </div>

          {/* view count footer */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-neutral-600">
            <span className="h-1 w-1 rounded-full bg-emerald-500/60" />
            <span className="font-mono">412 views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
