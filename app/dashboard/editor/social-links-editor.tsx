"use client";

import { useState } from "react";
import { SOCIAL_PLATFORMS, getSocialPlatform } from "@/lib/social-icons";
import type { SocialLink } from "@/lib/types";

/** Returns true if url matches the platform's allowed domains. */
export function validateSocialUrl(platformId: string, rawUrl: string): { ok: boolean; error?: string } {
  const p = getSocialPlatform(platformId);
  if (!p) return { ok: false, error: "Unknown platform" };
  const url = rawUrl.trim();
  if (!url) return { ok: false, error: "URL is required" };

  // Crypto platforms accept plain wallet addresses too — allow anything
  if (p.category === "crypto") return { ok: true };

  // Must be http(s)
  if (!/^https?:\/\//i.test(url)) {
    return { ok: false, error: "Must start with https://" };
  }

  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (p.urlPattern && p.urlPattern.length > 0) {
    const match = p.urlPattern.some(
      (domain) => host === domain || host.endsWith("." + domain)
    );
    if (!match) {
      return {
        ok: false,
        error: `Must be a ${p.label} link (e.g. ${p.urlPattern[0]})`,
      };
    }
  }

  return { ok: true };
}

export function SocialLinksEditor({
  value,
  onChange,
}: {
  value: SocialLink[];
  onChange: (v: SocialLink[]) => void;
}) {
  const [adding, setAdding] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [urlErr, setUrlErr] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const usedPlatforms = new Set(value.map((s) => s.platform));
  const available = SOCIAL_PLATFORMS.filter((p) => !usedPlatforms.has(p.id));

  function add() {
    if (!adding || !url.trim()) return;
    const v = validateSocialUrl(adding, url);
    if (!v.ok) {
      setUrlErr(v.error || "Invalid URL");
      return;
    }
    onChange([...value, { platform: adding, url: url.trim() }]);
    setAdding(null);
    setUrl("");
    setUrlErr(null);
  }

  function remove(platform: string) {
    onChange(value.filter((s) => s.platform !== platform));
  }

  function updateUrl(platform: string, newUrl: string) {
    // Update value live
    onChange(value.map((s) => (s.platform === platform ? { ...s, url: newUrl } : s)));
    // Validate (clear error if empty — only validate on blur)
  }

  function validateField(platform: string, newUrl: string) {
    if (!newUrl.trim()) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[platform];
        return next;
      });
      return;
    }
    const v = validateSocialUrl(platform, newUrl);
    setFieldErrors((prev) => ({
      ...prev,
      [platform]: v.ok ? "" : v.error || "Invalid",
    }));
  }

  return (
    <div className="space-y-3">
      {/* Current social links */}
      {value.map((sl) => {
        const p = getSocialPlatform(sl.platform);
        if (!p) return null;
        const err = fieldErrors[sl.platform];
        return (
          <div
            key={sl.platform}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 fill-current" style={{ color: p.color }}>
                <path d={p.path} />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-neutral-500">
                  {p.label} {p.category === "crypto" && "· wallet / address"}
                </p>
                <input
                  type="text"
                  value={sl.url}
                  onChange={(e) => updateUrl(sl.platform, e.target.value)}
                  onBlur={(e) => validateField(sl.platform, e.target.value)}
                  className="w-full bg-transparent text-xs text-white outline-none"
                  placeholder={p.category === "crypto" ? "Wallet address or link" : "https://..."}
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
            {err && (
              <p className="mt-1 pl-8 text-[10px] text-red-400">{err}</p>
            )}
          </div>
        );
      })}

      {/* Add new social link */}
      {adding ? (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-xs text-neutral-400">
            Adding: {getSocialPlatform(adding)?.label}
            {getSocialPlatform(adding)?.urlPattern && (
              <span className="text-neutral-600">
                {" "}— must be from {getSocialPlatform(adding)!.urlPattern![0]}
              </span>
            )}
          </p>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setUrlErr(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder={getSocialPlatform(adding)?.category === "crypto" ? "Wallet address or link" : "https://..."}
            className="w-full rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-white/30"
            autoFocus
          />
          {urlErr && <p className="text-[10px] text-red-400">{urlErr}</p>}
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
              onClick={() => { setAdding(null); setUrl(""); setUrlErr(null); }}
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
