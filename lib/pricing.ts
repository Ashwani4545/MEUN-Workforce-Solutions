import type { BookingPackage, Worker } from "@/types";

// All pricing is computed here, server-side, from the worker's listed rate
// and the selected package — never trusted from client input. A coupon
// code only ever multiplies a total we already calculated ourselves.
const PACKAGE_MULTIPLIER: Record<BookingPackage, number> = {
  "trial-day": 0.15,
  "part-time": 1,
  "full-time": 2.1,
  "live-in": 3.4,
};

const SERVICE_FEE_FLAT = 149;
const GST_RATE = 0.18;

const VALID_COUPONS: Record<string, number> = {
  MEUNWELCOME: 0.1, // 10% off, first booking
};

export function calculatePrice(
  worker: Pick<Worker, "salaryFrom" | "salaryTo">,
  pkg: BookingPackage,
  couponCode?: string
) {
  const avgRate = (worker.salaryFrom + worker.salaryTo) / 2;
  const baseAmount = Math.round(avgRate * PACKAGE_MULTIPLIER[pkg]);

  let discount = 0;
  const code = couponCode?.trim().toUpperCase();
  if (code && VALID_COUPONS[code]) {
    discount = Math.round(baseAmount * VALID_COUPONS[code]);
  }

  const discountedBase = baseAmount - discount;
  const gstAmount = Math.round((discountedBase + SERVICE_FEE_FLAT) * GST_RATE);
  const total = discountedBase + SERVICE_FEE_FLAT + gstAmount;

  return {
    baseAmount,
    serviceFee: SERVICE_FEE_FLAT,
    gstAmount,
    discount,
    total,
    couponCode: code && VALID_COUPONS[code] ? code : undefined,
  };
}
