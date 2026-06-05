import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient, isServiceRoleConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const VALID_STATUSES = [
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
] as const;

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Backend not wired yet → return empty so the dashboard renders cleanly.
  if (!isServiceRoleConfigured()) {
    return NextResponse.json({ bookings: [], unconfigured: true });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const supabase = createAdminClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `guest_first_name.ilike.${term},guest_last_name.ilike.${term},booking_ref.ilike.${term}`,
    );
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ bookings: [], error: error.message });
  }
  return NextResponse.json({ bookings: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    booking_id?: string;
    status?: string;
    cancellation_reason?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { booking_id, status, cancellation_reason } = body;
  if (!booking_id || !status) {
    return NextResponse.json(
      { error: "booking_id and status are required" },
      { status: 400 },
    );
  }
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }

  const update: Record<string, unknown> = { status };
  if (status === "confirmed") update.confirmed_at = new Date().toISOString();
  if (status === "cancelled" && cancellation_reason) {
    update.cancellation_reason = cancellation_reason;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .update(update)
    .eq("id", booking_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, booking: data });
}
