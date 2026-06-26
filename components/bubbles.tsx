"use client";

const BUBBLES = [
  { left: "5%", size: 80, delay: 0, dur: 14 },
  { left: "15%", size: 40, delay: 3, dur: 10 },
  { left: "28%", size: 120, delay: 1, dur: 18 },
  { left: "42%", size: 60, delay: 5, dur: 12 },
  { left: "55%", size: 30, delay: 2, dur: 9 },
  { left: "66%", size: 90, delay: 7, dur: 16 },
  { left: "78%", size: 50, delay: 4, dur: 11 },
  { left: "88%", size: 100, delay: 6, dur: 17 },
  { left: "95%", size: 35, delay: 8, dur: 13 },
];

export function Bubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
