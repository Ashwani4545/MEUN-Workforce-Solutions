"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { personaType: "household", website: "" },
  });

  async function onSubmit(data: ContactInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
        <p className="font-display text-2xl">Message received.</p>
        <p className="mt-2 text-graphite">
          Our team will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — hidden from real visitors via CSS, not display:none, so bots
          that skip hidden fields still fill it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Input label="Full name" {...register("name")} error={errors.name?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Input label="Phone / WhatsApp" {...register("contact")} error={errors.contact?.message} placeholder="9876543210" />
        <Input label="City" {...register("city")} error={errors.city?.message} />
      </div>
      <Select
        label="I am reaching out as a"
        {...register("personaType")}
        error={errors.personaType?.message}
        options={[
          { label: "Household", value: "household" },
          { label: "Business", value: "business" },
          { label: "Professional looking for work", value: "professional" },
        ]}
      />
      <Textarea label="Message" {...register("message")} error={errors.message?.message} />

      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
