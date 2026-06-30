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
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (on) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay blocked by browser — show prompt
          setNeedsTap(true);
        });
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, [on, url]);

  // If user wanted autoplay but it was blocked, listen for first interaction
  useEffect(() => {
    if (!needsTap) return;
    const audio = audioRef.current;
    function start() {
      audio
        ?.play()
        .then(() => {
          setPlaying(true);
          setNeedsTap(false);
        })
        .catch(() => {});
    }
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
  }, [needsTap]);

  return (
    <>
      <audio
        ref={audioRef}
        src={url}
        loop
        preload="auto"
        onError={() => setNeedsTap(false)}
      />

      {/* Tap-to-play prompt when autoplay blocked */}
      {needsTap && (
        <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
          <button
            onClick={() => {
              audioRef.current
                ?.play()
                .then(() => {
                  setPlaying(true);
                  setNeedsTap(false);
                })
                .catch(() => {});
            }}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-2xl transition hover:scale-105"
          >
            <span className="text-base">▶</span>
            Play music
          </button>
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => {
          setOn(!on);
          if (!on) {
            audioRef.current
              ?.play()
              .then(() => setPlaying(true))
              .catch(() => setNeedsTap(true));
          } else {
            audioRef.current?.pause();
            setPlaying(false);
          }
        }}
        className={`fixed bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full text-lg shadow-2xl transition hover:scale-110 ${
          playing
            ? "bg-white text-black"
            : "border border-white/20 bg-black/50 text-white backdrop-blur"
        }`}
        aria-label={playing ? "Pause music" : "Play music"}
        title={playing ? "Pause music" : "Play music"}
      >
        {playing ? (
          <span className="flex items-end gap-0.5">
            <span className="inline-block h-2 w-0.5 animate-pulse rounded-full bg-black [animation-delay:0ms]" />
            <span className="inline-block h-3 w-0.5 animate-pulse rounded-full bg-black [animation-delay:150ms]" />
            <span className="inline-block h-1.5 w-0.5 animate-pulse rounded-full bg-black [animation-delay:300ms]" />
          </span>
        ) : (
          "♪"
        )}
      </button>
    </>
  );
}
