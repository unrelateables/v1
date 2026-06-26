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
import {
  FONT_STACKS,
  RADIUS,
  NAME_SIZE,
  avatarRadiusClass,
} from "@/lib/design";

export function ProfileView({
  page,
  badges = [],
  preview = false,
}: {
  page: ProfilePage;
  badges?: string[];
  preview?: boolean;
}) {
  const { profile, settings, links, embeds } = page;
  const [audioOn, setAudioOn] = useState(settings.audio_autoplay);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (preview || trackedRef.current) return;
    trackedRef.current = true;
    fetch(`/api/views?profile=${profile.id}`, { method: "POST" }).catch(() => {});
  }, [profile.id, preview]);

  const name = profile.display_name || profile.username;
  const isLeft = settings.layout === "left";
  const fontStack = FONT_STACKS[settings.font_family] || FONT_STACKS.sans;
  const namePx = NAME_SIZE[settings.name_size];
  const avatarClass = avatarRadiusClass(settings.avatar_shape);
  const rad = RADIUS[settings.radius];
  const isGrid = settings.link_layout === "grid";

  const alignClass = settings.text_align === "left" || isLeft ? "items-start text-left" : "items-center text-center";
  const containerClass = isLeft
    ? "relative z-10 flex w-full max-w-md flex-col items-start text-left animate-fade-in"
    : "relative z-10 flex w-full max-w-md flex-col items-center text-center animate-fade-in";

  const embedGlass = settings.glassmorphism;

  return (
    <main
      className="relative flex min-h-screen flex-col items-center overflow-hidden px-5 py-12"
      style={{ color: settings.text_color, fontFamily: fontStack }}
    >
      <BackgroundLayer
        bgType={settings.bg_type}
        bgValue={settings.bg_value}
        accent={settings.accent_color}
        overlay={settings.bg_overlay}
      />

      <EffectsLayer effects={settings.effects} accent={settings.accent_color} />

      {/* Custom CSS injection — scoped under .biolink-root */}
      {settings.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: `.biolink-root ${settings.custom_css}` }} />
      )}

      <div className={"biolink-root " + containerClass}>
        {/* Avatar */}
        <div className="mb-5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={name}
              className={`h-24 w-24 border-2 object-cover shadow-xl ${avatarClass}`}
              style={{ borderColor: settings.accent_color, borderRadius: settings.avatar_shape === "circle" ? undefined : rad }}
            />
          ) : (
            <div
              className={`flex h-24 w-24 items-center justify-center border-2 text-3xl font-bold shadow-xl ${avatarClass}`}
              style={{
                borderColor: settings.accent_color,
                background: "rgba(0,0,0,0.4)",
                borderRadius: settings.avatar_shape === "circle" ? undefined : rad,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 style={{ fontSize: namePx, lineHeight: 1.1, fontWeight: 700 }}>
          {settings.typing_effect ? <TypingText text={name} /> : name}
        </h1>
        <p className="mt-1 text-sm opacity-60">@{profile.username}</p>

        {badges.length > 0 && <BadgeChips badges={badges} />}

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 max-w-md text-sm leading-relaxed opacity-80">
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div
          className={
            "mt-7 w-full " +
            (isGrid ? "grid grid-cols-2 gap-2.5" : "space-y-3")
          }
        >
          {links.map((link) => (
            <LinkButton
              key={link.id}
              link={link}
              accent={settings.accent_color}
              textColor={settings.text_color}
              buttonStyle={settings.button_style}
              buttonSize={settings.button_size}
              radius={settings.radius}
              layout={settings.link_layout}
            />
          ))}
        </div>

        {/* Embeds */}
        {embeds.length > 0 && (
          <div className="mt-7 w-full space-y-4">
            {embeds.map((embed) => (
              <EmbedBlock key={embed.id} embed={embed} glass={embedGlass} />
            ))}
          </div>
        )}

        {/* Footer */}
        {settings.show_footer && (
          <p className="mt-10 text-xs opacity-40">
            made with{" "}
            <a href="/" className="underline">
              biolink
            </a>
          </p>
        )}
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
