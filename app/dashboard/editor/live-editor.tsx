"use client";

import { useState, useTransition } from "react";
import { ProfilePreview } from "./profile-preview";
import { Controls } from "./controls";
import { saveEditorAction } from "./actions";
import { Button } from "@/components/ui";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import type { Profile, ProfileSettings, Link, Embed, ProfilePage } from "@/lib/types";

export type EditorState = ProfileSettings;

export function LiveEditor({
  profile,
  settings,
  links,
  embeds,
}: {
  profile: Profile;
  settings: ProfileSettings;
  links: Link[];
  embeds: Embed[];
}) {
  const [state, setState] = useState<EditorState>(settings);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function patch(p: Partial<EditorState>) {
    setState((prev) => ({ ...prev, ...p }));
  }

  function applyTemplate(id: string) {
    const tmpl = getTemplate(id);
    if (!tmpl) return;
    setState((prev) => ({
      ...prev,
      ...tmpl.apply,
      template: id,
    }));
  }

  async function handleSave() {
    setSaved(false);
    startTransition(async () => {
      const result = await saveEditorAction(state);
      if (result?.success) setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Preview */}
      <div className="order-1 w-full lg:sticky lg:top-6 lg:order-2 lg:w-[52%]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl shadow-black/50">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
            <span className="ml-2 truncate font-mono text-[10px] text-neutral-500">
              {process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") ||
                "biolink"}
              /{profile.username}
            </span>
          </div>
          {/* Scrollable preview */}
          <div className="h-[600px] overflow-y-auto">
            <ProfilePreview
              profile={profile}
              settings={state}
              links={links}
              embeds={embeds}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="order-2 w-full lg:order-1 lg:w-[48%] lg:pr-4">
        {/* Template picker */}
        <div className="mb-6">
          <h3 className="mb-3 font-mono text-xs text-neutral-500">
            {"// templates"}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {TEMPLATES.map((t) => {
              const active = state.template === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition ${
                    active
                      ? "border-white/30 bg-white/10"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${t.apply.accent_color}, ${t.apply.text_color})`,
                    }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span className="text-[10px] text-neutral-400">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Controls state={state} patch={patch} />

        {/* Save */}
        <div className="mt-8 flex items-center gap-3">
          <Button onClick={handleSave} disabled={pending} className="w-full">
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </div>
        {saved && (
          <p className="mt-3 text-center text-sm text-emerald-400">
            Saved — your page is live.
          </p>
        )}
      </div>
    </div>
  );
}
