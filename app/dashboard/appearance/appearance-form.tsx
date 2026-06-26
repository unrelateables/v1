"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { updateAppearanceAction } from "./actions";
import { Button, Input, Label } from "@/components/ui";
import { clsx } from "@/lib/utils";
import { TemplatePicker } from "./template-picker";
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
      {state?.error && <Msg tone="error">{state.error}</Msg>}
      {state?.success && <Msg tone="ok">Saved.</Msg>}

      <Section title="Templates">
        <TemplatePicker active={settings.template} />
      </Section>

      <Section title="Background">
        <input type="hidden" name="bg_type" value={bgType} />
        <div className="mb-4 grid grid-cols-4 gap-2">
          {BG_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setBgType(t.value)}
              className={clsx(
                "rounded-lg border px-3 py-2 text-xs transition",
                bgType === t.value
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/10 text-neutral-400 hover:bg-white/5"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Label htmlFor="bg_value">
          {bgType === "gradient"
            ? "gradient (css)"
            : bgType === "image" || bgType === "video"
            ? "url (hotlinked)"
            : "color (hex)"}
        </Label>
        <Input
          id="bg_value"
          name="bg_value"
          defaultValue={settings.bg_value || ""}
          placeholder={bgPlaceholder}
        />
        <Label htmlFor="bg_overlay">overlay darkness: {settings.bg_overlay}%</Label>
        <input
          type="range"
          id="bg_overlay"
          name="bg_overlay"
          min={0}
          max={100}
          defaultValue={settings.bg_overlay}
          className="w-full accent-white"
        />
      </Section>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accent_color">accent</Label>
            <Input id="accent_color" name="accent_color" type="color" defaultValue={settings.accent_color} className="h-11 p-1" />
          </div>
          <div>
            <Label htmlFor="text_color">text</Label>
            <Input id="text_color" name="text_color" type="color" defaultValue={settings.text_color} className="h-11 p-1" />
          </div>
        </div>
      </Section>

      <Section title="Layout">
        <Label>layout</Label>
        <SelectRow name="layout" value={settings.layout} options={[["centered","Centered"],["left","Left-aligned"],["card","Card"]]} />
        <Label>text alignment</Label>
        <SelectRow name="text_align" value={settings.text_align} options={[["center","Center"],["left","Left"]]} />
        <Label>links layout</Label>
        <SelectRow name="link_layout" value={settings.link_layout} options={[["list","List"],["grid","Grid (2-col)"]]} />
        <Label>font family</Label>
        <SelectRow name="font_family" value={settings.font_family} options={[["sans","Sans"],["mono","Mono"],["serif","Serif"],["display","Display"]]} />
        <Label>corner radius</Label>
        <SelectRow name="radius" value={settings.radius} options={[["none","Sharp"],["sm","Small"],["md","Medium"],["lg","Large"],["xl","Extra"],["full","Pill"]]} />
      </Section>

      <Section title="Avatar & name">
        <Label>avatar shape</Label>
        <SelectRow name="avatar_shape" value={settings.avatar_shape} options={[["circle","Circle"],["square","Square"],["rounded","Rounded"]]} />
        <Label>name size</Label>
        <SelectRow name="name_size" value={settings.name_size} options={[["sm","Small"],["md","Medium"],["lg","Large"],["xl","Extra large"]]} />
        <Toggle name="typing_effect" label="Typing effect on name" defaultChecked={settings.typing_effect} />
      </Section>

      <Section title="Buttons">
        <Label>button style</Label>
        <SelectRow name="button_style" value={settings.button_style} options={[["glass","Glass"],["filled","Filled"],["outline","Outline"],["minimal","Minimal"]]} />
        <Label>button size</Label>
        <SelectRow name="button_size" value={settings.button_size} options={[["sm","Small"],["md","Medium"],["lg","Large"]]} />
        <Toggle name="glassmorphism" label="Glassmorphism (blur)" defaultChecked={settings.glassmorphism} />
      </Section>

      <Section title="Visual effects">
        <Label>particles</Label>
        <select
          name="particles"
          defaultValue={settings.effects.particles}
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none focus:border-white/25"
        >
          <option value="none">None</option>
          <option value="stars">Stars</option>
          <option value="hearts">Hearts</option>
        </select>
        <Toggle name="snow" label="Snow" defaultChecked={settings.effects.snow} />
        <Toggle name="rain" label="Rain" defaultChecked={settings.effects.rain} />
      </Section>

      <Section title="Music / audio">
        <Label htmlFor="audio_url">audio url (hotlinked)</Label>
        <Input id="audio_url" name="audio_url" type="url" defaultValue={settings.audio_url || ""} placeholder="https://...mp3" />
        <div className="mt-3">
          <Toggle name="audio_autoplay" label="Attempt autoplay" defaultChecked={settings.audio_autoplay} />
        </div>
      </Section>

      <Section title="Extra">
        <Toggle name="show_views" label="Show view counter" defaultChecked={settings.show_views} />
        <Toggle name="show_footer" label="Show 'made with biolink' footer" defaultChecked={settings.show_footer} />
        <Label htmlFor="custom_css">custom css (advanced)</Label>
        <textarea
          id="custom_css"
          name="custom_css"
          defaultValue={settings.custom_css || ""}
          rows={4}
          placeholder="a { text-decoration: underline; }"
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-white placeholder:text-neutral-600 outline-none focus:border-white/25"
        />
        <p className="mt-1 text-[11px] text-neutral-600">
          Scoped under your page root. Use at your own risk.
        </p>
      </Section>

      <Section title="Visibility">
        <Toggle name="is_public" label="Page is public" defaultChecked={settings.is_public} />
      </Section>

      <Button type="submit" className="w-full">
        Save appearance
      </Button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Msg({ tone, children }: { tone: "error" | "ok"; children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "rounded-lg border px-4 py-2.5 text-sm",
        tone === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      )}
    >
      {children}
    </div>
  );
}

function SelectRow({
  name,
  value,
  options,
}: {
  name: string;
  value: string;
  options: [string, string][];
}) {
  return (
    <select
      name={name}
      defaultValue={value}
      className="mb-4 w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none focus:border-white/25"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
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
    <label className="mb-2 flex cursor-pointer items-center justify-between">
      <span className="text-sm text-neutral-300">{label}</span>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-white" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
