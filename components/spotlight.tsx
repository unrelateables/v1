"use client";

import { useEffect, useRef } from "react";

/**
 * A soft radial glow that follows the cursor. Pointer-events disabled,
 * fixed behind content. Hidden on touch / reduced-motion devices.
 */
export function Spotlight({ color = "99, 102, 241" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) {
      el.style.opacity = "0";
      return;
    }

    let raf = 0;
    function onMove(e: MouseEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(${color}, 0.08), transparent 40%)`;
      });
    }

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [color]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500"
      aria-hidden
    />
  );
}
