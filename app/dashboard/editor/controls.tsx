"use client";

import { clsx } from "@/lib/utils";
import { MusicPicker } from "./music-picker";
import type {
  BgType,
  Layout,
  FontFamily,
  Radius,
  ButtonStyle,
  ButtonSize,
  NameSize,
  AvatarShape,
  LinkLayout,
  ProfileSettings,
} from "@/lib/types";

/* Reusable pill selector (no <select> dropdowns) */
export function PillSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs transition",
              value === o.value
                ? "bg-neutral-100 text-black"
                : "bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08]"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Color picker + hex input */
export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-full border border-white/10 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-white/30"
        />
      </div>
    </div>
  );
}

/* Range slider */
export function RangeSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">
          {label}
        </p>
        <span className="font-mono text-[11px] text-neutral-400">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-neutral-100"
      />
    </div>
  );
}

/* Toggle switch */
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-xs text-neutral-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-neutral-100" : "bg-white/10"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-neutral-900 transition",
            checked ? "left-[1.375rem]" : "left-0.5"
          )}
        />
      </button>
    </label>
  );
}

/* Section wrapper */
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* Exported option arrays for convenience */
export const BG_TYPES: { value: BgType; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
  { value: "gif", label: "GIF" },
  { value: "video", label: "Video" },
];

export const LAYOUT_OPTIONS: { value: Layout; label: string }[] = [
  { value: "centered", label: "Center" },
  { value: "left", label: "Left" },
];

export const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "sans", label: "Sans" },
  { value: "mono", label: "Mono" },
  { value: "serif", label: "Serif" },
  { value: "display", label: "Display" },
];

export const RADIUS_OPTIONS: { value: Radius; label: string }[] = [
  { value: "none", label: "Sharp" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "full", label: "Pill" },
];

export const BUTTON_STYLE_OPTIONS: { value: ButtonStyle; label: string }[] = [
  { value: "glass", label: "Glass" },
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
  { value: "minimal", label: "Minimal" },
];

export const BUTTON_SIZE_OPTIONS: { value: ButtonSize; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
];

export const NAME_SIZE_OPTIONS: { value: NameSize; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
];

export const AVATAR_OPTIONS: { value: AvatarShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
];

export const LINK_LAYOUT_OPTIONS: { value: LinkLayout; label: string }[] = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
];

/* Main controls wrapper used by the live editor */
export function Controls({
  state,
  patch,
}: {
  state: ProfileSettings;
  patch: (p: Partial<ProfileSettings>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Background */}
      <Section title="background">
        <PillSelect
          label="Type"
          value={state.bg_type}
          options={BG_TYPES}
          onChange={(v) => patch({ bg_type: v })}
        />
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-neutral-500">
            {state.bg_type === "gradient"
              ? "Gradient CSS"
              : state.bg_type === "image" || state.bg_type === "video"
              ? "URL"
              : "Color"}
          </p>
          <input
            type="text"
            value={state.bg_value || ""}
            onChange={(e) => patch({ bg_value: e.target.value })}
            placeholder={
              state.bg_type === "gradient"
                ? "linear-gradient(135deg,#6366f1,#ec4899)"
                : state.bg_type === "solid"
                ? "#0a0a0a"
                : "https://..."
            }
            className="w-full rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-white/30"
          />
        </div>
        <RangeSlider
          label="Overlay darkness"
          value={state.bg_overlay ?? 30}
          min={0}
          max={100}
          onChange={(v) => patch({ bg_overlay: v })}
        />
      </Section>

      {/* Colors */}
      <Section title="colors">
        <div className="grid grid-cols-2 gap-3">
          <ColorPicker
            label="Accent"
            value={state.accent_color}
            onChange={(v) => patch({ accent_color: v })}
          />
          <ColorPicker
            label="Text"
            value={state.text_color}
            onChange={(v) => patch({ text_color: v })}
          />
        </div>
      </Section>

      {/* Layout */}
      <Section title="layout">
        <PillSelect
          label="Alignment"
          value={state.layout}
          options={LAYOUT_OPTIONS}
          onChange={(v) => patch({ layout: v })}
        />
        <PillSelect
          label="Link layout"
          value={state.link_layout}
          options={LINK_LAYOUT_OPTIONS}
          onChange={(v) => patch({ link_layout: v })}
        />
      </Section>

      {/* Typography */}
      <Section title="typography">
        <PillSelect
          label="Font"
          value={state.font_family}
          options={FONT_OPTIONS}
          onChange={(v) => patch({ font_family: v })}
        />
        <PillSelect
          label="Name size"
          value={state.name_size}
          options={NAME_SIZE_OPTIONS}
          onChange={(v) => patch({ name_size: v })}
        />
      </Section>

      {/* Buttons */}
      <Section title="buttons">
        <PillSelect
          label="Style"
          value={state.button_style}
          options={BUTTON_STYLE_OPTIONS}
          onChange={(v) => patch({ button_style: v })}
        />
        <PillSelect
          label="Size"
          value={state.button_size}
          options={BUTTON_SIZE_OPTIONS}
          onChange={(v) => patch({ button_size: v })}
        />
        <PillSelect
          label="Corner radius"
          value={state.radius}
          options={RADIUS_OPTIONS}
          onChange={(v) => patch({ radius: v })}
        />
      </Section>

      {/* Avatar */}
      <Section title="avatar">
        <PillSelect
          label="Shape"
          value={state.avatar_shape}
          options={AVATAR_OPTIONS}
          onChange={(v) => patch({ avatar_shape: v })}
        />
      </Section>

      {/* Effects */}
      <Section title="effects">
        <PillSelect
          label="Particles"
          value={state.effects.particles}
          options={[
            { value: "none" as const, label: "None" },
            { value: "stars" as const, label: "Stars" },
            { value: "hearts" as const, label: "Hearts" },
          ]}
          onChange={(v) =>
            patch({ effects: { ...state.effects, particles: v } })
          }
        />
        <Toggle
          label="Snow"
          checked={state.effects.snow}
          onChange={(v) => patch({ effects: { ...state.effects, snow: v } })}
        />
        <Toggle
          label="Rain"
          checked={state.effects.rain}
          onChange={(v) => patch({ effects: { ...state.effects, rain: v } })}
        />
        <Toggle
          label="Glassmorphism"
          checked={state.glassmorphism}
          onChange={(v) => patch({ glassmorphism: v })}
        />
        <Toggle
          label="Typing effect"
          checked={state.typing_effect}
          onChange={(v) => patch({ typing_effect: v })}
        />
      </Section>

      {/* Extras */}
      <Section title="extras">
        <Toggle
          label="Show view count"
          checked={state.show_views}
          onChange={(v) => patch({ show_views: v })}
        />
        <Toggle
          label="Show footer"
          checked={state.show_footer}
          onChange={(v) => patch({ show_footer: v })}
        />
        <Toggle
          label="Page is public"
          checked={state.is_public}
          onChange={(v) => patch({ is_public: v })}
        />
      </Section>

      {/* Music */}
      <Section title="music">
        <MusicPicker
          value={state.audio_url}
          onPick={(url) => patch({ audio_url: url })}
        />
        <Toggle
          label="Autoplay"
          checked={state.audio_autoplay}
          onChange={(v) => patch({ audio_autoplay: v })}
        />
      </Section>
    </div>
  );
}
