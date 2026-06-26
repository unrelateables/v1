"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createLinkAction, deleteLinkAction, reorderLinksAction } from "./actions";
import { Button, Input, Label } from "@/components/ui";
import type { Link } from "@/lib/types";

export function LinksManager({ links: initialLinks }: { links: Link[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [msg, setMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLinks((prev) => {
      const oldIndex = prev.findIndex((l) => l.id === active.id);
      const newIndex = prev.findIndex((l) => l.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      reorderLinksAction(next.map((l) => l.id));
      return next;
    });
    setMsg("Order saved.");
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
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
          {msg}
        </div>
      )}

      <div className="space-y-2">
        {links.length === 0 && (
          <p className="rounded-full border border-dashed border-white/10 px-4 py-8 text-center text-sm text-neutral-500">
            No links yet. Drag to reorder once you add some.
          </p>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {links.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5">
        <h2 className="mb-4 text-sm font-medium">Add a new link</h2>
        <form action={onCreate} className="space-y-4">
          <div>
            <Label htmlFor="title">title</Label>
            <Input id="title" name="title" placeholder="My website" required maxLength={64} />
          </div>
          <div>
            <Label htmlFor="url">url</Label>
            <Input id="url" name="url" type="url" placeholder="https://..." required />
          </div>
          <Button type="submit">Add link</Button>
        </form>
      </div>
    </>
  );
}

function SortableLink({
  link,
  onDelete,
}: {
  link: Link;
  onDelete: (formData: FormData) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <form
      ref={setNodeRef}
      style={style}
      action={onDelete}
      className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-1 text-neutral-500 hover:text-neutral-200 active:cursor-grabbing"
        aria-label="Drag to reorder"
        title="Drag to reorder"
      >
        ⠿
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{link.title}</p>
        <p className="truncate text-xs text-neutral-500">{link.url}</p>
      </div>
      <input type="hidden" name="id" value={link.id} />
      <button
        type="submit"
        className="rounded-full px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
      >
        Delete
      </button>
    </form>
  );
}
