"use client";

import type { Profile, ProfileSettings, Link, Embed } from "@/lib/types";
import { FONT_STACKS, RADIUS, NAME_SIZE, BUTTON_PADDING, avatarRadiusClass } from "@/lib/design";

export function ProfilePreview({
  profile,
  settings,
  links,
  embeds,
}: {
  profile: Profile;
  settings: ProfileSettings;
  links: Link[];
  embeds: Embed[];
}) {
  const s = settings;

  const bg = getBgStyle(s.bg_type, s.bg_value, s.accent_color);
  const isLeft = s.layout === "left" || s.text_align === "left";
  const alignClass = isLeft ? "items-start text-left" : "items-center text-center";
  const isGrid = s.link_layout === "grid";
  const avatarShape = avatarRadiusClass(s.avatar_shape);
  const linkRadius = (RADIUS as Record<string, string>)[s.radius] ?? "9999px";
  const linkPad = (BUTTON_PADDING as Record<string, string>)[s.button_size] ?? "0.75rem 1rem";
  const nameSize = (NAME_SIZE as Record<string, string>)[s.name_size] ?? "1.75rem";
  const overlay = (s.bg_overlay ?? 30) / 100;

  const name = profile.display_name || profile.username;

  return (
    <div
      className="relative flex min-h-full flex-col items-center justify-start overflow-y-auto px-5 py-10"
      style={{ ...bg, color: s.text_color }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})` }} />

      <div
        className={`relative z-10 flex w-full max-w-xs flex-col ${alignClass}`}
        style={{ fontFamily: (FONT_STACKS as Record<string, string>)[s.font_family] ?? "inherit" }}
      >
        {/* avatar */}
        <div className="mb-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={name}
              className={`h-20 w-20 border-2 object-cover ${avatarShape}`}
              style={{ borderColor: s.accent_color }}
            />
          ) : (
            <div
              className={`flex h-20 w-20 items-center justify-center border-2 text-2xl font-bold ${avatarShape}`}
              style={{ borderColor: s.accent_color, background: "rgba(0,0,0,0.4)" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* name */}
        <h1 className="font-bold" style={{ fontSize: nameSize }}>{name}</h1>
        <p className="mt-0.5 text-sm opacity-60">@{profile.username}</p>

        {/* bio */}
        {profile.bio && <p className="mt-3 text-sm leading-relaxed opacity-80">{profile.bio}</p>}

        {/* links */}
        <div className={`mt-6 w-full ${isGrid ? "grid grid-cols-2 gap-2" : "space-y-2.5"}`}>
          {links.length === 0 ? (
            <p className="text-center text-xs opacity-40">No links yet</p>
          ) : (
            links.slice(0, 6).map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-center gap-2 text-sm font-medium"
                style={{
                  ...buttonStyle(s.button_style, s.accent_color),
                  borderRadius: linkRadius,
                  padding: linkPad,
                }}
              >
                {link.icon && <span>{link.icon}</span>}
                <span className="truncate">{link.title}</span>
              </div>
            ))
          )}
        </div>

        {/* embeds */}
        {embeds.length > 0 && (
          <p className="mt-6 text-center text-xs opacity-40">{embeds.length} embed(s)</p>
        )}

        {/* footer */}
        {s.show_footer !== false && <p className="mt-8 text-xs opacity-40">made with biolink</p>}
        {s.show_views !== false && <p className="mt-1 text-xs opacity-30">0 views</p>}
      </div>
    </div>
  );
}

function getBgStyle(type: string, value: string | null, accent: string): React.CSSProperties {
  if (type === "solid") return { background: value || "#0a0a0a" };
  if (type === "gradient")
    return { background: value || `linear-gradient(135deg, ${accent}, #0a0a0a)` };
  if (type === "image" && value)
    return { backgroundImage: `url(${value})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { background: "#0a0a0a" };
}

function buttonStyle(style: string, accent: string): React.CSSProperties {
  switch (style) {
    case "filled":
      return { background: accent, color: "#fff" };
    case "outline":
      return { background: "transparent", border: `1px solid ${accent}55`, color: "#fff" };
    case "minimal":
      return { background: "rgba(255,255,255,0.04)", color: "#fff" };
    default:
      return {
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#fff",
      };
  }
}
