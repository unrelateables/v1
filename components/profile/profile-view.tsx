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
import { SocialIcons } from "./social-icons";
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
  const { profile, settings, links, embeds, socialLinks = [] } = page;
  const [audioOn, setAudioOn] = useState(settings.audio_autoplay);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    fetch(`/api/views?profile=${profile.id}`, { method: "POST" })
      .then(() => fetch(`/api/views?profile=${profile.id}&count=1`))
      .then((r) => r.json())
      .then((d) => setViewCount(d.count ?? null))
      .catch(() => {});
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

  const embedGlass = settings.glassmorphism;

  const overlayStyle: React.CSSProperties =
    settings.gradient_overlay !== "none" && settings.overlay_color1 && settings.overlay_color2
      ? {
          background: settings.gradient_overlay === "radial"
            ? `radial-gradient(circle, ${settings.overlay_color1}, ${settings.overlay_color2})`
            : `linear-gradient(135deg, ${settings.overlay_color1}, ${settings.overlay_color2})`,
          opacity: (settings.overlay_intensity ?? 40) / 100,
        }
      : {};

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

  const showTypewriter = settings.typing_effect || settings.username_effect === "typewriter";
  const usernameEffect: UsernameEffectType = settings.username_effect;

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-10"
      style={{ color: settings.text_color, fontFamily: fontStack }}
    >
      <BackgroundLayer
        bgType={settings.bg_type}
        bgValue={settings.bg_value}
        accent={settings.accent_color}
        overlay={settings.bg_overlay}
      />

      {settings.gradient_overlay !== "none" && settings.overlay_color1 && (
        <div className="pointer-events-none fixed inset-0 -z-10" style={overlayStyle} />
      )}

      <EffectsLayer effects={settings.effects} accent={settings.accent_color} />

      {settings.cursor_effect !== "none" && (
        <CursorEffectLayer effect={settings.cursor_effect} />
      )}

      {settings.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: `.biolink-root ${settings.custom_css}` }} />
      )}

      {/* ── Glass card (guns.lol style) ── */}
      <div className={"biolink-root glass-strong relative z-10 w-full max-w-md rounded-3xl px-6 py-8 sm:px-8 " + pageAnim} style={glowStyle}>
        <div className={"flex flex-col " + alignClass}>
          {/* Avatar with gradient ring */}
          <div className="relative mb-5">
            <div
              className="absolute -inset-1 rounded-full opacity-80 blur-[2px]"
              style={{
                background: `conic-gradient(from 0deg, ${settings.accent_color}, #ec4899, #8b5cf6, ${settings.accent_color})`,
              }}
            />
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={name}
                className={`relative h-28 w-28 border-2 object-cover shadow-2xl ${avatarClass}`}
                style={{
                  borderColor: "rgba(0,0,0,0.5)",
                  filter: settings.monochrome_icons ? "grayscale(1)" : undefined,
                }}
              />
            ) : (
              <div
                className={`relative flex h-28 w-28 items-center justify-center border-2 text-4xl font-bold shadow-2xl ${avatarClass}`}
                style={{ borderColor: "rgba(0,0,0,0.5)", background: "rgba(0,0,0,0.5)" }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + badges inline */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h1 style={{ fontSize: namePx, lineHeight: 1.1, fontWeight: 700 }}>
              {showTypewriter ? (
                <TypingText text={name} />
              ) : usernameEffect !== "none" && usernameEffect !== "typewriter" ? (
                <UsernameText text={name} effect={usernameEffect as "rainbow" | "glitch" | "wave"} />
              ) : (
                name
              )}
            </h1>
            {badges.length > 0 && <BadgeChips badges={badges} />}
          </div>

          <p className="mt-1 text-sm font-medium opacity-50">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-70">
              {profile.bio}
            </p>
          )}

          {/* Social icons */}
          {socialLinks.length > 0 && (
            <div className="mt-4">
              <SocialIcons links={socialLinks} accent={settings.accent_color} />
            </div>
          )}

          {/* Links */}
          <div className={"mt-6 w-full " + (isGrid ? "grid grid-cols-2 gap-2.5" : "space-y-2.5")}>
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
            <div className="mt-6 w-full space-y-3">
              {embeds.map((embed) => (
                <EmbedBlock key={embed.id} embed={embed} glass={embedGlass} />
              ))}
            </div>
          )}

          {/* View counter */}
          {settings.show_views && viewCount !== null && (
            <div className="mt-6 flex items-center gap-1.5 opacity-40">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
              <span className="text-xs font-medium tabular-nums">{viewCount.toLocaleString()}</span>
            </div>
          )}

          {/* Footer */}
          {settings.show_footer && (
            <p className="mt-8 text-xs opacity-30">
              made with <a href="/" className="underline">biolink</a>
            </p>
          )}
        </div>
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
