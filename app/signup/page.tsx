import { signupAction } from "./actions";
import { AuthForm } from "@/components/auth-form";
import Link from "next/link";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; notice?: string };
}) {
  return (
    <AuthForm
      mode="signup"
      action={signupAction}
      error={searchParams.error}
      notice={searchParams.notice === "check-email" ? "Check your email to confirm your account." : undefined}
      footer={
        <p className="text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      }
    />
  );
}
