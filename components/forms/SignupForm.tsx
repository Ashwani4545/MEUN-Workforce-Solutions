"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "customer" },
  });

  async function onSubmit(data: SignupInput) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
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
      <Input label="Full name" {...register("name")} error={errors.name?.message} autoComplete="name" />
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} autoComplete="email" />
      <Input
        label="Mobile number"
        {...register("phone")}
        error={errors.phone?.message}
        placeholder="9876543210"
        autoComplete="tel"
      />
      <Select
        label="City"
        {...register("city")}
        error={errors.city?.message}
        placeholder="Select your city"
        options={[
          { label: "Delhi NCR", value: "Delhi NCR" },
          { label: "Mumbai", value: "Mumbai" },
          { label: "Bengaluru", value: "Bengaluru" },
          { label: "Pune", value: "Pune" },
          { label: "Hyderabad", value: "Hyderabad" },
        ]}
      />
      <Select
        label="I am signing up as a"
        {...register("role")}
        error={errors.role?.message}
        options={[
          { label: "Household / Business (looking for help)", value: "customer" },
          { label: "Professional (looking for work)", value: "worker" },
        ]}
      />
      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
        hint="At least 8 characters, with an uppercase letter, lowercase letter and a number."
        autoComplete="new-password"
      />

      {serverError && <p className="text-sm text-red-700">{serverError}</p>}

      <Button type="submit" size="lg" disabled={submitting} className="mt-2">
        {submitting ? "Creating your account…" : "Create account"}
      </Button>
    </form>
  );
}
