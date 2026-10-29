import { NextResponse } from "next/server";
import { getWorkerById } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const worker = await getWorkerById(params.id);
  if (!worker) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ worker });
}
