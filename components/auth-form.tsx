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
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-lg shadow-lg shadow-accent/30">
              b
            </span>
            biolink
          </Link>
          <h1 className="mt-6 text-2xl font-bold">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
        </div>

        <div className="glass rounded-2xl p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}
          {notice && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
              {notice}
            </div>
          )}
          <form action={action} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="username">Username</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
