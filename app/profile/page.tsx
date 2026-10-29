"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCity(user.city ?? "");
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/csrf").then((r) => r.json()).then((d) => setCsrfToken(d.csrfToken));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify({ name, city }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      await refresh();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  if (loading || !user) {
    return <div className="pt-40 pb-24 container-content text-graphite">Loading…</div>;
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 container-content max-w-md">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 font-display text-3xl">Your profile</h1>

      <form onSubmit={handleSave} className="mt-8 flex flex-col gap-5">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="Email" value={user.email} disabled hint="Contact support to change your email." />

        {status === "error" && <p className="text-sm text-red-700">Something went wrong. Please try again.</p>}
        {status === "saved" && <p className="text-sm text-ink">Profile updated.</p>}

        <Button type="submit" disabled={status === "saving"} className="mt-2">
          {status === "saving" ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
