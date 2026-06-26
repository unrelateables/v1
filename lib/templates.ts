import type { ProfileSettings } from "@/lib/types";

export interface Template {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Partial settings overlay applied on top of defaults. */
  apply: Partial<ProfileSettings>;
  /** A preview swatch gradient. */
  swatch: string;
}

// One-click templates. Each overlays a curated combination of settings.
export const TEMPLATES: Template[] = [
  {
    id: "default",
    name: "Default",
    emoji: "◻️",
    description: "Clean dark glass.",
    swatch: "linear-gradient(135deg,#0f172a,#1e1b4b)",
    apply: {
      bg_type: "solid",
      bg_value: "#0a0a0f",
      bg_overlay: 30,
      accent_color: "#6366f1",
      text_color: "#ffffff",
      glassmorphism: true,
      button_style: "glass",
      layout: "centered",
      font_family: "sans",
      radius: "lg",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    emoji: "◐",
    description: "Stark, no effects.",
    swatch: "linear-gradient(135deg,#000000,#171717)",
    apply: {
      bg_type: "solid",
      bg_value: "#000000",
      bg_overlay: 0,
      accent_color: "#ffffff",
      text_color: "#fafafa",
      glassmorphism: false,
      button_style: "outline",
      layout: "centered",
      font_family: "mono",
      radius: "none",
    },
  },
  {
    id: "neon",
    name: "Neon",
    emoji: "⚡",
    description: "Dark + bright accent.",
    swatch: "linear-gradient(135deg,#050505,#1a0b2e)",
    apply: {
      bg_type: "gradient",
      bg_value: "linear-gradient(135deg,#050510,#1a0b2e)",
      bg_overlay: 20,
      accent_color: "#22d3ee",
      text_color: "#e0f7ff",
      glassmorphism: true,
      button_style: "glass",
      layout: "centered",
      font_family: "mono",
      radius: "md",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    description: "Warm gradient.",
    swatch: "linear-gradient(135deg,#fb7185,#f59e0b)",
    apply: {
      bg_type: "gradient",
      bg_value: "linear-gradient(160deg,#7c2d12,#fb7185,#f59e0b)",
      bg_overlay: 25,
      accent_color: "#fde68a",
      text_color: "#fff7ed",
      glassmorphism: true,
      button_style: "glass",
      layout: "centered",
      font_family: "sans",
      radius: "xl",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    emoji: "🌌",
    description: "Teal & purple.",
    swatch: "linear-gradient(135deg,#10b981,#7c3aed)",
    apply: {
      bg_type: "gradient",
      bg_value: "linear-gradient(160deg,#042f2e,#0f766e,#4c1d95)",
      bg_overlay: 20,
      accent_color: "#6ee7b7",
      text_color: "#ecfdf5",
      glassmorphism: true,
      button_style: "glass",
      layout: "centered",
      font_family: "sans",
      radius: "lg",
    },
  },
  {
    id: "sakura",
    name: "Sakura",
    emoji: "🌸",
    description: "Soft pink, Japanese feel.",
    swatch: "linear-gradient(135deg,#fbcfe8,#fde68a)",
    apply: {
      bg_type: "gradient",
      bg_value: "linear-gradient(160deg,#831843,#f9a8d4,#fde68a)",
      bg_overlay: 25,
      accent_color: "#f472b6",
      text_color: "#fff1f2",
      glassmorphism: true,
      button_style: "glass",
      layout: "centered",
      font_family: "serif",
      radius: "xl",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    emoji: "🤖",
    description: "Neon pink, mono, sharp.",
    swatch: "linear-gradient(135deg,#1a0033,#ff0080)",
    apply: {
      bg_type: "gradient",
      bg_value: "linear-gradient(160deg,#0a0014,#2d0a3d,#0a0014)",
      bg_overlay: 15,
      accent_color: "#ff0080",
      text_color: "#f0abfc",
      glassmorphism: false,
      button_style: "outline",
      layout: "centered",
      font_family: "mono",
      radius: "none",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    description: "Deep blue calm.",
    swatch: "linear-gradient(135deg,#0c4a6e,#0891b2)",
    apply: {
      bg_type: "gradient",
      bg_value: "linear-gradient(180deg,#020617,#0c4a6e,#155e75)",
      bg_overlay: 20,
      accent_color: "#38bdf8",
      text_color: "#f0f9ff",
      glassmorphism: true,
      button_style: "glass",
      layout: "centered",
      font_family: "sans",
      radius: "lg",
    },
  },
  {
    id: "paper",
    name: "Paper",
    emoji: "📄",
    description: "Light mode, serif.",
    swatch: "linear-gradient(135deg,#fafaf9,#e7e5e4)",
    apply: {
      bg_type: "solid",
      bg_value: "#f5f5f4",
      bg_overlay: 0,
      accent_color: "#1c1917",
      text_color: "#1c1917",
      glassmorphism: false,
      button_style: "filled",
      layout: "centered",
      font_family: "serif",
      radius: "md",
    },
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
