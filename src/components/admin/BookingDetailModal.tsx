"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { AdminBooking } from "@/lib/admin-types";
import { fmtDate, fmtMoney, guestName } from "@/lib/admin-format";
import { getProofUrl, updateBookingStatus } from "@/lib/admin-api";
import StatusBadge from "./StatusBadge";

export default function BookingDetailModal({
  booking,
  onClose,
  onChanged,
}: {
  booking: AdminBooking | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  return (
    <Dialog.Root
      open={booking !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 bg-charcoal border border-graphite p-8 shadow-2xl focus:outline-none max-h-[90vh] overflow-y-auto">
          {booking && (
            <BookingDetailBody
              booking={booking}
              onChanged={onChanged}
              onClose={onClose}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function BookingDetailBody({
  booking,
  onChanged,
  onClose,
}: {
  booking: AdminBooking;
  onChanged: () => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(status: string, reason?: string) {
    setBusy(true);
    setError(null);
    const res = await updateBookingStatus(booking.id, status, reason);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    onChanged();
    onClose();
  }

  async function viewProof() {
    const { signedUrl, error: proofError } = await getProofUrl(booking.id);
    if (signedUrl) {
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } else {
      setError(proofError ?? "Could not open proof.");
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-dm-sans text-[12px] text-gold font-medium tracking-[0.05em]">
            {booking.booking_ref}
          </p>
          <h2 className="font-cormorant text-[28px] font-light text-ivory mt-1">
            {guestName(booking)}
          </h2>
          <div className="mt-2">
            <StatusBadge status={booking.status} />
          </div>
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            className="text-ivory/40 hover:text-ivory transition-colors"
          >
            <X size={20} />
          </button>
        </Dialog.Close>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Section title="Guest Details">
          <Detail label="Email" value={booking.guest_email} />
          <Detail label="Phone" value={booking.guest_phone} />
          <Detail
            label="Guests"
            value={booking.num_guests ? String(booking.num_guests) : "—"}
          />
          <Detail
            label="Special Requests"
            value={booking.special_requests || "—"}
          />
        </Section>

        <Section title="Stay & Pricing">
          <Detail label="Suite" value={booking.suite_name || "—"} />
          <Detail label="Check-in" value={fmtDate(booking.check_in)} />
          <Detail label="Check-out" value={fmtDate(booking.check_out)} />
          <Detail label="Nights" value={String(booking.nights ?? "—")} />
          <Detail label="Total" value={fmtMoney(booking.total)} />
          <Detail label="Deposit" value={fmtMoney(booking.deposit_amount)} />
        </Section>
      </div>

      {booking.cancellation_reason && (
        <div className="mt-6 border border-red-500/20 bg-red-900/10 p-4">
          <p className="font-dm-sans text-[10px] tracking-[0.15em] uppercase text-red-400/70 mb-1">
            Cancellation Reason
          </p>
          <p className="font-dm-sans text-[13px] text-ivory/70">
            {booking.cancellation_reason}
          </p>
        </div>
      )}

      <div className="mt-6 border-t border-graphite pt-6">
        <p className="font-dm-sans text-[10px] tracking-[0.2em] uppercase text-ivory/40 mb-3">
          Payment Proof
        </p>
        {booking.payment_proof_url ? (
          <button
            type="button"
            onClick={viewProof}
            className="border border-gold/40 text-gold px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase hover:bg-gold hover:text-obsidian transition-all"
          >
            View Payment Proof
          </button>
        ) : (
          <p className="font-dm-sans text-[13px] italic text-ivory/30">
            No proof uploaded yet
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 font-dm-sans text-[12px] text-red-400">{error}</p>
      )}

      <div className="mt-6 border-t border-graphite pt-6 flex flex-wrap gap-3">
        {booking.status === "pending" && (
          <>
            <ActionButton
              tone="green"
              disabled={busy}
              onClick={() => changeStatus("confirmed")}
            >
              Confirm Booking
            </ActionButton>
            <ActionButton
              tone="red"
              disabled={busy}
              onClick={() =>
                changeStatus(
                  "cancelled",
                  window.prompt("Cancellation reason (optional):") || undefined,
                )
              }
            >
              Cancel Booking
            </ActionButton>
          </>
        )}
        {booking.status === "confirmed" && (
          <ActionButton
            tone="blue"
            disabled={busy}
            onClick={() => changeStatus("checked_in")}
          >
            Mark Checked In
          </ActionButton>
        )}
        {booking.status === "checked_in" && (
          <ActionButton
            tone="gray"
            disabled={busy}
            onClick={() => changeStatus("checked_out")}
          >
            Mark Checked Out
          </ActionButton>
        )}
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-dm-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-3">
        {title}
      </p>
      <dl className="space-y-3">{children}</dl>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-dm-sans text-[10px] tracking-[0.1em] uppercase text-ivory/30">
        {label}
      </dt>
      <dd className="font-dm-sans text-[14px] text-ivory/80 mt-0.5 break-words">
        {value}
      </dd>
    </div>
  );
}

const TONES: Record<string, string> = {
  green:
    "bg-green-900/40 border-green-500/30 text-green-400 hover:bg-green-900/60",
  red: "bg-red-900/40 border-red-500/30 text-red-400 hover:bg-red-900/60",
  blue: "bg-blue-900/40 border-blue-500/30 text-blue-400 hover:bg-blue-900/60",
  gray: "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700",
};

function ActionButton({
  tone,
  disabled,
  onClick,
  children,
}: {
  tone: keyof typeof TONES;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`border px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed ${TONES[tone]}`}
    >
      {children}
    </button>
  );
}
