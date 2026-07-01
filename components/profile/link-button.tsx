"use client";

import type { Link, ButtonStyle, ButtonSize, Radius, LinkLayout, HoverEffect } from "@/lib/types";
import { RADIUS, BUTTON_PADDING } from "@/lib/design";

function isImageUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

const HOVER_CLASS: Record<HoverEffect, string> = {
  none: "",
  glow: "hover-fx-glow",
  pulse: "hover-fx-pulse",
  shake: "hover-fx-shake",
  lift: "hover:-translate-y-1",
  slide: "hover-fx-slide",
};

export function LinkButton({
  link,
  accent,
  textColor,
  buttonStyle,
  buttonSize,
  radius,
  layout,
  hoverEffect = "none",
  monochrome = false,
}: {
  link: Link;
  accent: string;
  textColor: string;
  buttonStyle: ButtonStyle;
  buttonSize: ButtonSize;
  radius: Radius;
  layout: LinkLayout;
  hoverEffect?: HoverEffect;
  monochrome?: boolean;
}) {
  function trackClick() {
    try {
      fetch(`/api/clicks?link=${link.id}`, { method: "POST" }).catch(() => {});
    } catch {}
  }

  const isGrid = layout === "grid";
  const pad = BUTTON_PADDING[buttonSize];
  const rad = RADIUS[radius];

  const baseStyle: React.CSSProperties = {
    borderRadius: rad,
    padding: pad,
    color: textColor,
  };

  let className = "group flex w-full items-center gap-3 text-sm font-medium transition-all hover:-translate-y-0.5 ";
  let style: React.CSSProperties = { ...baseStyle };

  switch (buttonStyle) {
    case "filled":
      style.background = accent;
      style.color = "#fff";
      style.boxShadow = `0 8px 24px -12px ${accent}`;
      break;
    case "outline":
      className += "bg-transparent hover:bg-white/[0.04] ";
      style.border = `1px solid ${accent}66`;
      break;
    case "minimal":
      className += "bg-transparent hover:bg-white/[0.04] ";
      style.border = "none";
      style.borderBottom = `1px solid ${accent}22`;
      style.borderRadius = rad;
      break;
    case "glass":
    default:
      className += "backdrop-blur-md ";
      style.background = "rgba(255,255,255,0.06)";
      style.border = "1px solid rgba(255,255,255,0.10)";
      style.boxShadow = `0 8px 24px -12px ${accent}`;
      break;
  }

  const showImageIcon = link.icon ? isImageUrl(link.icon) : false;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      className={className}
      style={style}
    >
      {link.icon && (
        <span className="flex-shrink-0 text-base">
          {showImageIcon ? (
            <img
              src={link.icon}
              alt=""
              className="h-5 w-5 rounded object-cover"
              loading="lazy"
            />
          ) : (
            <span>{link.icon}</span>
          )}
        </span>
      )}
      <span className={isGrid ? "truncate" : "flex-1"}>
        {link.title}
      </span>
      {!isGrid && (
        <span
          className="opacity-0 transition group-hover:opacity-60"
          style={{ color: accent }}
        >
          {"\u2197"}
        </span>
      )}
    </a>
  );
}
