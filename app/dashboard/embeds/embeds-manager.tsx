"use client";

import { createEmbedAction, deleteEmbedAction } from "./actions";
import { Button, Input, Label } from "@/components/ui";
import type { Embed } from "@/lib/types";
import { useState } from "react";

const PROVIDERS = [
  { value: "youtube", label: "YouTube" },
  { value: "spotify", label: "Spotify" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "custom", label: "Custom iframe URL" },
] as const;

export function EmbedsManager({ embeds }: { embeds: Embed[] }) {
  const [provider, setProvider] =
    useState<(typeof PROVIDERS)[number]["value"]>("youtube");
  const [msg, setMsg] = useState<string | null>(null);

  async function onCreate(formData: FormData) {
    formData.set("provider", provider);
    const res = await createEmbedAction(formData);
    if (res?.error) {
      setMsg(res.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {msg}
        </div>
      )}

      <div className="space-y-2">
        {embeds.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-neutral-500">
            No embeds yet.
          </p>
        )}
        {embeds.map((embed) => (
          <form
            key={embed.id}
            action={deleteEmbedAction}
            className="glass flex items-center justify-between rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-white/5 px-2 py-1 text-xs uppercase text-neutral-400">
                {embed.provider}
              </span>
              <span className="truncate text-sm text-neutral-300">{embed.embed_id}</span>
            </div>
            <input type="hidden" name="id" value={embed.id} />
            <button
              type="submit"
              className="rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
            >
              Delete
            </button>
          </form>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-medium">Add an embed</h2>
        <form action={onCreate} className="space-y-4">
          <div>
            <Label>Provider</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProvider(p.value)}
                  className={`rounded-xl border px-2 py-2 text-xs transition ${
                    provider === p.value
                      ? "border-accent bg-accent/10 text-white"
                      : "border-white/10 text-neutral-400 hover:bg-white/5"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder={
                provider === "youtube"
                  ? "https://youtube.com/watch?v=..."
                  : provider === "spotify"
                  ? "https://open.spotify.com/track/..."
                  : provider === "soundcloud"
                  ? "https://soundcloud.com/..."
                  : "https://example.com/embed"
              }
              required
            />
          </div>
          <Button type="submit">Add embed</Button>
        </form>
      </div>
    </div>
  );
}
