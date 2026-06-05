import { format, parseISO } from "date-fns";
import type { AdminBooking } from "./admin-types";

export function fmtDate(value?: string | null): string {
  if (!value) return "—";
  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}

export function fmtMoney(amount?: number | null): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function guestName(b: Pick<AdminBooking, "guest_first_name" | "guest_last_name">): string {
  return `${b.guest_first_name ?? ""} ${b.guest_last_name ?? ""}`.trim() || "—";
}

export function initials(b: Pick<AdminBooking, "guest_first_name" | "guest_last_name">): string {
  const f = (b.guest_first_name ?? "").charAt(0);
  const l = (b.guest_last_name ?? "").charAt(0);
  return `${f}${l}`.toUpperCase() || "—";
}
