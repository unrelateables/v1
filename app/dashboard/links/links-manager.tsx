"use client";

import { useState } from "react";
import {
  createLinkAction,
  deleteLinkAction,
  reorderLinksAction,
} from "./actions";
import { Button, Input, Label } from "@/components/ui";
import type { Link } from "@/lib/types";

export function LinksManager({ links: initialLinks }: { links: Link[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [msg, setMsg] = useState<string | null>(null);

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    setLinks(next);
    reorderLinksAction(next.map((l) => l.id));
  }

  async function onDelete(formData: FormData) {
    const id = String(formData.get("id"));
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await deleteLinkAction(formData);
    setMsg("Link deleted.");
  }

  async function onCreate(formData: FormData) {
    const res = await createLinkAction(formData);
    if (res?.error) {
      setMsg(res.error);
    } else {
      setMsg("Link added. Refreshing...");
      window.location.reload();
    }
  }

  return (
    <>
      {msg && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-neutral-300">
          {msg}
        </div>
      )}

      {/* Existing links */}
      <div className="space-y-2">
        {links.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-neutral-500">
            No links yet. Add your first one below.
          </p>
        )}
        {links.map((link, index) => (
          <form
            key={link.id}
            action={onDelete}
            className="glass flex items-center gap-3 rounded-xl p-3"
          >
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="px-1 text-neutral-400 hover:text-white disabled:opacity-30"
                aria-label="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === links.length - 1}
                className="px-1 text-neutral-400 hover:text-white disabled:opacity-30"
                aria-label="Move down"
              >
                ▼
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{link.title}</p>
              <p className="truncate text-xs text-neutral-500">{link.url}</p>
            </div>
            <input type="hidden" name="id" value={link.id} />
            <button
              type="submit"
              className="rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
            >
              Delete
            </button>
          </form>
        ))}
      </div>

      {/* New link form */}
      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-medium">Add a new link</h2>
        <form action={onCreate} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="My website" required maxLength={64} />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://..." required />
          </div>
          <Button type="submit">Add link</Button>
        </form>
      </div>
    </>
  );
}
