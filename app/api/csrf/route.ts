import { NextResponse } from "next/server";
import { ensureCsrfCookie } from "@/lib/csrf";

export async function GET() {
  const token = ensureCsrfCookie();
  return NextResponse.json({ csrfToken: token });
}
