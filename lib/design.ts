import type {
  FontFamily,
  Radius,
  NameSize,
  ButtonSize,
  AvatarShape,
  Layout,
  TextAlign,
} from "@/lib/types";

export const FONT_STACKS: Record<FontFamily, string> = {
  sans: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "ui-monospace, 'JetBrains Mono', 'Cascadia Code', Menlo, monospace",
  serif: "Georgia, 'Times New Roman', 'Playfair Display', serif",
  display: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
};

export const RADIUS: Record<Radius, string> = {
  none: "0px",
  sm: "0.375rem",
  md: "0.625rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

export const NAME_SIZE: Record<NameSize, string> = {
  sm: "1.25rem",
  md: "1.75rem",
  lg: "2.25rem",
  xl: "3rem",
};

export const BUTTON_PADDING: Record<ButtonSize, string> = {
  sm: "0.5rem 0.875rem",
  md: "0.75rem 1rem",
  lg: "1rem 1.25rem",
};

export function avatarRadiusClass(shape: AvatarShape): string {
  switch (shape) {
    case "circle":
      return "rounded-full";
    case "square":
      return "rounded-none";
    case "rounded":
      return "rounded-2xl";
  }
}

export function layoutAlign(layout: Layout): {
  items: string;
  text: string;
  container: string;
} {
  if (layout === "left") {
    return { items: "items-start", text: "text-left", container: "" };
  }
  return { items: "items-center", text: "text-center", container: "" };
}

export function textAlignClass(align: TextAlign): string {
  return align === "left" ? "text-left" : "text-center";
}
