import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { generateBookingRef } from "@/lib/utils";

export const runtime = "nodejs";

// Public booking submission. Inserts a reservation with the service-role client
// (bypasses RLS) so guests can create bookings without an authenticated session.
const bookingSchema = z.object({
  booking_ref: z.string().optional(),
  suite_id: z.string().optional(),
  suite_slug: z.string().optional(),
  suite_name: z.string().min(1, "suite_name is required"),
  guest_first_name: z.string().min(1, "guest_first_name is required"),
  guest_last_name: z.string().min(1, "guest_last_name is required"),
  guest_email: z.string().email("valid guest_email is required"),
  guest_phone: z.string().min(1, "guest_phone is required"),
  guest_country: z.string().optional(),
  special_requests: z.string().optional(),
  check_in: z.string().min(1, "check_in is required"),
  check_out: z.string().min(1, "check_out is required"),
  num_nights: z.number().int().positive(),
  num_guests: z.number().int().positive(),
  price_per_night: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
  deposit_amount: z.number().nonnegative(),
  deposit_percentage: z.number().optional(),
  balance_due: z.number().optional(),
  total_amount: z.number().nonnegative(),
  status: z.string().optional(),
  source: z.string().optional(),
  payment_proof_url: z.string().optional(),
});

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const b = parsed.data;

  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured (missing SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();

  // `bookings.suite_id` is a UUID FK to `suites`. The public payload sends a
  // slug, so resolve it to the suite's UUID (accepting a UUID directly too).
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let suiteId: string | null = null;
  if (b.suite_id && UUID_RE.test(b.suite_id)) {
    suiteId = b.suite_id;
  } else {
    const slug = b.suite_slug ?? b.suite_id;
    if (slug) {
      const { data: suite } = await supabase
        .from("suites")
        .select("id")
        .eq("slug", slug)
        .single();
      suiteId = (suite?.id as string | undefined) ?? null;
    }
  }
  if (!suiteId) {
    return NextResponse.json(
      { error: `Unknown suite: ${b.suite_slug ?? b.suite_id ?? "(none)"}` },
      { status: 400 },
    );
  }

  // Map the public payload to the bookings table columns.
  const row = {
    booking_ref: b.booking_ref ?? generateBookingRef(),
    suite_id: suiteId,
    suite_name: b.suite_name,
    guest_first_name: b.guest_first_name,
    guest_last_name: b.guest_last_name,
    guest_email: b.guest_email,
    guest_phone: b.guest_phone,
    guest_country: b.guest_country ?? null,
    special_requests: b.special_requests ?? null,
    check_in: b.check_in,
    check_out: b.check_out,
    num_nights: b.num_nights,
    num_guests: b.num_guests,
    price_per_night: b.price_per_night,
    subtotal: b.subtotal,
    deposit_amount: b.deposit_amount,
    deposit_percentage: b.deposit_percentage ?? 30,
    balance_due: b.balance_due ?? b.total_amount - b.deposit_amount,
    total_amount: b.total_amount,
    status: b.status ?? "pending",
    source: b.source ?? "website",
    ...(b.payment_proof_url
      ? {
          payment_proof_url: b.payment_proof_url,
          payment_proof_uploaded_at: new Date().toISOString(),
        }
      : {}),
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code, hint: error.hint },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, booking: data }, { status: 201 });
}
