// Admin-facing booking shape. These are the snake_case columns the admin API
// returns from the Supabase `bookings` table (the contract between the API
// routes and the dashboard UI).
export type AdminBookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export interface AdminBooking {
  id: string;
  booking_ref: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  suite_name?: string | null;
  suite_id?: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  num_guests?: number | null;
  price_per_night?: number | null;
  subtotal?: number | null;
  total?: number | null;
  deposit_amount: number;
  status: AdminBookingStatus;
  payment_proof_url?: string | null;
  special_requests?: string | null;
  cancellation_reason?: string | null;
  confirmed_at?: string | null;
  created_at: string;
}

export interface BookingsResponse {
  bookings: AdminBooking[];
  // Set when the Supabase service-role key / table isn't configured yet, so
  // the UI can show a clear banner instead of an empty-but-broken dashboard.
  unconfigured?: boolean;
  error?: string;
}
