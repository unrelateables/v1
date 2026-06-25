import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-neutral-400">Account and preferences.</p>

      <div className="mt-6 space-y-6">
        <SettingsForm email={user.email || ""} />

        {/* Premium (disabled placeholder) */}
        <div className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-medium text-amber-400">
              PREMIUM
            </span>
            <h2 className="text-sm font-medium">Coming soon</h2>
          </div>
          <p className="text-xs text-neutral-500">
            Custom domains, exclusive effects, and more are planned. Everything is
            free for now — these toggles are disabled until paid features launch.
          </p>
          <div className="mt-4 space-y-3 opacity-50">
            <DisabledToggle label="Custom domain" />
            <DisabledToggle label="Remove biolink badge" />
            <DisabledToggle label="Exclusive effects pack" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DisabledToggle({ label }: { label: string }) {
  return (
    <label className="flex cursor-not-allowed items-center justify-between">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input type="checkbox" disabled className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-white/10" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white/40" />
      </span>
    </label>
  );
}
