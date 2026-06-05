import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import {
  PAYMENT_PROOF_BUCKET,
  createAdminClient,
  isServiceRoleConfigured,
} from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookingId = request.nextUrl.searchParams.get("booking_id");
  if (!bookingId) {
    return NextResponse.json(
      { error: "booking_id is required" },
      { status: 400 },
    );
  }

  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured yet." },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("payment_proof_url")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const proof = booking.payment_proof_url as string | null;
  if (!proof) {
    return NextResponse.json({ error: "No proof uploaded" }, { status: 404 });
  }

  // Already a full URL (e.g. a public bucket) — hand it back as-is.
  if (/^https?:\/\//i.test(proof)) {
    return NextResponse.json({ signedUrl: proof });
  }

  // Otherwise treat it as an object path inside the private receipts bucket.
  const path = proof.replace(new RegExp(`^${PAYMENT_PROOF_BUCKET}/`), "");
  const { data: signed, error: signError } = await supabase.storage
    .from(PAYMENT_PROOF_BUCKET)
    .createSignedUrl(path, 60 * 60); // 60 minutes

  if (signError || !signed) {
    return NextResponse.json(
      { error: "Could not generate proof link." },
      { status: 500 },
    );
  }
  return NextResponse.json({ signedUrl: signed.signedUrl });
}
