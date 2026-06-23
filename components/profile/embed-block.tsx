"use client";

import type { Embed } from "@/lib/types";

export function EmbedBlock({ embed, glass }: { embed: Embed; glass: boolean }) {
  const className = `w-full overflow-hidden rounded-2xl ${
    glass ? "glass" : "bg-black/60 border border-white/10"
  }`;

  if (embed.provider === "youtube") {
    return (
      <div className={className}>
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${embed.embed_id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (embed.provider === "spotify") {
    const [type, id] = embed.embed_id.split(":");
    return (
      <div className={className}>
        <iframe
          className="w-full"
          src={`https://open.spotify.com/embed/${type}/${id}`}
          height="152"
          allow="encrypted-media"
        />
      </div>
    );
  }

  if (embed.provider === "soundcloud") {
    return (
      <div className={className}>
        <iframe
          className="w-full"
          height="120"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(embed.embed_id)}&color=%236366f1&auto_play=false`}
        />
      </div>
    );
  }

  // custom
  return (
    <div className={className}>
      <iframe className="h-48 w-full" src={embed.embed_id} />
    </div>
  );
}
