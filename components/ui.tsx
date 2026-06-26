import { clsx } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "outline";
}) {
  const variants = {
    primary:
      "bg-neutral-100 text-black hover:bg-white disabled:opacity-40",
    ghost: "bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200",
    outline: "border border-white/10 hover:bg-white/[0.04] text-neutral-200",
    danger: "bg-red-500/90 hover:bg-red-500 text-white",
  };
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-white/25 focus:bg-white/[0.04]",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-white/25 focus:bg-white/[0.04]",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx(
        "mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-neutral-500",
        className
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-neutral-400">
      {children}
    </span>
  );
}
