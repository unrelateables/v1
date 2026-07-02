"use client";

import type { SocialLink } from "@/lib/types";
import { getSocialPlatform } from "@/lib/social-icons";

export function SocialIcons({
  links,
  accent,
}: {
  links: SocialLink[];
  accent: string;
}) {
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {links.map((sl) => {
        const platform = getSocialPlatform(sl.platform);
        if (!platform) return null;
        return (
          <a
            key={sl.platform}
            href={sl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            title={platform.label}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current transition-transform group-hover:scale-110"
              style={{ color: platform.color }}
            >
              <path d={platform.path} />
            </svg>
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-150 group-hover:opacity-100">
              {platform.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
