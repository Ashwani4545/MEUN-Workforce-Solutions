import { z } from "zod";

// Indian phone number: optional +91, 10 digits starting 6-9
const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().trim().min(2, "Select your city").max(60),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
  role: z.enum(["customer", "worker"]),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  contact: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit mobile/WhatsApp number"),
  email: z.string().trim().email("Enter a valid email address"),
  city: z.string().trim().min(2, "Enter your city").max(60),
  personaType: z.enum(["household", "business", "professional"]),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
  // Honeypot field: must stay empty. Bots that auto-fill every input trip it.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const bookingSchema = z.object({
  workerId: z.string().min(1),
  category: z.string().min(1),
  subService: z.string().min(1),
  package: z.enum(["part-time", "full-time", "live-in", "trial-day"]),
  date: z.string().min(1, "Choose a date"),
  timeSlot: z.string().min(1, "Choose a time slot"),
  address: z.object({
    line1: z.string().trim().min(4, "Enter your address"),
    line2: z.string().trim().max(120).optional(),
    city: z.string().trim().min(2),
    pincode: z.string().trim().regex(pincodeRegex, "Enter a valid 6-digit pincode"),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  notes: z.string().trim().max(500).optional().default(""),
  couponCode: z.string().trim().max(30).optional(),
  idempotencyKey: z.string().min(10),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const workerFilterSchema = z.object({
  category: z.string().optional(),
  gender: z.enum(["male", "female", "any"]).optional(),
  ageBand: z.string().optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  salaryType: z.string().optional(),
  availability: z.string().optional(),
  city: z.string().optional(),
  q: z.string().optional(),
});
