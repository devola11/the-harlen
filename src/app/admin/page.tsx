"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { parseISO, startOfMonth } from "date-fns";
import { BookOpen, Clock, CheckCircle, DollarSign } from "lucide-react";
import type { AdminBooking } from "@/lib/admin-types";
import { fetchBookings, updateBookingStatus } from "@/lib/admin-api";
import { fmtDate, fmtMoney, guestName } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import BookingsTable from "@/components/admin/BookingsTable";

export default function AdminOverviewPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [unconfigured, setUnconfigured] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetchBookings();
      if (!active) return;
      setBookings(res.bookings ?? []);
      setUnconfigured(Boolean(res.unconfigured));
      setLoadError(res.error ?? null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const stats = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const inThisMonth = (b: AdminBooking) => {
      try {
        return parseISO(b.created_at) >= monthStart;
      } catch {
        return false;
      }
    };
    const confirmedLike = (s: string) =>
      s === "confirmed" || s === "checked_in" || s === "checked_out";

    return {
      total: bookings.filter(inThisMonth).length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter(
        (b) => b.status === "confirmed" || b.status === "checked_in",
      ).length,
      revenue: bookings
        .filter((b) => confirmedLike(b.status) && inThisMonth(b))
        .reduce((sum, b) => sum + (b.deposit_amount ?? 0), 0),
    };
  }, [bookings]);

  const pending = useMemo(
    () => bookings.filter((b) => b.status === "pending"),
    [bookings],
  );
  const recent = useMemo(() => bookings.slice(0, 10), [bookings]);

  async function confirmBooking(id: string) {
    await updateBookingStatus(id, "confirmed");
    reload();
  }
  async function cancelBooking(id: string) {
    const reason = window.prompt("Cancellation reason (optional):") || undefined;
    await updateBookingStatus(id, "cancelled", reason);
    reload();
  }

  return (
    <div>
      {unconfigured && (
        <div className="mb-8 border border-amber-500/30 bg-amber-900/10 px-5 py-4">
          <p className="font-dm-sans text-[13px] text-amber-300/90">
            Database not connected. Add a real{" "}
            <code className="text-amber-200">SUPABASE_SERVICE_ROLE_KEY</code> and
            create the <code className="text-amber-200">bookings</code> table to
            see live data.
          </p>
        </div>
      )}

      {!unconfigured && loadError && (
        <div className="mb-8 border border-red-500/30 bg-red-900/10 px-5 py-4">
          <p className="font-dm-sans text-[13px] text-red-300/90">
            Could not load bookings:{" "}
            <span className="text-red-200">{loadError}</span>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Bookings"
          value={loading ? "—" : String(stats.total)}
          sub="This month"
          icon={<BookOpen size={18} className="text-gold" />}
        />
        <StatCard
          label="Pending Review"
          value={loading ? "—" : String(stats.pending)}
          sub="Awaiting action"
          icon={<Clock size={18} className="text-amber-400" />}
          valueClass={stats.pending > 0 ? "text-amber-400" : undefined}
        />
        <StatCard
          label="Confirmed"
          value={loading ? "—" : String(stats.confirmed)}
          sub="Active stays"
          icon={<CheckCircle size={18} className="text-green-400" />}
          valueClass="text-green-400"
        />
        <StatCard
          label="Est. Revenue"
          value={loading ? "—" : fmtMoney(stats.revenue)}
          sub="Deposits this month"
          icon={<DollarSign size={18} className="text-gold" />}
        />
      </div>

      {/* Pending */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-cormorant text-[24px] text-ivory">
            Pending Review
          </h2>
          {pending.length > 0 && (
            <span className="font-dm-sans text-[12px] text-amber-400 bg-amber-900/30 border border-amber-500/30 px-3 py-1">
              {pending.length}
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="bg-obsidian border border-graphite p-8 text-center">
            <p className="font-dm-sans text-[14px] text-ivory/30">
              No pending bookings
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((b) => (
              <div
                key={b.id}
                className="bg-obsidian border border-amber-500/20 p-5 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="min-w-0">
                  <p className="font-dm-sans text-[12px] text-gold font-medium">
                    {b.booking_ref}
                  </p>
                  <p className="font-cormorant text-[18px] text-ivory">
                    {guestName(b)}
                  </p>
                  <p className="font-dm-sans text-[12px] text-ivory/50 mt-1">
                    {b.suite_name || "—"} · {fmtDate(b.check_in)} –{" "}
                    {fmtDate(b.check_out)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-cormorant text-[22px] text-ivory">
                    {fmtMoney(b.deposit_amount)}
                  </p>
                  <p className="font-dm-sans text-[11px] text-ivory/40">
                    deposit
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => confirmBooking(b.id)}
                    className="bg-green-900/40 border border-green-500/30 text-green-400 px-4 py-2 text-[11px] tracking-[0.1em] uppercase hover:bg-green-900/60 transition"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelBooking(b.id)}
                    className="bg-red-900/40 border border-red-500/30 text-red-400 px-4 py-2 text-[11px] tracking-[0.1em] uppercase hover:bg-red-900/60 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent */}
      <section>
        <h2 className="font-cormorant text-[24px] text-ivory mb-4">
          Recent Bookings
        </h2>
        <BookingsTable
          bookings={recent}
          onChanged={reload}
          emptyLabel={loading ? "Loading…" : "No bookings yet"}
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  valueClass,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="bg-obsidian border border-graphite p-6">
      <div className="flex items-start justify-between mb-2">
        <p className="font-dm-sans text-[10px] tracking-[0.2em] text-ivory/40 uppercase">
          {label}
        </p>
        {icon}
      </div>
      <p
        className={cn(
          "font-cormorant text-[40px] text-ivory font-light leading-none",
          valueClass,
        )}
      >
        {value}
      </p>
      <p className="font-dm-sans text-[12px] text-ivory/30 mt-1">{sub}</p>
    </div>
  );
}
