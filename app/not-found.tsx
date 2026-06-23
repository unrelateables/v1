import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-neutral-400">
        This page doesn&apos;t exist or isn&apos;t public.
      </p>
      <Link href="/" className="mt-6">
        <Button>Go home</Button>
      </Link>
    </main>
  );
}
