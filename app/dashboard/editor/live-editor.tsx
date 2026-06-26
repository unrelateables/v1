"use client";

import { Component, useState, useMemo } from "react";
import { updateAppearanceAction } from "../appearance/actions";
import { ProfileView } from "@/components/profile/profile-view";
import { Button, Input, Label } from "@/components/ui";
import { TEMPLATES } from "@/lib/templates";
import { clsx } from "@/lib/utils";
import type {
  Profile,
  ProfileSettings,
  Link,
  Embed,
  ProfilePage,
  BgType,
} from "@/lib/types";

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
          <p className="font-semibold">Preview error</p>
          <p className="mt-1 text-xs text-red-400/70">{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function LiveEditor({
  profile,
  settings: initial,
  links,
  embeds,
}: {
  profile: Profile;
  settings: ProfileSettings;
  links: Link[];
  embeds: Embed[];
}) {
  const [settings, setSettings] = useState<ProfileSettings>(initial);
  const [state, setState] = useState<{ error?: string; success?: boolean } | null>(null);
  const [bgType, setBgType] = useState<BgType>(initial.bg_type);

  function set<K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  const page: ProfilePage = useMemo(
    () => ({ profile, settings, links, embeds }),
    [profile, settings, links, embeds]
  );

  async function handleSave() {
    setState(null);
    const fd = new FormData();
    const on = (k: string) => {
      fd.append(k, settings[k as keyof ProfileSettings] ? "on" : "");
    };
    fd.append("bg_type", settings.bg_type);
    fd.append("bg_value", settings.bg_value || "");
    fd.append("bg_overlay", String(settings.bg_overlay));
    fd.append("accent_color", settings.accent_color);
    fd.append("text_color", settings.text_color);
    fd.append("layout", settings.layout);
    fd.append("text_align", settings.text_align);
    fd.append("font_family", settings.font_family);
    fd.append("radius", settings.radius);
    fd.append("button_style", settings.button_style);
    fd.append("button_size", settings.button_size);
    fd.append("name_size", settings.name_size);
    fd.append("avatar_shape", settings.avatar_shape);
    fd.append("link_layout", settings.link_layout);
    fd.append("particles", settings.effects.particles);
    fd.append("audio_url", settings.audio_url || "");
    fd.append("custom_css", settings.custom_css || "");
    on("audio_autoplay"); on("glassmorphism"); on("typing_effect");
    on("is_public"); on("show_views"); on("show_footer"); on("snow"); on("rain");
    const res = await updateAppearanceAction(undefined, fd);
    setState(res ?? {});
  }

  function applyTemplate(id: string) {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setSettings((s) => ({ ...s, ...t.apply, template: id }));
  }

  const bgPlaceholder =
    bgType === "gradient"
      ? "linear-gradient(135deg,#6366f1,#ec4899)"
      : bgType === "image"
      ? "https://...jpg"
      : bgType === "video"
      ? "https://...mp4"
      : "#0a0a0a";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {/* CONTROLS */}
      <div className="order-2 w-full lg:order-1 lg:w-[420px] lg:shrink-0 space-y-5">
        <div>
          <p className="font-mono text-xs text-neutral-600">{"// live editor"}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Design your page</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Drag controls — the preview updates in real time.
          </p>
          <p className="mt-1 font-mono text-[10px] text-emerald-500">editor loaded ✓</p>
        </div>

        {state?.error && <Msg tone="error">{state.error}</Msg>}
        {state?.success && <Msg tone="ok">Saved.</Msg>}

        {/* Templates */}
        <Card title="templates">
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t.id)}
                className={clsx(
                  "overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5",
                  settings.template === t.id ? "border-white/40" : "border-white/10"
                )}
              >
                <div className="h-10 w-full" style={{ background: t.swatch }} />
                <p className="px-1.5 py-1 text-[10px] text-neutral-300">
                  {t.emoji} {t.name}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Background */}
        <Card title="background">
          <div className="mb-3 grid grid-cols-4 gap-2">
            {(["solid", "gradient", "image", "video"] as BgType[]).map((t) => (
              <Pill key={t} active={bgType === t} onClick={() => { setBgType(t); set("bg_type", t); }}>
                {t}
              </Pill>
            ))}
          </div>
          <Input
            value={settings.bg_value || ""}
            onChange={(e) => set("bg_value", e.target.value)}
            placeholder={bgPlaceholder}
          />
          <Range
            label="overlay"
            min={0}
            max={100}
            value={settings.bg_overlay}
            onChange={(v) => set("bg_overlay", v)}
          />
        </Card>

        {/* Colors */}
        <Card title="colors">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>accent</Label>
              <input
                type="color"
                value={settings.accent_color}
                onChange={(e) => set("accent_color", e.target.value)}
                className="h-10 w-full rounded-full border border-white/10 bg-transparent p-1"
              />
            </div>
            <div>
              <Label>text</Label>
              <input
                type="color"
                value={settings.text_color}
                onChange={(e) => set("text_color", e.target.value)}
                className="h-10 w-full rounded-full border border-white/10 bg-transparent p-1"
              />
            </div>
          </div>
        </Card>

        {/* Layout */}
        <Card title="layout">
          <Choice label="page layout" value={settings.layout} onChange={(v) => set("layout", v as ProfileSettings["layout"])} options={[["centered","Centered"],["left","Left"]]} />
          <Choice label="links" value={settings.link_layout} onChange={(v) => set("link_layout", v as ProfileSettings["link_layout"])} options={[["list","List"],["grid","Grid"]]} />
          <Choice label="font" value={settings.font_family} onChange={(v) => set("font_family", v as ProfileSettings["font_family"])} options={[["sans","Sans"],["mono","Mono"],["serif","Serif"],["display","Display"]]} />
          <Choice label="corners" value={settings.radius} onChange={(v) => set("radius", v as ProfileSettings["radius"])} options={[["none","Sharp"],["sm","S"],["md","M"],["lg","L"],["xl","XL"],["full","Pill"]]} />
        </Card>

        {/* Avatar & name */}
        <Card title="avatar & name">
          <Choice label="avatar shape" value={settings.avatar_shape} onChange={(v) => set("avatar_shape", v as ProfileSettings["avatar_shape"])} options={[["circle","Circle"],["square","Square"],["rounded","Rounded"]]} />
          <Choice label="name size" value={settings.name_size} onChange={(v) => set("name_size", v as ProfileSettings["name_size"])} options={[["sm","S"],["md","M"],["lg","L"],["xl","XL"]]} />
          <Toggle label="Typing effect" checked={settings.typing_effect} onChange={(v) => set("typing_effect", v)} />
        </Card>

        {/* Buttons */}
        <Card title="buttons">
          <Choice label="style" value={settings.button_style} onChange={(v) => set("button_style", v as ProfileSettings["button_style"])} options={[["glass","Glass"],["filled","Filled"],["outline","Outline"],["minimal","Minimal"]]} />
          <Choice label="size" value={settings.button_size} onChange={(v) => set("button_size", v as ProfileSettings["button_size"])} options={[["sm","S"],["md","M"],["lg","L"]]} />
          <Toggle label="Glassmorphism" checked={settings.glassmorphism} onChange={(v) => set("glassmorphism", v)} />
        </Card>

        {/* Effects */}
        <Card title="effects">
          <Choice label="particles" value={settings.effects.particles} onChange={(v) => set("effects", { ...settings.effects, particles: v as ProfileSettings["effects"]["particles"] })} options={[["none","None"],["stars","Stars"],["hearts","Hearts"]]} />
          <Toggle label="Snow" checked={settings.effects.snow} onChange={(v) => set("effects", { ...settings.effects, snow: v })} />
          <Toggle label="Rain" checked={settings.effects.rain} onChange={(v) => set("effects", { ...settings.effects, rain: v })} />
        </Card>

        {/* Music */}
        <Card title="music">
          <Input
            value={settings.audio_url || ""}
            onChange={(e) => set("audio_url", e.target.value)}
            placeholder="https://...mp3"
          />
          <Toggle label="Autoplay" checked={settings.audio_autoplay} onChange={(v) => set("audio_autoplay", v)} />
        </Card>

        {/* Extra */}
        <Card title="extra">
          <Toggle label="Show views" checked={settings.show_views} onChange={(v) => set("show_views", v)} />
          <Toggle label="Show footer" checked={settings.show_footer} onChange={(v) => set("show_footer", v)} />
          <Toggle label="Public page" checked={settings.is_public} onChange={(v) => set("is_public", v)} />
        </Card>

        <Button onClick={handleSave} className="w-full">Save changes</Button>
      </div>

      {/* LIVE PREVIEW */}
      <div className="order-1 w-full lg:order-2 lg:sticky lg:top-4">
        <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/40 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="ml-2 truncate font-mono text-[10px] text-neutral-600">
              yoursite.com/{profile.username}
            </span>
          </div>
          <div className="h-[560px] overflow-y-auto">
            <ErrorBoundary>
              <ProfileView page={page} preview />
            </ErrorBoundary>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-neutral-600">
          live preview · changes save when you click Save
        </p>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-4">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wide text-neutral-500">{title}</h2>
      {children}
    </div>
  );
}
function Msg({ tone, children }: { tone: "error" | "ok"; children: React.ReactNode }) {
  return (
    <div className={clsx("rounded-full border px-4 py-2 text-sm", tone === "error" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300")}>{children}</div>
  );
}
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={clsx("rounded-full border px-3 py-1.5 text-xs capitalize transition", active ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}>{children}</button>
  );
}
function Range({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mt-3">
      <Label>{label}: {value}%</Label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-white" />
    </div>
  );
}
function Choice({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([v, l]) => (
          <Pill key={v} active={value === v} onClick={() => onChange(v)}>{l}</Pill>
        ))}
      </div>
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mb-2 flex cursor-pointer items-center justify-between">
      <span className="text-sm text-neutral-300">{label}</span>
      <button type="button" onClick={() => onChange(!checked)} className={clsx("relative h-6 w-11 rounded-full transition", checked ? "bg-white" : "bg-white/10")}>
        <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white transition", checked ? "left-[1.375rem] bg-neutral-900" : "left-0.5")} />
      </button>
    </label>
  );
}
