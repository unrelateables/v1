"use client";

import { useEffect, useState } from "react";

type UsernameEffect = "none" | "rainbow" | "glitch" | "wave";

export function UsernameText({
  text,
  effect = "none",
}: {
  text: string;
  effect?: UsernameEffect;
}) {
  if (effect === "none" || !effect) return <>{text}</>;

  if (effect === "rainbow") {
    return <span className="fx-rainbow">{text}</span>;
  }

  if (effect === "wave") {
    return (
      <span className="fx-wave" aria-label={text}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    );
  }

  if (effect === "glitch") {
    return (
      <span className="fx-glitch" data-text={text}>
        {text}
      </span>
    );
  }

  return <>{text}</>;
}
