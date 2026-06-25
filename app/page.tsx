import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { redirect } from "next/navigation";

export default async function Landing() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* animated gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <div className="flex flex-col items-center text-center animate-fade-in">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-3xl font-bold shadow-lg shadow-accent/30">
          b
        </div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          your link, <span className="text-accent">your vibe</span>
        </h1>
        <p className="mt-5 max-w-md text-base text-neutral-400">
          Build a beautiful, customizable page for all your links — backgrounds,
          effects, music, and more. Free forever.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button className="px-6 py-3 text-base">Claim your page</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="px-6 py-3 text-base">
              Log in
            </Button>
          </Link>
        </div>
        <p className="mt-10 text-xs text-neutral-600">
          no paid features · free hosting · open to everyone
        </p>
      </div>
    </main>
  );
}
