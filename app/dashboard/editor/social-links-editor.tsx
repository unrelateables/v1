"use client";

import { useState } from "react";
import { SOCIAL_PLATFORMS, getSocialPlatform } from "@/lib/social-icons";
import type { SocialLink } from "@/lib/types";
import { clsx } from "@/lib/utils";

export function SocialLinksEditor({
  value,
  onChange,
}: {
  value: SocialLink[];
  onChange: (v: SocialLink[]) => void;
}) {
  const [adding, setAdding] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  const usedPlatforms = new Set(value.map((s) => s.platform));
  const available = SOCIAL_PLATFORMS.filter((p) => !usedPlatforms.has(p.id));

  function add() {
    if (!adding || !url.trim()) return;
    onChange([...value, { platform: adding, url: url.trim() }]);
    setAdding(null);
    setUrl("");
  }

  function remove(platform: string) {
    onChange(value.filter((s) => s.platform !== platform));
  }

  function updateUrl(platform: string, newUrl: string) {
    onChange(value.map((s) => (s.platform === platform ? { ...s, url: newUrl } : s)));
  }

  return (
    <div className="space-y-3">
      {/* Current social links */}
      {value.map((sl) => {
        const p = getSocialPlatform(sl.platform);
        if (!p) return null;
        return (
          <div
            key={sl.platform}
            className="flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-2"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 fill-current" style={{ color: p.color }}>
              <path d={p.path} />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-neutral-500">{p.label}</p>
              <input
                type="url"
                value={sl.url}
                onChange={(e) => updateUrl(sl.platform, e.target.value)}
                className="w-full bg-transparent text-xs text-white outline-none"
                placeholder="https://..."
              />
            </div>
            <button
              type="button"
              onClick={() => remove(sl.platform)}
              className="rounded-full px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/10"
            >
              remove
            </button>
          </div>
        );
      })}

      {/* Add new social link */}
      {adding ? (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-xs text-neutral-400">
            Adding: {getSocialPlatform(adding)?.label}
          </p>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-white/30"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={add}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setAdding(null); setUrl(""); }}
              className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-neutral-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : available.length > 0 ? (
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-wide text-neutral-500">
            Add social link
          </p>
          <div className="flex flex-wrap gap-1.5">
            {available.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setAdding(p.id)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-neutral-400 transition hover:bg-white/5 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" style={{ color: p.color }}>
                  <path d={p.path} />
                </svg>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
