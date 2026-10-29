import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/forms/AuthShell";
import { SignupForm } from "@/components/forms/SignupForm";

export const metadata: Metadata = { title: "Create Your Account" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Book verified professionals in minutes."
      footerText="Already have an account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
