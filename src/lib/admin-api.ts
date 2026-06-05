import type { AdminBooking, BookingsResponse } from "./admin-types";

// Client-side helpers for talking to the admin API routes.

export async function fetchBookings(params?: {
  status?: string;
  search?: string;
}): Promise<BookingsResponse> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);

  const res = await fetch(`/api/admin-bookings?${qs.toString()}`, {
    cache: "no-store",
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    return { bookings: [] };
  }
  return (await res.json()) as BookingsResponse;
}

export async function updateBookingStatus(
  bookingId: string,
  status: string,
  cancellationReason?: string,
): Promise<{ success?: boolean; booking?: AdminBooking; error?: string }> {
  const res = await fetch("/api/admin-bookings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      booking_id: bookingId,
      status,
      cancellation_reason: cancellationReason,
    }),
  });
  return res.json();
}

export async function getProofUrl(
  bookingId: string,
): Promise<{ signedUrl?: string; error?: string }> {
  const res = await fetch(
    `/api/admin-proof?booking_id=${encodeURIComponent(bookingId)}`,
    { cache: "no-store" },
  );
  return res.json();
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin-logout", { method: "POST" });
}
