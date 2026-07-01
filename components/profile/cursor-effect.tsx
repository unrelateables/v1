"use client";

import { useEffect, useRef } from "react";
import type { CursorEffect } from "@/lib/types";

export function CursorEffect({ effect }: { effect: CursorEffect }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (effect === "none") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const particles: Particle[] = [];
    let hue = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      for (let i = 0; i < 2; i++) {
        particles.push(makeParticle(e.clientX, e.clientY));
      }
    }

    function makeParticle(x: number, y: number): Particle {
      const p: Particle = { x, y, vx: 0, vy: 0, life: 1, size: 4, color: "#fff", emoji: "" };
      switch (effect) {
        case "spark":
          p.vx = (Math.random() - 0.5) * 3;
          p.vy = (Math.random() - 0.5) * 3 - 1;
          p.size = Math.random() * 3 + 1;
          p.color = `hsl(${Math.random() * 40 + 20}, 100%, 60%)`;
          break;
        case "rainbow":
          hue = (hue + 8) % 360;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (Math.random() - 0.5) * 2 - 0.5;
          p.size = Math.random() * 4 + 3;
          p.color = `hsl(${hue}, 100%, 60%)`;
          break;
        case "trail":
          p.vx = (Math.random() - 0.5) * 0.5;
          p.vy = (Math.random() - 0.5) * 0.5;
          p.size = Math.random() * 3 + 2;
          p.color = "#ffffff";
          break;
        case "ripple":
          p.vx = (Math.random() - 0.5) * 4;
          p.vy = (Math.random() - 0.5) * 4;
          p.size = Math.random() * 4 + 2;
          p.color = ["#38bdf8", "#34d399", "#fbbf24", "#f472b6"][Math.floor(Math.random() * 4)];
          break;
        case "hearts":
          p.vx = (Math.random() - 0.5) * 1;
          p.vy = -Math.random() * 2 - 0.5;
          p.size = 14;
          p.emoji = "❤";
          break;
      }
      return p;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      color: string;
      emoji: string;
    }

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        if (p.emoji) {
          ctx.font = `${p.size}px sans-serif`;
          ctx.fillText(p.emoji, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [effect]);

  if (effect === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
