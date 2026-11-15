import { NextResponse } from "next/server";
import { marketplaceEnabled } from "@/lib/features";
import { getWorkerById } from "@/lib/db";

// The marketplace switch is read per request; never freeze it at build time.
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!marketplaceEnabled()) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }
  const worker = await getWorkerById(params.id);
  if (!worker) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ worker });
}
