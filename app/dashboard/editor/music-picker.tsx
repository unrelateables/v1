"use client";

import { useState } from "react";
import { MUSIC_PRESETS } from "@/lib/music-presets";
import { uploadAudioAction } from "./actions";
import { clsx } from "@/lib/utils";

export function MusicPicker({
  value,
  onPick,
}: {
  value: string | null;
  onPick: (url: string | null) => void;
}) {
  const [mode, setMode] = useState<"presets" | "upload" | "url">(
    value && !MUSIC_PRESETS.some((p) => p.url === value) ? "url" : "presets"
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  const activePreset = MUSIC_PRESETS.find((p) => p.url === value);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadAudioAction(fd);
    setUploading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result?.url) {
      onPick(result.url);
    }
  }

  return (
    <div>
      {/* Mode tabs */}
      <div className="mb-3 flex gap-1.5">
        {([
          ["presets", "Library"],
          ["upload", "Upload"],
          ["url", "Link"],
        ] as const).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs transition",
              mode === m
                ? "bg-neutral-100 text-black"
                : "bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Preset library */}
      {mode === "presets" && (
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_PRESETS.map((track) => {
            const active = value === track.url;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => onPick(active ? null : track.url)}
                className={clsx(
                  "flex flex-col items-start gap-0.5 rounded-2xl border p-3 text-left transition",
                  active
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                )}
              >
                <span className="text-base">{track.mood === "Upbeat" ? " upbeat" : track.mood === "Retro" ? " retro" : track.mood === "Calm" ? " calm" : track.mood === "Melancholy" ? " rain" : track.mood === "Mysterious" ? " dark" : " lofi"}</span>
                <span className="text-xs font-medium text-neutral-200">
                  {track.title}
                </span>
                <span className="text-[10px] text-neutral-500">
                  {track.mood}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Upload */}
      {mode === "upload" && (
        <div>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 transition hover:bg-white/5">
            {uploading ? (
              <span className="text-xs text-neutral-400">Uploading...</span>
            ) : (
              <>
                <span className="text-2xl">🎵</span>
                <span className="text-xs text-neutral-400">
                  Click to upload an audio file
                </span>
                <span className="text-[10px] text-neutral-600">
                  MP3, WAV, OGG — max 10MB
                </span>
              </>
            )}
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
        </div>
      )}

      {/* URL */}
      {mode === "url" && (
        <input
          type="url"
          value={
            activePreset ? "" : value || ""
          }
          onChange={(e) => onPick(e.target.value || null)}
          placeholder="https://example.com/song.mp3"
          className="w-full rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-white/30"
        />
      )}

      {/* Currently selected */}
      {value && (
        <div className="mt-3 flex items-center justify-between rounded-full bg-white/[0.04] px-3 py-2">
          <span className="truncate text-xs text-neutral-400">
            {activePreset
              ? `${activePreset.title}`
              : value.startsWith("blob:") || value.length > 60
              ? "Custom audio"
              : value}
          </span>
          <button
            type="button"
            onClick={() => onPick(null)}
            className="ml-2 shrink-0 text-xs text-neutral-500 hover:text-red-400"
          >
            remove
          </button>
        </div>
      )}
    </div>
  );
}
