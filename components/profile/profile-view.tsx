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
import { CursorEffect as CursorEffectLayer } from "./cursor-effect";
import { UsernameText } from "./username-effects";
import {
  FONT_STACKS,
  RADIUS,
  NAME_SIZE,
  avatarRadiusClass,
} from "@/lib/design";
import type {
  PageEntry,
  UsernameEffectType,
  HoverEffect,
  CursorEffectType,
} from "@/lib/types";

const PAGE_ANIM_CLASS: Record<PageEntry, string> = {
  none: "",
  fade: "animate-fade-in",
  "slide-up": "animate-slide-in",
  zoom: "animate-zoom-in",
  flip: "animate-flip-in",
  blur: "animate-fade-in",
};

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

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    fetch(`/api/views?profile=${profile.id}`, { method: "POST" }).catch(() => {});
  }, [profile.id]);

  const name = profile.display_name || profile.username;
  const isLeft = settings.layout === "left";
  const fontStack = FONT_STACKS[settings.font_family] || FONT_STACKS.sans;
  const namePx = NAME_SIZE[settings.name_size];
  const avatarClass = avatarRadiusClass(settings.avatar_shape);
  const rad = RADIUS[settings.radius];
  const isGrid = settings.link_layout === "grid";

  const pageAnim = PAGE_ANIM_CLASS[settings.page_entry as PageEntry] || "";
  const alignClass = settings.text_align === "left" || isLeft ? "items-start text-left" : "items-center text-center";
  const containerClass = isLeft
    ? `relative z-10 flex w-full max-w-md flex-col items-start text-left ${pageAnim}`
    : `relative z-10 flex w-full max-w-md flex-col items-center text-center ${pageAnim}`;

  const embedGlass = settings.glassmorphism;

  // Gradient overlay style
  const overlayStyle: React.CSSProperties =
    settings.gradient_overlay !== "none" && settings.overlay_color1 && settings.overlay_color2
      ? {
          background: settings.gradient_overlay === "radial"
            ? `radial-gradient(circle, ${settings.overlay_color1}, ${settings.overlay_color2})`
            : `linear-gradient(135deg, ${settings.overlay_color1}, ${settings.overlay_color2})`,
          opacity: (settings.overlay_intensity ?? 40) / 100,
        }
      : {};

  // Border glow style
  const glowStyle: React.CSSProperties = settings.border_glow !== "none"
    ? {
        boxShadow:
          settings.border_glow === "pulse"
            ? `0 0 20px ${settings.accent_color}, 0 0 40px ${settings.accent_color}66`
            : settings.border_glow === "shake"
            ? `0 0 15px ${settings.accent_color}`
            : `0 0 25px ${settings.accent_color}, 0 0 50px ${settings.accent_color}44`,
      }
    : {};

  // Determine username rendering
  const showTypewriter = settings.typing_effect || settings.username_effect === "typewriter";
  const usernameEffect: UsernameEffectType = settings.username_effect;

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

      {/* Gradient overlay */}
      {settings.gradient_overlay !== "none" && settings.overlay_color1 && (
        <div className="pointer-events-none fixed inset-0 -z-10" style={overlayStyle} />
      )}

      <EffectsLayer effects={settings.effects} accent={settings.accent_color} />

      {/* Cursor effects */}
      {settings.cursor_effect !== "none" && (
        <CursorEffectLayer effect={settings.cursor_effect} />
      )}

      {/* Custom CSS injection */}
      {settings.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: `.biolink-root ${settings.custom_css}` }} />
      )}

      <div className={"biolink-root " + containerClass} style={glowStyle}>
        {/* Avatar */}
        <div className="mb-5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={name}
              className={`h-24 w-24 border-2 object-cover shadow-xl ${avatarClass}`}
              style={{
                borderColor: settings.accent_color,
                borderRadius: settings.avatar_shape === "circle" ? undefined : rad,
                filter: settings.monochrome_icons ? "grayscale(1)" : undefined,
              }}
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
          {showTypewriter ? (
            <TypingText text={name} />
          ) : usernameEffect !== "none" && usernameEffect !== "typewriter" ? (
            <UsernameText text={name} effect={usernameEffect as "rainbow" | "glitch" | "wave"} />
          ) : (
            name
          )}
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
              hoverEffect={settings.hover_effect}
              monochrome={settings.monochrome_icons}
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
