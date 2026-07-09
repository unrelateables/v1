"use client";

import { deleteProfileAction } from "./actions";

export function DeleteButton({ id, username }: { id: string; username: string }) {
  return (
    <form
      action={deleteProfileAction}
      onSubmit={(e) => {
        if (!confirm(`Permanently delete @${username}? This removes their account, profile, links, and all data. This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="rounded-lg bg-red-900/30 px-3 py-1.5 text-xs text-red-500 hover:bg-red-900/50">
        Delete
      </button>
    </form>
  );
}
