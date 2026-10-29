"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error ?? "Something went wrong.");
        return;
      }
      await refresh();
      router.push(searchParams.get("next") ?? "/dashboard");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} autoComplete="email" />
      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
        autoComplete="current-password"
      />

      {serverError && <p className="text-sm text-red-700">{serverError}</p>}

      <Button type="submit" size="lg" disabled={submitting} className="mt-2">
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
