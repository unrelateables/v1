import { loginAction } from "./actions";
import { AuthForm } from "@/components/auth-form";
import Link from "next/link";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <AuthForm
      mode="login"
      action={loginAction}
      error={searchParams.error}
      footer={
        <p className="text-center text-sm text-neutral-400">
          No account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      }
    />
  );
}
