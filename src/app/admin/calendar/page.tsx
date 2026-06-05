"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminBooking } from "@/lib/admin-types";
import { fetchBookings } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const emptySubscribe = () => () => {};

export default function AdminCalendarPage() {
  // Render only after mount so the month (from `new Date()`) can't mismatch SSR.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [suite, setSuite] = useState("");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetchBookings();
      if (!active) return;
      setBookings(res.bookings ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  const suites = useMemo(
    () =>
      Array.from(
        new Set(
          bookings.map((b) => b.suite_name).filter((s): s is string => !!s),
        ),
      ),
    [bookings],
  );

  const visible = useMemo(
    () => (suite ? bookings.filter((b) => b.suite_name === suite) : bookings),
    [bookings, suite],
  );

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [month]);

  const bookingsForDay = useCallback(
    (day: Date) =>
      visible.filter((b) => {
        if (b.status === "cancelled") return false;
        try {
          const ci = parseISO(b.check_in);
          const co = parseISO(b.check_out);
          return day >= startOfDay(ci) && day < startOfDay(co);
        } catch {
          return false;
        }
      }),
    [visible],
  );

  if (!mounted) {
    return (
      <p className="font-dm-sans text-[14px] text-ivory/30">Loading calendar…</p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-cormorant text-[26px] text-ivory font-light w-[220px]">
            {format(month, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonth((m) => subMonths(m, 1))}
              className="border border-graphite text-ivory/60 p-2 hover:border-gold/50 hover:text-gold transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="border border-graphite text-ivory/60 p-2 hover:border-gold/50 hover:text-gold transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <select
          value={suite}
          onChange={(e) => setSuite(e.target.value)}
          className="bg-obsidian border border-graphite text-ivory/70 font-dm-sans text-[13px] px-4 py-2.5 outline-none focus:border-gold"
        >
          <option value="">All Suites</option>
          {suites.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-4">
        <Legend color="bg-gold" label="Booked" />
        <Legend color="bg-amber-400" label="Pending" />
      </div>

      <div className="grid grid-cols-7 bg-obsidian border border-graphite">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="font-dm-sans text-[10px] tracking-[0.15em] uppercase text-ivory/40 px-2 py-3 text-center border-b border-graphite"
          >
            {d}
          </div>
        ))}

        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const dayBookings = bookingsForDay(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border border-graphite/30 p-2 min-h-[80px] relative",
                !inMonth && "opacity-30",
              )}
            >
              <span className="font-dm-sans text-[12px] text-ivory/50 absolute top-2 left-2">
                {format(day, "d")}
              </span>
              <div className="mt-7 space-y-1">
                {dayBookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    title={`${b.guest_first_name} ${b.guest_last_name} · ${b.suite_name ?? ""}`}
                    className={cn(
                      "flex items-center gap-1 text-[10px] px-2 py-0.5 truncate",
                      b.status === "pending"
                        ? "bg-amber-400/20 text-amber-300"
                        : "bg-gold/20 text-gold",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full flex-shrink-0",
                        b.status === "pending" ? "bg-amber-400" : "bg-gold",
                      )}
                    />
                    <span className="truncate">{b.guest_last_name}</span>
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <p className="font-dm-sans text-[9px] text-ivory/30 px-2">
                    +{dayBookings.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-2 h-2 rounded-full", color)} />
      <span className="font-dm-sans text-[11px] text-ivory/40">{label}</span>
    </div>
  );
}
