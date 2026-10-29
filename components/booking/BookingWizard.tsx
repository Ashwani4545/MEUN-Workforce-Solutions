"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Booking, BookingPackage, Worker } from "@/types";

const PACKAGES: { value: BookingPackage; label: string; hint: string }[] = [
  { value: "trial-day", label: "Trial day", hint: "Try before you commit" },
  { value: "part-time", label: "Part-time", hint: "A few hours, daily" },
  { value: "full-time", label: "Full-time", hint: "Full working day" },
  { value: "live-in", label: "Live-in", hint: "Residing at your home" },
];

const TIME_SLOTS = ["7:00 AM", "9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

type Step = 1 | 2 | 3 | 4 | 5;

interface PriceSummary {
  baseAmount: number;
  serviceFee: number;
  gstAmount: number;
  discount: number;
  total: number;
  couponCode?: string;
}

export function BookingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const workerId = searchParams.get("workerId");
  const [worker, setWorker] = useState<Worker | null>(null);
  const [workerLoading, setWorkerLoading] = useState(true);

  const [step, setStep] = useState<Step>(1);
  const [pkg, setPkg] = useState<BookingPackage>("part-time");
  const [subService, setSubService] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", pincode: "" });
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [price, setPrice] = useState<PriceSummary | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const idempotencyKey = useMemo(() => nanoid(24), []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(`/schedule${workerId ? `?workerId=${workerId}` : ""}`)}`);
    }
  }, [authLoading, user, router, workerId]);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken));
  }, []);

  useEffect(() => {
    if (!workerId) {
      setWorkerLoading(false);
      return;
    }
    fetch(`/api/workers/${workerId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.worker) {
          setWorker(d.worker);
          setSubService(d.worker.subServices[0] ?? "");
        }
      })
      .finally(() => setWorkerLoading(false));
  }, [workerId]);

  async function fetchPrice() {
    if (!worker) return;
    setPriceLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: worker.id, package: pkg, couponCode: coupon || undefined }),
      });
      const data = await res.json();
      if (res.ok) setPrice(data.priceSummary);
    } finally {
      setPriceLoading(false);
    }
  }

  useEffect(() => {
    if (step === 5 && worker) fetchPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function handleConfirm() {
    if (!worker) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          workerId: worker.id,
          category: worker.category,
          subService,
          package: pkg,
          date,
          timeSlot,
          address,
          notes,
          couponCode: coupon || undefined,
          idempotencyKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setConfirmed(data.booking);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || (workerId && workerLoading)) {
    return <div className="pt-40 pb-24 container-content text-graphite">Loading…</div>;
  }

  if (workerId && !worker) {
    return (
      <div className="pt-40 pb-24 container-content">
        <p className="font-display text-2xl">We couldn&apos;t find that professional.</p>
        <Button className="mt-6" onClick={() => router.push("/workers")}>
          Browse professionals
        </Button>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="pt-32 pb-24 container-content max-w-lg">
        <p className="eyebrow">Booking Confirmed</p>
        <h1 className="mt-3 font-display text-3xl">You&apos;re all set.</h1>
        <p className="mt-4 text-graphite">
          {worker?.name} is booked for {confirmed.date} at {confirmed.timeSlot}.
        </p>
        <div className="mt-8 border border-line rounded-xl p-6">
          <p className="text-sm text-graphite-light">Start OTP — share only when they arrive</p>
          <p className="mt-2 font-display text-4xl tracking-widest">{confirmed.startOtp}</p>
        </div>
        <div className="mt-6 flex justify-between text-sm border-t border-line pt-4">
          <span className="text-graphite-light">Total paid on completion</span>
          <span className="font-semibold">₹{confirmed.priceSummary.total.toLocaleString("en-IN")}</span>
        </div>
        <Button className="mt-8" onClick={() => router.push("/dashboard")}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 container-content max-w-2xl">
      <p className="eyebrow">Book a Professional</p>
      <h1 className="mt-3 font-display text-3xl">
        {worker ? `Booking ${worker.name}` : "Schedule your service"}
      </h1>

      <ol className="mt-8 flex gap-2 text-xs text-graphite-light">
        {["Package", "Schedule", "Address", "Notes", "Review"].map((label, i) => (
          <li
            key={label}
            className={
              "flex-1 border-t-2 pt-2 " +
              (step === i + 1 ? "border-ink text-ink font-medium" : "border-line")
            }
          >
            {label}
          </li>
        ))}
      </ol>

      {worker && (
        <div className="mt-8 flex items-center gap-4 border border-line rounded-xl p-4">
          <div className="relative h-14 w-14 rounded-full overflow-hidden bg-paper-dim shrink-0">
            <Image src={worker.photoUrl} alt="" fill className="object-cover" sizes="56px" />
          </div>
          <div>
            <p className="font-medium">{worker.name}</p>
            <p className="text-sm text-graphite-light">{worker.city} · {worker.experienceYears} yrs experience</p>
          </div>
        </div>
      )}

      <div className="mt-10">
        {step === 1 && (
          <div>
            <p className="font-medium mb-3">Choose a package</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PACKAGES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPkg(p.value)}
                  className={
                    "text-left rounded-xl border p-4 transition-colors " +
                    (pkg === p.value ? "border-ink bg-ink text-white" : "border-line hover:border-graphite-light")
                  }
                >
                  <span className="font-display text-lg">{p.label}</span>
                  <p className={"text-sm mt-1 " + (pkg === p.value ? "text-paper/70" : "text-graphite-light")}>
                    {p.hint}
                  </p>
                </button>
              ))}
            </div>

            {worker && worker.subServices.length > 0 && (
              <div className="mt-6">
                <Select
                  label="Specific service"
                  value={subService}
                  onChange={(e) => setSubService(e.target.value)}
                  options={worker.subServices.map((s) => ({ label: s, value: s }))}
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div>
              <p className="text-sm font-medium mb-1.5">Time slot</p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={
                      "text-sm rounded-xl border py-2 transition-colors " +
                      (timeSlot === slot ? "border-ink bg-ink text-white" : "border-line hover:border-graphite-light")
                    }
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6">
            <Input
              label="Address line 1"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              placeholder="House / flat, street"
            />
            <Input
              label="Address line 2 (optional)"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              placeholder="Landmark, apartment name"
            />
            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                label="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <Input
                label="Pincode"
                inputMode="numeric"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-6">
            <Textarea
              label="Anything the professional should know? (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate code, pets, specific instructions…"
            />
            <Input
              label="Coupon code (optional)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="MEUNWELCOME"
            />
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="border border-line rounded-xl divide-y divide-line">
              <div className="p-4 flex justify-between text-sm">
                <span className="text-graphite-light">Package</span>
                <span className="font-medium capitalize">{pkg.replace("-", " ")}</span>
              </div>
              <div className="p-4 flex justify-between text-sm">
                <span className="text-graphite-light">Date & time</span>
                <span className="font-medium">{date || "—"} · {timeSlot || "—"}</span>
              </div>
              <div className="p-4 flex justify-between text-sm">
                <span className="text-graphite-light">Address</span>
                <span className="font-medium text-right">{address.line1}, {address.city} {address.pincode}</span>
              </div>
            </div>

            <div className="mt-6 border border-line rounded-xl p-4">
              {priceLoading || !price ? (
                <p className="text-sm text-graphite-light">Calculating price…</p>
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-graphite-light">Base amount</span>
                    <span>₹{price.baseAmount.toLocaleString("en-IN")}</span>
                  </div>
                  {price.discount > 0 && (
                    <div className="flex justify-between text-ink">
                      <span>Coupon discount</span>
                      <span>−₹{price.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-graphite-light">Service fee</span>
                    <span>₹{price.serviceFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-graphite-light">GST (18%)</span>
                    <span>₹{price.gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t border-line pt-2 mt-1">
                    <span>Total</span>
                    <span>₹{price.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
          disabled={step === 1}
        >
          Back
        </Button>
        {step < 5 ? (
          <Button
            onClick={() => setStep((s) => (s < 5 ? ((s + 1) as Step) : s))}
            disabled={
              (step === 2 && (!date || !timeSlot)) ||
              (step === 3 && (!address.line1 || !address.city || !address.pincode))
            }
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handleConfirm} disabled={submitting || !worker}>
            {submitting ? "Confirming…" : "Confirm booking"}
          </Button>
        )}
      </div>
    </div>
  );
}
