import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/forms/AuthShell";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your bookings."
      footerText="New to MEUN?"
      footerLinkHref="/signup"
      footerLinkLabel="Create an account"
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
