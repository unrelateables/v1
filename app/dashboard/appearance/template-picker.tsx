"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyTemplateAction } from "./actions";
import { TEMPLATES } from "@/lib/templates";
import { clsx } from "@/lib/utils";

export function TemplatePicker({ active }: { active: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function apply(id: string) {
    startTransition(async () => {
      await applyTemplateAction(id);
      router.refresh();
    });
  }

  return (
    <div>
      <p className="mb-3 text-xs text-neutral-500">
        One-click styles. Applies a full curated look instantly.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={pending}
            onClick={() => apply(t.id)}
            className={clsx(
              "overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 disabled:opacity-50",
              active === t.id ? "border-white/40" : "border-white/10"
            )}
          >
            <div className="h-14 w-full" style={{ background: t.swatch }} />
            <div className="px-2.5 py-2">
              <p className="text-xs font-medium text-white">
                {t.emoji} {t.name}
              </p>
              <p className="text-[10px] text-neutral-500">{t.description}</p>
            </div>
          </button>
        ))}
      </div>
      {pending && (
        <p className="mt-2 font-mono text-[11px] text-neutral-500">applying…</p>
      )}
    </div>
  );
}
