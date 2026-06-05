"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminBooking } from "@/lib/admin-types";
import { fetchBookings } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import BookingsTable from "@/components/admin/BookingsTable";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Checked In", value: "checked_in" },
  { label: "Cancelled", value: "cancelled" },
];

const PAGE_SIZE = 20;

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetchBookings({
        status: status || undefined,
        search: debounced || undefined,
      });
      if (!active) return;
      setBookings(res.bookings ?? []);
      setLoading(false);
      setPage(1);
    })();
    return () => {
      active = false;
    };
  }, [status, debounced, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [bookings, page],
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or reference..."
            className="w-full bg-obsidian border border-graphite text-ivory font-dm-sans text-[14px] pl-11 pr-4 py-3 outline-none focus:border-gold transition-colors placeholder:text-ivory/30"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={cn(
                "font-dm-sans text-[11px] tracking-[0.1em] uppercase px-4 py-2 transition-colors border",
                status === f.value
                  ? "bg-gold text-obsidian border-gold"
                  : "border-graphite text-ivory/50 hover:border-gold/50",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <BookingsTable
        bookings={pageItems}
        onChanged={reload}
        emptyLabel={loading ? "Loading…" : "No bookings match your filters"}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="font-dm-sans text-[12px] text-ivory/40">
          {bookings.length} booking{bookings.length === 1 ? "" : "s"}
          {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ""}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 border border-graphite text-ivory/60 px-4 py-2 text-[11px] tracking-[0.1em] uppercase hover:border-gold/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 border border-graphite text-ivory/60 px-4 py-2 text-[11px] tracking-[0.1em] uppercase hover:border-gold/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
