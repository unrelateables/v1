"use client";

import { useEffect, useRef } from "react";
import type { ProfileEffects } from "@/lib/types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  kind: "star" | "heart" | "snow" | "rain";
}

export function EffectsLayer({
  effects,
  accent,
}: {
  effects: ProfileEffects;
  accent: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const enabled: Particle["kind"][] = [];
    if (effects.particles === "stars") enabled.push("star");
    if (effects.particles === "hearts") enabled.push("heart");
    if (effects.snow) enabled.push("snow");
    if (effects.rain) enabled.push("rain");
    if (enabled.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function spawn(kind: Particle["kind"]): Particle {
      const w = window.innerWidth;
      if (kind === "snow") {
        return {
          x: Math.random() * w,
          y: -10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0.5 + Math.random() * 1.5,
          size: 1 + Math.random() * 3,
          alpha: 0.5 + Math.random() * 0.5,
          kind,
        };
      }
      if (kind === "rain") {
        return {
          x: Math.random() * w,
          y: -20,
          vx: -0.5,
          vy: 6 + Math.random() * 6,
          size: 1 + Math.random() * 1.5,
          alpha: 0.3 + Math.random() * 0.3,
          kind,
        };
      }
      // floating stars / hearts
      return {
        x: Math.random() * w,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 2 + Math.random() * 3,
        alpha: 0.4 + Math.random() * 0.6,
        kind,
      };
    }

    const counts: Record<Particle["kind"], number> = {
      star: 80,
      heart: 40,
      snow: 120,
      rain: 140,
    };
    enabled.forEach((k) => {
      const n = counts[k];
      for (let i = 0; i < n; i++) {
        const p = spawn(k);
        // spread initial positions across screen
        p.y = Math.random() * window.innerHeight;
        particles.push(p);
      }
    });

    function drawHeart(x: number, y: number, s: number, color: string) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s / 10, s / 10);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(0, -1, -5, -1, -5, 3);
      ctx.bezierCurveTo(-5, 7, 0, 9, 0, 12);
      ctx.bezierCurveTo(0, 9, 5, 7, 5, 3);
      ctx.bezierCurveTo(5, -1, 0, -1, 0, 3);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // recycle off-screen particles
        const h = window.innerHeight;
        const w = window.innerWidth;
        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.globalAlpha = p.alpha;
        if (p.kind === "star") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "snow") {
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "rain") {
          ctx.strokeStyle = "rgba(170,200,255,0.6)";
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy);
          ctx.stroke();
        } else if (p.kind === "heart") {
          drawHeart(p.x, p.y, p.size * 2.5, accent);
        }
      }
      ctx.restore();
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      particles = [];
    };
  }, [effects.particles, effects.snow, effects.rain, accent]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-[5]"
      aria-hidden
    />
  );
}
