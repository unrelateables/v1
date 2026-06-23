"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/profile", label: "Profile", icon: "◉" },
  { href: "/dashboard/links", label: "Links", icon: "↗" },
  { href: "/dashboard/embeds", label: "Embeds", icon: "▤" },
  { href: "/dashboard/appearance", label: "Appearance", icon: "✦" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
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
    <aside className="border-b border-white/5 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2 px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm shadow-lg shadow-accent/30">
            b
          </span>
          biolink
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-3">
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
                "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
              )}
            >
              <span className="opacity-60">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-white/5 px-3 py-4 lg:block">
        <Link
          href={`/${profile.username}`}
          target="_blank"
          className="mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
        >
          <span>View page ↗</span>
        </Link>
        {profile.role === "admin" && (
          <Link
            href="/admin"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-amber-400 hover:bg-white/5"
          >
            <span className="opacity-60">★</span>
            Admin
          </Link>
        )}
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
        >
          <span className="opacity-60">⏻</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
