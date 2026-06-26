"use client";

import Link from "next/link";
import { Button, Input, Label } from "@/components/ui";

export function AuthForm({
  mode,
  action,
  footer,
  error,
  notice,
}: {
  mode: "login" | "signup";
  action: (formData: FormData) => void;
  footer?: React.ReactNode;
  error?: string;
  notice?: string;
}) {
  const isSignup = mode === "signup";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      {/* grid backdrop */}
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" aria-hidden />
      {/* top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <Link href="/" className="font-mono text-sm text-neutral-200">
            biolink
          </Link>
          <p className="mt-5 font-mono text-xs text-neutral-600">
            {isSignup ? "// sign up" : "// log in"}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {isSignup ? "Make your page" : "Welcome back"}
          </h1>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}
          {notice && (
            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
              {notice}
            </div>
          )}
          <form action={action} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="username">username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="yourname"
                  autoComplete="username"
                  required
                  minLength={3}
                  maxLength={24}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full">
              {isSignup ? "Create account" : "Log in"}
            </Button>
          </form>
        </div>

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </main>
  );
}
