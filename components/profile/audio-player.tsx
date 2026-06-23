"use client";

import { useEffect, useRef, useState } from "react";

export function AudioPlayer({
  url,
  autoplay,
  on,
  setOn,
}: {
  url: string;
  autoplay: boolean;
  on: boolean;
  setOn: (v: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      audio.play().catch(() => {
        // autoplay blocked — wait for user gesture
        const handler = () => {
          audio.play().catch(() => {});
          window.removeEventListener("click", handler);
          window.removeEventListener("touchstart", handler);
        };
        window.addEventListener("click", handler);
        window.addEventListener("touchstart", handler);
      });
    } else {
      audio.pause();
    }
    setReady(true);
  }, [on]);

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="auto" />
      <button
        onClick={() => setOn(!on)}
        className="fixed bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full glass-strong text-lg shadow-lg transition hover:scale-105"
        aria-label={on ? "Mute" : "Play music"}
        title={on ? "Mute" : "Play music"}
      >
        {ready ? (on ? "♪" : "♪̸") : "♪"}
      </button>
    </>
  );
}
