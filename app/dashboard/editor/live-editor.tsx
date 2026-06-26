"use client";

import { useState } from "react";
import { saveEditorAction } from "./actions";
import { Button } from "@/components/ui";
import type { ProfileSettings } from "@/lib/types";

export function LiveEditor({ settings }: { settings: ProfileSettings }) {
  const [s, setS] = useState(settings);
  const [msg, setMsg] = useState("");
  const set = <K extends keyof ProfileSettings>(k: K, v: ProfileSettings[K]) =>
    setS((p) => ({ ...p, [k]: v }));

  async function save() {
    setMsg("Saving...");
    const fd = new FormData();
    fd.append("bg_type", s.bg_type); fd.append("bg_value", s.bg_value || "");
    fd.append("bg_overlay", String(s.bg_overlay));
    fd.append("accent_color", s.accent_color); fd.append("text_color", s.text_color);
    fd.append("layout", s.layout); fd.append("font_family", s.font_family);
    fd.append("radius", s.radius); fd.append("button_style", s.button_style);
    fd.append("particles", s.effects.particles); fd.append("audio_url", s.audio_url || "");
    const r = await saveEditorAction(undefined, fd);
    setMsg(r?.error || "Saved!");
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="w-full lg:w-[400px] space-y-4">
        <h1 className="text-2xl font-semibold">Design</h1>
        {msg && <p className="text-sm text-neutral-400">{msg}</p>}
        <Button onClick={save} className="w-full">Save</Button>
      </div>
      <div className="flex-1">preview</div>
    </div>
  );
}
