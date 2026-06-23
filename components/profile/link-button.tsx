"use client";

import type { Link } from "@/lib/types";

export function LinkButton({
  link,
  accent,
  glass,
}: {
  link: Link;
  accent: string;
  glass: boolean;
}) {
  function trackClick() {
    try {
      fetch(`/api/clicks?link=${link.id}`, { method: "POST" }).catch(() => {});
    } catch {}
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all hover:-translate-y-0.5 ${
        glass ? "glass" : "bg-black/60 border border-white/10"
      }`}
      style={{ boxShadow: `0 8px 24px -12px ${accent}` }}
    >
      {link.icon && <span className="text-base">{link.icon}</span>}
      <span className="flex-1 text-center">{link.title}</span>
      <span
        className="opacity-0 transition group-hover:opacity-60"
        style={{ color: accent }}
      >
        ↗
      </span>
    </a>
  );
}
