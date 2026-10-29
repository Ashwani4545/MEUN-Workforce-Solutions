import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { contactSchema } from "@/lib/validations";
import { saveContactSubmission } from "@/lib/db";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const limit = rateLimit(clientKeyFromRequest(req, "contact"), 5, 60 * 10);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Honeypot: a real visitor never fills this field in.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }); // pretend success, drop silently
  }

  const submission = {
    id: nanoid(16),
    name: parsed.data.name,
    contact: parsed.data.contact,
    email: parsed.data.email,
    city: parsed.data.city,
    personaType: parsed.data.personaType,
    message: parsed.data.message,
    createdAt: new Date().toISOString(),
  };

  await saveContactSubmission(submission);

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MEUN Website <no-reply@meun.in>",
          to: [notifyEmail],
          subject: `New ${parsed.data.personaType} enquiry — ${parsed.data.name}`,
          text: `Name: ${parsed.data.name}\nContact: ${parsed.data.contact}\nEmail: ${parsed.data.email}\nCity: ${parsed.data.city}\n\n${parsed.data.message}`,
        }),
      });
    } catch {
      // Submission is already saved to disk; email delivery is best-effort.
    }
  }

  return NextResponse.json({ ok: true });
}
