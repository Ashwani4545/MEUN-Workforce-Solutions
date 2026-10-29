// Shared domain types. These mirror the shape a real Drizzle/Postgres schema
// would use, so swapping lib/db.ts for a real database later is a drop-in
// change rather than a rewrite of anything that consumes this data.

export type UserRole = "customer" | "worker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  city: string | null;
  createdAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

export type WorkerCategory =
  | "maid"
  | "cook"
  | "driver"
  | "babysitter"
  | "elder-care"
  | "security-guard"
  | "office-boy"
  | "housekeeping"
  | "cleaner"
  | "gardener"
  | "electrician"
  | "plumber"
  | "ac-repair"
  | "carpenter"
  | "deep-cleaning";

export type SalaryType = "monthly" | "per-visit" | "hourly" | "per-job";
export type Gender = "male" | "female" | "any";
export type AgeBand = "18-25" | "26-35" | "36-45" | "46-55" | "56+";

export interface VerificationStatus {
  policeVerified: boolean;
  backgroundVerified: boolean;
  kycVerified: boolean;
  medicalCheckup: boolean;
  vaccinated: boolean;
  trainingCertified: boolean;
}

export interface Worker {
  id: string;
  name: string;
  category: WorkerCategory;
  subServices: string[];
  gender: Gender;
  ageBand: AgeBand;
  city: string;
  areas: string[];
  experienceYears: number;
  languages: string[];
  salaryType: SalaryType;
  salaryFrom: number;
  salaryTo: number;
  availability: ("full-time" | "part-time" | "live-in" | "trial-day")[];
  verification: VerificationStatus;
  bio: string;
  photoUrl: string;
}

export type BookingPackage = "part-time" | "full-time" | "live-in" | "trial-day";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  idempotencyKey: string;
  userId: string;
  workerId: string;
  category: WorkerCategory;
  subService: string;
  package: BookingPackage;
  date: string;
  timeSlot: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    pincode: string;
    lat?: number;
    lng?: number;
  };
  notes: string;
  priceSummary: {
    baseAmount: number;
    serviceFee: number;
    gstAmount: number;
    discount: number;
    total: number;
    couponCode?: string;
  };
  status: BookingStatus;
  startOtp: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  contact: string;
  email: string;
  city: string;
  personaType: "household" | "business" | "professional";
  message: string;
  createdAt: string;
}
