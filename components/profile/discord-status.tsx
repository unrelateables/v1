"use client";

import { useEffect, useState } from "react";

interface DiscordData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Array<{
    name: string;
    type: number;
    state?: string;
    details?: string;
    emoji?: { name: string };
  }>;
  listening_to_spotify?: boolean;
  spotify?: {
    song: string;
    artist: string;
    album_art_url: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  online: "#43b581",
  idle: "#faa61a",
  dnd: "#f04747",
  offline: "#747f8d",
};

const STATUS_LABELS: Record<string, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

export function DiscordStatus({ userId }: { userId: string }) {
  const [data, setData] = useState<DiscordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let cancelled = false;
    let gotData = false;

    // Timeout: if no data after 5s, show error
    const timeout = setTimeout(() => {
      if (!gotData && !cancelled) {
        setError(true);
        setLoading(false);
        ws?.close();
      }
    }, 5000);

    function fetchFallback() {
      fetch(`https://api.lanyard.rest/v1/users/${userId}`)
        .then((r) => r.json())
        .then((json) => {
          if (cancelled) return;
          if (json.success && json.data) {
            gotData = true;
            setData(json.data);
            setLoading(false);
            clearTimeout(timeout);
          } else {
            // Not tracking — user not in Lanyard server
            setError(true);
            setLoading(false);
            clearTimeout(timeout);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setError(true);
            setLoading(false);
            clearTimeout(timeout);
          }
        });
    }

    // Try WebSocket for real-time updates
    try {
      ws = new WebSocket("wss://api.lanyard.rest/socket");
      ws.onopen = () => {
        ws?.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userId },
          })
        );
      };
      ws.onmessage = (e) => {
        if (cancelled) return;
        try {
          const msg = JSON.parse(e.data);
          if (msg.op === 0 && msg.t === "INIT_STATE" && msg.d?.[userId]) {
            gotData = true;
            setData(msg.d[userId]);
            setLoading(false);
            clearTimeout(timeout);
          } else if (msg.op === 0 && msg.t === "PRESENCE_UPDATE" && msg.d) {
            setData(msg.d);
            setLoading(false);
          }
        } catch {}
      };
      ws.onerror = () => {
        fetchFallback();
      };
    } catch {
      fetchFallback();
    }

    // Also try REST immediately
    fetchFallback();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      ws?.close();
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-black/40 px-3 py-2 backdrop-blur">
        <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-600" />
        <span className="text-xs text-neutral-500">Loading Discord...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-2xl bg-black/40 p-3 backdrop-blur ring-1 ring-white/5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 fill-[#5865F2]">
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.01-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .01.01.03.03.04 1.75 1.29 3.44 2.07 5.1 2.58.04.01.08 0 .1-.02.39-.53.74-1.1 1.04-1.69.02-.04 0-.08-.03-.1-.42-.31-.82-.67-1.2-1.05-.03-.03-.03-.07 0-.1.1-.08.2-.16.3-.25.02-.02.05-.02.07 0 3.49 1.6 7.27 1.6 10.73 0 .02-.02.05-.02.07 0 .1.08.2.16.3.25.04.03.04.07 0 .1-.38.38-.78.74-1.2 1.05-.03.02-.05.06-.03.1.3.6.66 1.17 1.04 1.69.03.02.07.03.1.02 1.67-.51 3.36-1.29 5.1-2.58.02-.01.03-.03.03-.04.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02z" />
          </svg>
          <span className="text-[10px] text-neutral-500">
            Discord status unavailable. Join the{" "}
            <a
              href="https://discord.gg/lanyard"
              target="_blank"
              rel="noopener"
              className="underline text-[#5865F2]"
            >
              Lanyard Discord server
            </a>{" "}
            to enable this.
          </span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const status = data.discord_status || "offline";
  const color = STATUS_COLORS[status] || "#747f8d";
  const activity = data.activities?.find((a) => a.type === 0); // Playing
  const custom = data.activities?.find((a) => a.type === 4); // Custom status

  return (
    <div className="mt-4 rounded-2xl bg-black/40 p-3 backdrop-blur ring-1 ring-white/5">
      <div className="flex items-center gap-2.5">
        {/* Discord icon */}
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#5865F2] flex-shrink-0">
          <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.01-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .01.01.03.03.04 1.75 1.29 3.44 2.07 5.1 2.58.04.01.08 0 .1-.02.39-.53.74-1.1 1.04-1.69.02-.04 0-.08-.03-.1-.42-.31-.82-.67-1.2-1.05-.03-.03-.03-.07 0-.1.1-.08.2-.16.3-.25.02-.02.05-.02.07 0 3.49 1.6 7.27 1.6 10.73 0 .02-.02.05-.02.07 0 .1.08.2.16.3.25.04.03.04.07 0 .1-.38.38-.78.74-1.2 1.05-.03.02-.05.06-.03.1.3.6.66 1.17 1.04 1.69.03.02.07.03.1.02 1.67-.51 3.36-1.29 5.1-2.58.02-.01.03-.03.03-.04.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
        </svg>

        {/* Status text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-white">
              {STATUS_LABELS[status]}
            </span>
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
          </div>

          {/* Custom status */}
          {custom?.state && (
            <p className="truncate text-[10px] text-neutral-400">
              {custom.emoji?.name ? `${custom.emoji.name} ` : ""}
              {custom.state}
            </p>
          )}

          {/* Playing activity */}
          {activity && (
            <p className="truncate text-[10px] text-neutral-400">
              Playing <span className="text-neutral-200">{activity.name}</span>
              {activity.details ? ` — ${activity.details}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Spotify */}
      {data.listening_to_spotify && data.spotify && (
        <div className="mt-2 flex items-center gap-2 border-t border-white/5 pt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.spotify.album_art_url}
            alt=""
            className="h-8 w-8 rounded"
          />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-[#1DB954]">
              ♪ {data.spotify.song}
            </p>
            <p className="truncate text-[9px] text-neutral-500">
              {data.spotify.artist}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
