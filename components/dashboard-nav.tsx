"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard", label: "overview", icon: "▦" },
  { href: "/dashboard/profile", label: "profile", icon: "◉" },
  { href: "/dashboard/links", label: "links", icon: "↗" },
  { href: "/dashboard/embeds", label: "embeds", icon: "▤" },
  { href: "/dashboard/appearance", label: "appearance", icon: "✦" },
  { href: "/dashboard/settings", label: "settings", icon: "⚙" },
];

export function DashboardNav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="border-b border-white/5 lg:h-screen lg:w-60 lg:border-b-0 lg:border-r lg:bg-black/20 lg:backdrop-blur-sm">
      {/* logo — mono, matches landing */}
      <div className="px-6 py-5">
        <Link href="/" className="font-mono text-sm text-neutral-200">
          biolink
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex shrink-0 items-center gap-3 rounded-full px-3 py-2 text-sm transition",
                active
                  ? "bg-white/[0.07] font-medium text-white"
                  : "text-neutral-500 hover:bg-white/[0.03] hover:text-neutral-200"
              )}
            >
              <span className="font-mono text-xs opacity-50">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-white/5 px-3 py-4 lg:block">
        <Link
          href="/leaderboard"
          className="mb-0.5 flex items-center gap-3 rounded-full px-3 py-2 text-sm text-neutral-500 transition hover:bg-white/[0.03] hover:text-neutral-200"
        >
          <span className="font-mono text-xs opacity-50">▴</span>
          leaderboard
        </Link>
        <Link
          href={`/${profile.username}`}
          target="_blank"
          className="mb-0.5 flex items-center justify-between rounded-full px-3 py-2 text-sm text-neutral-500 transition hover:bg-white/[0.03] hover:text-neutral-200"
        >
          <span>view page</span>
          <span className="font-mono text-xs opacity-50">↗</span>
        </Link>
        {profile.role === "admin" && (
          <Link
            href="/admin"
            className="mb-0.5 flex items-center gap-3 rounded-full px-3 py-2 text-sm text-amber-400/90 transition hover:bg-white/[0.03]"
          >
            <span className="font-mono text-xs opacity-50">★</span>
            admin
          </Link>
        )}
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-sm text-neutral-500 transition hover:bg-white/[0.03] hover:text-neutral-200"
        >
          <span className="font-mono text-xs opacity-50">⏻</span>
          sign out
        </button>
      </div>
    </aside>
  );
}
