"use client";

import { useState } from "react";
import type { AdminBooking } from "@/lib/admin-types";
import { fmtDate, fmtMoney, guestName } from "@/lib/admin-format";
import StatusBadge from "./StatusBadge";
import BookingDetailModal from "./BookingDetailModal";

const COLUMNS = [
  "Ref",
  "Guest",
  "Suite",
  "Check-in",
  "Nights",
  "Deposit",
  "Status",
  "Action",
];

export default function BookingsTable({
  bookings,
  onChanged,
  emptyLabel = "No bookings found",
}: {
  bookings: AdminBooking[];
  onChanged: () => void;
  emptyLabel?: string;
}) {
  const [selected, setSelected] = useState<AdminBooking | null>(null);

  return (
    <>
      <div className="bg-obsidian border border-graphite overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-graphite">
            <tr>
              {COLUMNS.map((c) => (
                <th
                  key={c}
                  className="font-dm-sans text-[10px] tracking-[0.15em] text-ivory/40 uppercase px-4 py-3 text-left"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-10 text-center font-dm-sans text-[14px] text-ivory/30"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-graphite/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-4 font-dm-sans text-[12px] text-gold font-medium">
                    {b.booking_ref}
                  </td>
                  <td className="px-4 py-4 font-dm-sans text-[13px] text-ivory">
                    {guestName(b)}
                  </td>
                  <td className="px-4 py-4 font-dm-sans text-[13px] text-ivory/60 truncate max-w-[120px]">
                    {b.suite_name || "—"}
                  </td>
                  <td className="px-4 py-4 font-dm-sans text-[13px] text-ivory/70">
                    {fmtDate(b.check_in)}
                  </td>
                  <td className="px-4 py-4 font-dm-sans text-[13px] text-ivory/70 text-center">
                    {b.nights ?? "—"}
                  </td>
                  <td className="px-4 py-4 font-dm-sans text-[13px] text-ivory/70">
                    {fmtMoney(b.deposit_amount)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelected(b)}
                      className="font-dm-sans text-[11px] tracking-[0.1em] uppercase text-ivory/50 hover:text-gold transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BookingDetailModal
        booking={selected}
        onClose={() => setSelected(null)}
        onChanged={onChanged}
      />
    </>
  );
}
