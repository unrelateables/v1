"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { updateProfileAction } from "./actions";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { SELECTABLE_BADGES } from "@/lib/constants";
import { clsx } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useFormState(updateProfileAction, undefined);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    profile.badges ?? []
  );

  function toggleBadge(id: string) {
    setSelectedBadges((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const {
      data: { user },
    } = await createClient().auth.getUser();
    if (!user) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    setUploading(false);
    if (error) {
      alert(error.message);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
  }

  return (
    <form action={formAction} className="space-y-6">
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

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/5">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-neutral-500">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <label className="cursor-pointer rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            {uploading ? "Uploading..." : "Upload avatar"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          <input type="hidden" name="avatar_url" value={avatarUrl} />
          <p className="mt-1.5 text-xs text-neutral-500">PNG, JPG, GIF. Stored in Supabase.</p>
        </div>
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={profile.username} required />
        <p className="mt-1.5 text-xs text-neutral-500">
          Your page: /{profile.username}
        </p>
      </div>

      <div>
        <Label htmlFor="display_name">Display name</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={profile.display_name || ""}
          maxLength={48}
          placeholder="Your name"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio || ""}
          maxLength={280}
          rows={3}
          placeholder="Tell people who you are."
        />
      </div>

      {/* Badges */}
      <div>
        <Label>Exclusive badges</Label>
        <p className="mb-3 text-xs text-neutral-500">
          Pick the badges that show off your identity. Some badges are earned
          automatically (views, music, early adopter) and can&apos;t be selected.
        </p>
        <div className="flex flex-wrap gap-2">
          {SELECTABLE_BADGES.map((def) => {
            const active = selectedBadges.includes(def.id);
            return (
              <button
                key={def.id}
                type="button"
                onClick={() => toggleBadge(def.id)}
                title={def.label}
                className={clsx(
                  "group relative flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all hover:scale-110 hover:-translate-y-0.5",
                  active && def.rare && "holo-ring"
                )}
                style={
                  active
                    ? {
                        background: `linear-gradient(135deg, ${def.gradient[0]}, ${def.gradient[1]})`,
                        boxShadow: `0 4px 12px -2px ${def.color}77, inset 0 1px 0 rgba(255,255,255,0.4)`,
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
                        filter: "grayscale(0.6) opacity(0.5)",
                      }
                }
              >
                <span aria-hidden>{def.emoji}</span>
                {active && def.rare && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                )}
                {active && (
                  <span
                    className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px]"
                    style={{ background: def.color, color: "#000" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* hidden inputs so selected badges submit with the form */}
        {selectedBadges.map((id) => (
          <input key={id} type="hidden" name="badges" value={id} />
        ))}
      </div>

      <Button type="submit">Save changes</Button>
    </form>
  );
}
