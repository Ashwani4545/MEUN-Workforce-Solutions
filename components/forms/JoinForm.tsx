"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const joinSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  contact: z.string().trim().regex(/^(?:\+91)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email address"),
  city: z.string().trim().min(2, "Enter your city"),
  category: z.string().min(1, "Select a category"),
  experienceYears: z.coerce.number().min(0).max(50),
  message: z.string().trim().max(1000).optional().default(""),
  website: z.string().max(0).optional().or(z.literal("")),
});
type JoinInput = z.infer<typeof joinSchema>;

const CATEGORY_OPTIONS = [
  "Maid", "Cook", "Driver", "Babysitter", "Elder Care", "Security Guard",
  "Office Boy", "Housekeeping", "Cleaner", "Gardener", "Electrician",
  "Plumber", "AC Repair", "Carpenter", "Deep Cleaning",
].map((c) => ({ label: c, value: c }));

export function JoinForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JoinInput>({ resolver: zodResolver(joinSchema), defaultValues: { website: "" } });

  async function onSubmit(data: JoinInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          contact: data.contact,
          email: data.email,
          city: data.city,
          personaType: "professional",
          message: `Applying as: ${data.category}. Experience: ${data.experienceYears} years. ${data.message ?? ""}`,
          website: data.website,
        }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line rounded-xl p-8 text-center">
        <p className="font-display text-2xl">Application received.</p>
        <p className="mt-2 text-graphite">
          Our verification team will contact you within 2–3 business days
          about next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="join-website">Leave this field empty</label>
        <input id="join-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Input label="Full name" {...register("name")} error={errors.name?.message} />
      <div className="grid sm:grid-cols-2 gap-5">
        <Input label="Mobile number" {...register("contact")} error={errors.contact?.message} placeholder="9876543210" />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Input label="City" {...register("city")} error={errors.city?.message} />
        <Input
          label="Years of experience"
          type="number"
          min={0}
          {...register("experienceYears")}
          error={errors.experienceYears?.message}
        />
      </div>
      <Select
        label="What kind of work are you looking for?"
        {...register("category")}
        error={errors.category?.message}
        placeholder="Select a category"
        options={CATEGORY_OPTIONS}
      />
      <Textarea
        label="Anything else we should know? (optional)"
        {...register("message")}
        error={errors.message?.message}
      />

      {status === "error" && (
        <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
