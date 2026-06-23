"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { updateAppearanceAction } from "./actions";
import { Button, Input, Label } from "@/components/ui";
import { clsx } from "@/lib/utils";
import type { BgType, ProfileSettings } from "@/lib/types";

const BG_TYPES: { value: BgType; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

export function AppearanceForm({ settings }: { settings: ProfileSettings }) {
  const [state, formAction] = useFormState(updateAppearanceAction, undefined);
  const [bgType, setBgType] = useState<BgType>(settings.bg_type);

  const bgPlaceholder =
    bgType === "gradient"
      ? "linear-gradient(135deg,#6366f1,#ec4899)"
      : bgType === "image"
      ? "https://...jpg"
      : bgType === "video"
      ? "https://...mp4"
      : "#0a0a0a";

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
          Saved.
        </div>
      )}

      {/* Background */}
      <Section title="Background">
        <input type="hidden" name="bg_type" value={bgType} />
        <div className="mb-4 grid grid-cols-4 gap-2">
          {BG_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setBgType(t.value)}
              className={clsx(
                "rounded-xl border px-3 py-2 text-xs transition",
                bgType === t.value
                  ? "border-accent bg-accent/10 text-white"
                  : "border-white/10 text-neutral-400 hover:bg-white/5"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Label htmlFor="bg_value">
          {bgType === "gradient"
            ? "Gradient (CSS)"
            : bgType === "image" || bgType === "video"
            ? "URL (hotlinked)"
            : "Color (hex)"}
        </Label>
        <Input
          id="bg_value"
          name="bg_value"
          defaultValue={settings.bg_value || ""}
          placeholder={bgPlaceholder}
        />
      </Section>

      {/* Colors */}
      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accent_color">Accent</Label>
            <Input
              id="accent_color"
              name="accent_color"
              type="color"
              defaultValue={settings.accent_color}
              className="h-11 p-1"
            />
          </div>
          <div>
            <Label htmlFor="text_color">Text</Label>
            <Input
              id="text_color"
              name="text_color"
              type="color"
              defaultValue={settings.text_color}
              className="h-11 p-1"
            />
          </div>
        </div>
      </Section>

      {/* Effects */}
      <Section title="Visual effects">
        <Label>Particles</Label>
        <select
          name="particles"
          defaultValue={settings.effects.particles}
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-accent/60"
        >
          <option value="none">None</option>
          <option value="stars">Stars</option>
          <option value="hearts">Hearts</option>
        </select>

        <div className="space-y-3">
          <Toggle name="snow" label="Snow" defaultChecked={settings.effects.snow} />
          <Toggle name="rain" label="Rain" defaultChecked={settings.effects.rain} />
          <Toggle name="glassmorphism" label="Glassmorphism (blur cards)" defaultChecked={settings.glassmorphism} />
          <Toggle name="typing_effect" label="Typing effect on display name" defaultChecked={settings.typing_effect} />
        </div>
      </Section>

      {/* Audio */}
      <Section title="Music / audio">
        <Label htmlFor="audio_url">Audio URL (hotlinked)</Label>
        <Input
          id="audio_url"
          name="audio_url"
          type="url"
          defaultValue={settings.audio_url || ""}
          placeholder="https://...mp3"
        />
        <div className="mt-3">
          <Toggle name="audio_autoplay" label="Attempt autoplay" defaultChecked={settings.audio_autoplay} />
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Browsers block autoplay with sound until the user interacts.
        </p>
      </Section>

      {/* Visibility */}
      <Section title="Visibility">
        <Toggle
          name="is_public"
          label="Page is public"
          defaultChecked={settings.is_public}
        />
        <p className="mt-2 text-xs text-neutral-500">
          When off, only you can view your page.
        </p>
      </Section>

      <Button type="submit" className="w-full">
        Save appearance
      </Button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="mb-4 text-sm font-medium">{title}</h2>
      {children}
    </div>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm text-neutral-300">{label}</span>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-accent" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
