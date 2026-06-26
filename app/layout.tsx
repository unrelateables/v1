import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "biolink — one page, all your links",
  description:
    "A free, customizable link-in-bio page. Backgrounds, effects, music, and analytics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={body.variable}>
      <body>{children}</body>
    </html>
  );
}
