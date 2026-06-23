"use client";

import type { BgType } from "@/lib/types";

export function BackgroundLayer({
  bgType,
  bgValue,
  accent,
}: {
  bgType: BgType;
  bgValue: string | null;
  accent: string;
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
  }

  return (
    <div className="fixed inset-0 -z-10" style={style}>
      {(bgType === "image" || bgType === "gradient" || bgType === "solid") && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      {bgType === "video" && bgValue && (
        // eslint-disable-next-line @next/next/no-img-element
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          src={bgValue}
        />
      )}
    </div>
  );
}
