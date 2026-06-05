import { NextResponse } from "next/server";
import {
  PAYMENT_PROOF_BUCKET,
  createAdminClient,
  isServiceRoleConfigured,
} from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

// Uploads a payment receipt to the private `payment-proofs` bucket using the
// service-role client (bypasses storage RLS) and returns the object path, which
// the booking row stores as `payment_proof_url`.
export async function POST(request: Request) {
  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured yet." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const bookingRef = String(formData.get("booking_ref") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WEBP, or PDF file." },
      { status: 415 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "That file exceeds the 10 MB limit." },
      { status: 413 },
    );
  }

  // Group by booking ref; fall back to a stable folder if absent.
  const folder = bookingRef.replace(/[^a-zA-Z0-9-_]/g, "") || "unsorted";
  const ext = EXT[file.type] ?? "bin";
  const path = `${folder}/receipt-${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(PAYMENT_PROOF_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, path });
}
