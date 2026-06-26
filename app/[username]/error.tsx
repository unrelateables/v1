"use client";

import Link from "next/link";

export default function ProfileError() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs text-red-400">{"// error"}</p>
      <h1 className="mt-3 text-2xl font-semibold">Couldn&apos;t load this page</h1>
      <p className="mt-2 text-sm text-neutral-500">
        This profile may be set to private, or something went wrong.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full border border-white/10 px-5 py-2 text-sm hover:bg-white/5"
      >
        Go home
      </Link>
    </main>
  );
}
