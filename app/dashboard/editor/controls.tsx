"use client";

import { clsx } from "@/lib/utils";
import { useState, useRef } from "react";
import { MusicPicker } from "./music-picker";
import { SocialLinksEditor } from "./social-links-editor";
import { TEMPLATES } from "@/lib/templates";
import { uploadBackgroundAction } from "./actions";
import { Label, Input } from "@/components/ui";
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

interface FFmpegLike {
  load(opts: { coreURL: string; wasmURL: string }): Promise<void>;
  writeFile(name: string, data: Uint8Array): Promise<void>;
  exec(args: string[]): Promise<void>;
  readFile(name: string): Promise<Uint8Array | string>;
}

/* Background file uploader (image / gif / video)
   GIFs are auto-converted to crisp WebM video in-browser for HD quality. */
function BgUploader({
  bgType,
  onUploaded,
}: {
  bgType: BgType;
  onUploaded: (url: string, type: "image" | "video") => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadFFmpegWASM(): Promise<{ FFmpeg: new () => FFmpegLike } | undefined> {
    const w = window as unknown as { FFmpegWASM?: { FFmpeg: new () => FFmpegLike }; __ffmpegLoading?: Promise<void> };
    if (w.FFmpegWASM) return w.FFmpegWASM;

    if (!w.__ffmpegLoading) {
      w.__ffmpegLoading = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js";
        script.crossOrigin = "anonymous";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load ffmpeg"));
        document.head.appendChild(script);
      });
    }
    try {
      await w.__ffmpegLoading;
    } catch {
      return undefined;
    }
    return w.FFmpegWASM;
  }

  async function convertGifToWebM(file: File): Promise<File | null> {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const FFmpegWASM = await loadFFmpegWASM();
    if (!FFmpegWASM) throw new Error("ffmpeg not available");

    const ffmpeg = new FFmpegWASM.FFmpeg();
    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    const buf = await file.arrayBuffer();
    await ffmpeg.writeFile("input.gif", new Uint8Array(buf));
    await ffmpeg.exec([
      "-i", "input.gif",
      "-c:v", "libvpx-vp9",
      "-b:v", "0",
      "-crf", "35",
      "-row-mt", "1",
      "output.webm",
    ]);
    const data = (await ffmpeg.readFile("output.webm")) as Uint8Array;
    return new File([new Blob([data as BlobPart])], "converted.webm", { type: "video/webm" });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(false);

    // Auto-convert GIFs to crisp WebM video for HD quality
    let uploadFile = file;
    let fileType: "image" | "video" = bgType === "video" ? "video" : "image";

    if (file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")) {
      try {
        setConverting(true);
        const converted = await convertGifToWebM(file);
        setConverting(false);
        if (converted) {
          uploadFile = converted;
          fileType = "video";
        }
      } catch {
        setConverting(false);
        // If conversion fails, fall back to uploading the raw GIF
      }
    }

    setUploading(true);
    const fd = new FormData();
    fd.set("file", uploadFile);
    const result = await uploadBackgroundAction(fd);
    setUploading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result?.url) {
      onUploaded(result.url, result.type === "video" ? "video" : "image");
    }
  }

  const busy = uploading || converting;

  return (
    <div>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-white/15 bg-white/[0.02] px-4 py-2 text-xs text-neutral-400 transition hover:bg-white/5">
        {busy ? (
          <span>{converting ? "Converting GIF to HD video..." : "Uploading..."}</span>
        ) : (
          <>
            <span>📁</span>
            <span>Upload {bgType === "video" ? "video" : "file"}</span>
          </>
        )}
        <input
          type="file"
          className="hidden"
          onChange={handleFile}
          disabled={busy}
          accept={
            bgType === "video"
              ? "video/*"
              : "image/gif,image/png,image/jpeg,image/webp,image/*"
          }
        />
      </label>
      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

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
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/[0.02]"
      >
        <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-400">
          {title}
        </span>
        <span className={`text-neutral-500 transition-transform ${open ? "rotate-90" : ""}`}>
          {"\u203A"}
        </span>
      </button>
      {open && <div className="space-y-4 px-4 pb-4">{children}</div>}
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
  activeTemplate,
  onTemplate,
}: {
  state: ProfileSettings;
  patch: (p: Partial<ProfileSettings>) => void;
  activeTemplate: string;
  onTemplate: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Theme + background fused */}
      <Section title="theme & background">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-neutral-500">
          Quick themes
        </p>
        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TEMPLATES.map((t) => {
            const active = activeTemplate === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTemplate(t.id)}
                className={clsx(
                  "flex flex-col items-center gap-1 rounded-2xl border p-2.5 transition",
                  active
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                )}
                title={t.description}
              >
                <span
                  className="h-7 w-7 rounded-full"
                  style={{ background: t.swatch }}
                />
                <span className="text-[9px] text-neutral-400">{t.name}</span>
              </button>
            );
          })}
        </div>

        <PillSelect
          label="Background type"
          value={state.bg_type}
          options={BG_TYPES}
          onChange={(v) => patch({ bg_type: v })}
        />
        {(state.bg_type === "image" || state.bg_type === "gif" || state.bg_type === "video") && (
          <BgUploader
            bgType={state.bg_type}
            onUploaded={(url, type) => {
              patch({ bg_value: url, bg_type: type === "video" ? "video" : "image" });
            }}
          />
        )}
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-neutral-500">
            {state.bg_type === "gradient"
              ? "Gradient CSS"
              : state.bg_type === "image" || state.bg_type === "video" || state.bg_type === "gif"
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

      {/* Social Links */}
      <Section title="social links">
        <SocialLinksEditor
          value={state.social_links ?? []}
          onChange={(v) => patch({ social_links: v })}
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

      {/* Username effects */}
      <Section title="username effects">
        <PillSelect
          label="Effect"
          value={state.username_effect}
          options={[
            { value: "none" as const, label: "None" },
            { value: "typewriter" as const, label: "Type" },
            { value: "rainbow" as const, label: "Rainbow" },
            { value: "glitch" as const, label: "Glitch" },
            { value: "wave" as const, label: "Wave" },
          ]}
          onChange={(v) => patch({ username_effect: v })}
        />
      </Section>

      {/* Hover & cursor effects */}
      <Section title="hover & cursor">
        <PillSelect
          label="Button hover"
          value={state.hover_effect}
          options={[
            { value: "none" as const, label: "None" },
            { value: "glow" as const, label: "Glow" },
            { value: "pulse" as const, label: "Pulse" },
            { value: "shake" as const, label: "Shake" },
            { value: "lift" as const, label: "Lift" },
          ]}
          onChange={(v) => patch({ hover_effect: v })}
        />
        <PillSelect
          label="Cursor trail"
          value={state.cursor_effect}
          options={[
            { value: "none" as const, label: "None" },
            { value: "spark" as const, label: "Spark" },
            { value: "rainbow" as const, label: "Rainbow" },
            { value: "trail" as const, label: "Trail" },
            { value: "ripple" as const, label: "Ripple" },
            { value: "hearts" as const, label: "Hearts" },
          ]}
          onChange={(v) => patch({ cursor_effect: v })}
        />
      </Section>

      {/* Advanced effects */}
      <Section title="advanced effects">
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
        <PillSelect
          label="Page entry"
          value={state.page_entry}
          options={[
            { value: "none" as const, label: "None" },
            { value: "fade" as const, label: "Fade" },
            { value: "slide-up" as const, label: "Slide" },
            { value: "zoom" as const, label: "Zoom" },
            { value: "blur" as const, label: "Blur" },
            { value: "flip" as const, label: "Flip" },
          ]}
          onChange={(v) => patch({ page_entry: v })}
        />
        <PillSelect
          label="Border glow"
          value={state.border_glow}
          options={[
            { value: "none" as const, label: "None" },
            { value: "accent" as const, label: "Accent" },
            { value: "rainbow" as const, label: "Rainbow" },
            { value: "soft" as const, label: "Soft" },
            { value: "pulse" as const, label: "Pulse" },
            { value: "shake" as const, label: "Shake" },
          ]}
          onChange={(v) => patch({ border_glow: v })}
        />
        <PillSelect
          label="Overlay type"
          value={state.gradient_overlay}
          options={[
            { value: "none" as const, label: "None" },
            { value: "dark" as const, label: "Dark" },
            { value: "light" as const, label: "Light" },
            { value: "gradient-v" as const, label: "Grad V" },
            { value: "gradient-h" as const, label: "Grad H" },
            { value: "vignette" as const, label: "Vignette" },
            { value: "radial" as const, label: "Radial" },
          ]}
          onChange={(v) => patch({ gradient_overlay: v })}
        />
        {state.gradient_overlay !== "none" && (
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker
              label="Overlay c1"
              value={state.overlay_color1 || "#000000"}
              onChange={(v) => patch({ overlay_color1: v })}
            />
            <ColorPicker
              label="Overlay c2"
              value={state.overlay_color2 || "#000000"}
              onChange={(v) => patch({ overlay_color2: v })}
            />
          </div>
        )}
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
        <Toggle
          label="Monochrome icons"
          checked={state.monochrome_icons}
          onChange={(v) => patch({ monochrome_icons: v })}
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
        <Toggle
          label="Spinning avatar"
          checked={state.spin_avatar}
          onChange={(v) => patch({ spin_avatar: v })}
        />
        <Toggle
          label="Show profile age"
          checked={state.show_profile_age}
          onChange={(v) => patch({ show_profile_age: v })}
        />
      </Section>

      {/* Integrations */}
      <Section title="integrations">
        <p className="text-[10px] text-neutral-600">
          Discord connects via Settings page (OAuth). Spotify below:
        </p>
        <Label>Spotify Track ID</Label>
        <input
          type="text"
          value={state.spotify_track_id ?? ""}
          onChange={(e) => patch({ spotify_track_id: e.target.value || null })}
          placeholder="e.g. 4cOdK2wGLETKBW3PvgPWqT"
          className="w-full rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-white/30"
        />
        <p className="text-[10px] text-neutral-600">
          Copy the 22-char ID from open.spotify.com/track/XXX
        </p>
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
