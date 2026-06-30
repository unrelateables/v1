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
  let style: React.CSSProperties = {};

  if (bgType === "solid") {
    style.background = bgValue || "#0a0a0a";
  } else if (bgType === "gradient") {
    style.background = bgValue || `linear-gradient(135deg, ${accent}, #0a0a0a)`;
  } else if (bgType === "image" && bgValue) {
    style.backgroundImage = `url(${bgValue})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundAttachment = "fixed";
  } else if (bgType === "gif" && bgValue) {
    style.backgroundImage = `url(${bgValue})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundAttachment = "fixed";
  }

  const overlayOpacity = overlay / 100;

  return (
    <div className="fixed inset-0 -z-10" style={style}>
      {bgType !== "video" && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      {bgType === "video" && bgValue && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            src={bgValue}
          />
          {overlayOpacity > 0 && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </>
      )}
    </div>
  );
}
