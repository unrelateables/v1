"use client";

import { useEffect, useRef, useState } from "react";
import type { ProfilePage } from "@/lib/types";
import { BackgroundLayer } from "./background-layer";
import { EffectsLayer } from "./effects-layer";
import { AudioPlayer } from "./audio-player";
import { TypingText } from "./typing-text";
import { LinkButton } from "./link-button";
import { EmbedBlock } from "./embed-block";
import { BadgeChips } from "./badge-chips";

export function ProfileView({
  page,
  badges = [],
}: {
  page: ProfilePage;
  badges?: string[];
}) {
  const { profile, settings, links, embeds } = page;
  const [audioOn, setAudioOn] = useState(settings.audio_autoplay);
  const trackedRef = useRef(false);

  // Record a view once per page load
  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    fetch(`/api/views?profile=${profile.id}`, { method: "POST" }).catch(() => {});
  }, [profile.id]);

  const name = profile.display_name || profile.username;

  return (
    <main
      className="relative flex min-h-screen flex-col items-center overflow-hidden px-5 py-12"
      style={{ color: settings.text_color }}
    >
      <BackgroundLayer
        bgType={settings.bg_type}
        bgValue={settings.bg_value}
        accent={settings.accent_color}
      />

      <EffectsLayer effects={settings.effects} accent={settings.accent_color} />

      <div
        className={`relative z-10 flex w-full max-w-md flex-col items-center text-center animate-fade-in ${
          settings.glassmorphism ? "" : ""
        }`}
      >
        {/* Avatar */}
        <div className="mb-5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={name}
              className="h-24 w-24 rounded-full border-2 object-cover shadow-xl"
              style={{ borderColor: settings.accent_color }}
            />
          ) : (
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-2 text-3xl font-bold shadow-xl"
              style={{
                borderColor: settings.accent_color,
                background: "rgba(0,0,0,0.4)",
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold">
          {settings.typing_effect ? (
            <TypingText text={name} />
          ) : (
            name
          )}
        </h1>
        <p className="mt-1 text-sm opacity-60">@{profile.username}</p>

        {badges.length > 0 && <BadgeChips badges={badges} />}

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-sm leading-relaxed opacity-80">{profile.bio}</p>
        )}

        {/* Links */}
        <div className="mt-7 w-full space-y-3">
          {links.map((link) => (
            <LinkButton key={link.id} link={link} accent={settings.accent_color} glass={settings.glassmorphism} />
          ))}
        </div>

        {/* Embeds */}
        {embeds.length > 0 && (
          <div className="mt-7 w-full space-y-4">
            {embeds.map((embed) => (
              <EmbedBlock key={embed.id} embed={embed} glass={settings.glassmorphism} />
            ))}
          </div>
        )}

        {/* Footer badge */}
        <p className="mt-10 text-xs opacity-40">
          made with{" "}
          <a href="/" className="underline">
            biolink
          </a>
        </p>
      </div>

      {settings.audio_url && (
        <AudioPlayer
          url={settings.audio_url}
          autoplay={settings.audio_autoplay}
          on={audioOn}
          setOn={setAudioOn}
        />
      )}
    </main>
  );
}
