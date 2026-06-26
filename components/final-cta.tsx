import { Reveal } from "@/components/reveal";
import Link from "next/link";
import { Button } from "@/components/ui";

export function FinalCta() {
  const steps = [
    { n: "1", t: "Sign up", d: "Pick your username." },
    { n: "2", t: "Add links", d: "Paste your URLs." },
    { n: "3", t: "Share it", d: "Drop it in your bio." },
  ];

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <Reveal>
        <p className="font-mono text-xs text-neutral-600">{"// get started"}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your page is 2 minutes away
        </h2>
      </Reveal>

      {/* steps */}
      <Reveal delay={120}>
        <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10">
          {steps.map((s) => (
            <div key={s.n} className="flex items-center gap-3 sm:gap-4">
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{s.t}</p>
                <p className="text-xs text-neutral-500">{s.d}</p>
              </div>
              {s.n !== "3" && (
                <span className="hidden text-neutral-700 sm:inline">→</span>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link href="/signup">
            <Button className="px-7 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5">
              Claim your username →
            </Button>
          </Link>
          <p className="font-mono text-xs text-neutral-600">
            free forever · no credit card · no catch
          </p>
        </div>
      </Reveal>
    </section>
  );
}
