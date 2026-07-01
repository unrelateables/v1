"use client";

import type { BgType } from "@/lib/types";

export function BackgroundLayer({
  bgType,
  bgValue,
  accent,
  overlay,
}: {
  bgType: BgType;
  bgValue: string | null;
  accent: string;
  overlay: number;
}) {
  const overlayOpacity = overlay / 100;
  const isMediaBg = bgType === "image" || bgType === "gif" || bgType === "video";
  const isImgBg = bgType === "image" || bgType === "gif";

  // For solid / gradient — simple styled div
  if (!isMediaBg) {
    const style: React.CSSProperties = {};
    if (bgType === "solid") {
      style.background = bgValue || "#0a0a0a";
    } else if (bgType === "gradient") {
      style.background = bgValue || `linear-gradient(135deg, ${accent}, #0a0a0a)`;
    } else {
      style.background = "#0a0a0a";
    }
    return (
      <div className="fixed inset-0 -z-10" style={style}>
        {overlayOpacity > 0 && (
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
        )}
      </div>
    );
  }

  // For image / gif / video — use a full-bleed media element for crisp rendering
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {isImgBg && bgValue ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgValue}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center" }}
        />
      ) : bgType === "video" && bgValue ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center" }}
          src={bgValue}
        />
      ) : null}
      {overlayOpacity > 0 && (
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
      )}
    </div>
  );
}
