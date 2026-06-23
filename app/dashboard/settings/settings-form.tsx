"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SettingsForm({ email }: { email: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-medium">Account</h2>
        <div className="mb-4">
          <p className="text-xs text-neutral-500">Signed in as</p>
          <p className="text-sm">{email}</p>
        </div>
        <Button variant="ghost" onClick={signOut}>
          Sign out
        </Button>
      </div>

      {msg && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-neutral-300">
          {msg}
        </div>
      )}
    </div>
  );
}
