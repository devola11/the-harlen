"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { cn, formatCurrency, generateBookingRef } from "@/lib/utils";
import RequestPaymentDetailsModal from "./RequestPaymentDetailsModal";

// Only non-sensitive fields reach the browser. Account & routing numbers stay
// server-side and are delivered privately by email via the request flow.
export type BankDetails = {
  bankName: string;
  accountName: string;
};

type Booking = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  suiteSlug?: string;
  suiteName?: string;
  suiteImage?: string;
  suiteSize?: string;
  pricePerNight?: number;
  nights?: number;
  subtotal?: number;
  total?: number;
  deposit?: number;
  specialRequests?: string;
};

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// No-op subscription: the booking snapshot is read once on mount and never
// changes for the life of the page, so there is nothing to subscribe to.
const emptySubscribe = () => () => {};

export default function PaymentConfirmation({
  bankDetails,
}: {
  bankDetails: BankDetails;
}) {
  // `hydrated` is false during SSR / first paint, then true once mounted —
  // lets us hold the loading state until the browser-only booking is read.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const bookingRaw = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem("harlen_booking"),
    () => null,
  );
  const booking = useMemo<Booking | null>(() => {
    if (!bookingRaw) return null;
    try {
      return JSON.parse(bookingRaw) as Booking;
    } catch {
      return null;
    }
  }, [bookingRaw]);

  // Generated once per page load; only surfaced after hydration.
  const [bookingRef] = useState(() => generateBookingRef());

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Revoke any object URL we created for image previews to avoid leaks.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setUploadError(null);

      if (rejections.length > 0) {
        const code = rejections[0].errors[0]?.code;
        if (code === "file-too-large") {
          setUploadError("That file exceeds the 10 MB limit.");
        } else if (code === "file-invalid-type") {
          setUploadError("Please upload a JPG, PNG, WEBP, or PDF file.");
        } else {
          setUploadError("That file could not be accepted. Please try another.");
        }
        return;
      }

      const next = accepted[0];
      if (!next) return;

      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return next.type.startsWith("image/") ? URL.createObjectURL(next) : null;
      });
      setFile(next);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
    setUploadError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file || !booking || status === "submitting") return;
    setStatus("submitting");
    setSubmitError(null);
    try {
      // 1) Upload the receipt to private storage, then attach its path.
      const fd = new FormData();
      fd.append("file", file);
      fd.append("booking_ref", bookingRef);
      const upRes = await fetch("/api/upload-proof", {
        method: "POST",
        body: fd,
      });
      const upJson = (await upRes.json().catch(() => ({}))) as {
        path?: string;
        error?: string;
      };
      if (!upRes.ok || !upJson.path) {
        setSubmitError(
          upJson.error ?? "Could not upload your receipt. Please try again.",
        );
        setStatus("idle");
        return;
      }
      const proofPath = upJson.path;

      // 2) Create the booking with the receipt path.
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_ref: bookingRef,
          payment_proof_url: proofPath,
          suite_slug: booking.suiteSlug,
          suite_name: booking.suiteName,
          guest_first_name: booking.firstName,
          guest_last_name: booking.lastName,
          guest_email: booking.email,
          guest_phone: booking.phone,
          guest_country: booking.country,
          special_requests: booking.specialRequests,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          num_nights: booking.nights,
          num_guests: booking.guests,
          price_per_night: booking.pricePerNight,
          subtotal: booking.subtotal,
          deposit_amount: booking.deposit,
          deposit_percentage: 30,
          balance_due: (booking.total ?? 0) - (booking.deposit ?? 0),
          total_amount: booking.total,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(
          json.error ??
            "We couldn't complete your reservation. Please try again.",
        );
        setStatus("idle");
        return;
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Network error. Please try again.");
      setStatus("idle");
    }
  }, [file, booking, bookingRef, status]);

  const deposit = booking?.deposit ?? 0;

  const transferReference = useMemo(() => {
    const last = (booking?.lastName ?? "").toUpperCase().replace(/[^A-Z]/g, "");
    return last ? `${bookingRef} · ${last}` : bookingRef;
  }, [bookingRef, booking?.lastName]);

  const requestDefaults = useMemo(
    () => ({
      fullName: `${booking?.firstName ?? ""} ${booking?.lastName ?? ""}`.trim(),
      email: booking?.email ?? "",
      phone: booking?.phone ?? "",
      reservationReference: bookingRef,
    }),
    [booking?.firstName, booking?.lastName, booking?.email, booking?.phone, bookingRef],
  );

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-cream pt-32 px-6 md:px-12 lg:px-24">
        <p className="font-dm-sans text-[14px] italic text-ash">
          Loading payment details…
        </p>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            The Harlen
          </p>
          <h1 className="font-cormorant text-[40px] font-light italic text-charcoal">
            No reservation in progress
          </h1>
          <p className="font-dm-sans text-[15px] text-ash mt-4 leading-relaxed">
            We couldn&rsquo;t find your reservation details. Please begin a new
            reservation to continue to payment.
          </p>
          <Link
            href="/reserve"
            className="mt-8 inline-flex items-center bg-gold text-obsidian px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
          >
            Start a Reservation
          </Link>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <SuccessScreen
        booking={booking}
        bookingRef={bookingRef}
        deposit={deposit}
      />
    );
  }

  return (
    <main>
      <header className="bg-charcoal pt-32 pb-12 px-6 md:px-12 lg:px-24">
        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
          The Harlen
        </p>
        <h1 className="font-cormorant text-[48px] font-light italic text-ivory">
          Complete Your Payment
        </h1>
        <p className="font-dm-sans text-[11px] text-ivory/40 tracking-[0.15em] mt-2">
          Step 2 of 2 — Secure Your Reservation
        </p>
      </header>

      <div className="bg-cream grid grid-cols-1 lg:grid-cols-[60%_40%]">
        <div className="px-6 md:px-12 lg:px-16 py-12 space-y-12">
          {/* Instructions */}
          <section className="space-y-4">
            <h2 className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold">
              Payment Instructions
            </h2>
            <p className="font-dm-sans text-[15px] text-ash leading-relaxed max-w-xl">
              To confirm your residence, please transfer the deposit of{" "}
              <span className="text-charcoal font-medium">
                {formatCurrency(deposit)}
              </span>{" "}
              to the account below using your reference code, then upload your
              payment receipt. Our reservations team will verify your transfer
              and send a confirmation within 24 hours.
            </p>
          </section>

          {/* Bank transfer details */}
          <section className="space-y-4">
            <h2 className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold">
              Bank Transfer Details
            </h2>
            <div className="bg-charcoal text-ivory p-8">
              <dl className="divide-y divide-gold/15">
                <DetailRow label="Bank Name" value={bankDetails.bankName} />
                <DetailRow
                  label="Account Name"
                  value={bankDetails.accountName}
                />
                <DetailRow
                  label="Payment Reference"
                  value={transferReference}
                  copyable
                  highlight
                />
              </dl>

              {/* Account & routing numbers are shared privately by email. */}
              <div className="border border-gold/30 bg-obsidian/40 p-5 mt-6 flex items-center gap-4">
                <LockGlyph />
                <div className="flex-1 min-w-0">
                  <p className="font-dm-sans text-[10px] tracking-[0.2em] uppercase text-gold">
                    Account &amp; Routing Number
                  </p>
                  <p className="font-dm-sans text-[12px] text-ivory/40 mt-1 leading-relaxed">
                    Shared securely by email to protect your transfer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="flex-shrink-0 border border-gold text-gold px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
                >
                  Request Details
                </button>
              </div>

              <div className="border border-gold/40 bg-gold/5 p-5 mt-6 flex items-baseline justify-between">
                <span className="font-dm-sans text-[9px] tracking-[0.2em] uppercase text-gold">
                  Amount to Transfer
                </span>
                <span className="font-cormorant text-[32px] font-medium text-gold leading-none">
                  {formatCurrency(deposit)}
                </span>
              </div>

              <p className="font-dm-sans text-[11px] text-ivory/40 mt-4 leading-relaxed">
                Request your account details above — we&rsquo;ll email them
                instantly. Include your payment reference in the transfer memo so
                we can match your deposit. The remaining balance is due upon
                arrival.
              </p>
            </div>
          </section>

          {/* Upload */}
          <section className="space-y-4">
            <h2 className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold">
              Upload Payment Receipt
            </h2>

            {file ? (
              <FilePreview
                file={file}
                previewUrl={previewUrl}
                onRemove={removeFile}
              />
            ) : (
              <div
                {...getRootProps()}
                className={cn(
                  "border border-dashed p-10 text-center transition-colors cursor-default",
                  isDragActive
                    ? "border-gold bg-gold/5"
                    : "border-linen bg-linen/20 hover:border-gold/50",
                )}
              >
                <input {...getInputProps()} />
                <UploadGlyph />
                <p className="font-cormorant text-[20px] italic text-charcoal mt-4">
                  {isDragActive
                    ? "Drop your receipt to upload"
                    : "Drag your receipt here"}
                </p>
                <p className="font-dm-sans text-[13px] text-ash mt-2">
                  or{" "}
                  <button
                    type="button"
                    onClick={open}
                    className="text-gold underline underline-offset-2 hover:text-gold-muted transition-colors"
                  >
                    browse your files
                  </button>
                </p>
                <p className="font-dm-sans text-[11px] text-ash/70 mt-4 tracking-[0.05em]">
                  JPG, PNG, WEBP or PDF · up to 10 MB
                </p>
              </div>
            )}

            {uploadError && (
              <p className="font-dm-sans text-[12px] text-red-500">
                {uploadError}
              </p>
            )}
          </section>

          {/* Submit */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!file || status === "submitting"}
              className="w-full bg-gold text-obsidian py-5 text-[12px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting"
                ? "Completing Reservation…"
                : "Complete Reservation"}
            </button>

            {submitError && (
              <p className="font-dm-sans text-[12px] text-red-500">
                {submitError}
              </p>
            )}

            <div className="flex items-center justify-between">
              <Link
                href="/reserve"
                className="font-dm-sans text-[11px] tracking-[0.15em] uppercase text-ash hover:text-charcoal transition-colors"
              >
                ← Back to Details
              </Link>
              <p className="font-dm-sans text-[11px] italic text-ash/60">
                Secure · Encrypted
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="px-6 md:px-12 lg:px-0 lg:pr-12 py-12">
          <div className="lg:sticky lg:top-24 bg-charcoal p-8 text-ivory">
            <h2 className="font-dm-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-8">
              Reservation Summary
            </h2>

            {booking.suiteImage && (
              <div className="aspect-[16/9] relative overflow-hidden mb-6">
                <Image
                  src={booking.suiteImage}
                  alt={booking.suiteName ?? "Suite"}
                  fill
                  sizes="(min-width: 1024px) 35vw, 90vw"
                  className="object-cover"
                />
              </div>
            )}
            <h3 className="font-cormorant text-[24px] font-medium text-ivory">
              {booking.suiteName}
            </h3>
            {booking.suiteSize && (
              <p className="font-dm-sans text-[11px] tracking-[0.1em] text-gold mt-1">
                {booking.suiteSize}
              </p>
            )}

            <div aria-hidden className="w-full h-px bg-gold/20 my-6" />

            <dl className="space-y-3 font-dm-sans text-[13px]">
              <SummaryRow
                label="Guest"
                value={`${booking.firstName ?? ""} ${booking.lastName ?? ""}`.trim()}
              />
              <SummaryRow label="Check-in" value={booking.checkIn} />
              <SummaryRow label="Check-out" value={booking.checkOut} />
              <SummaryRow
                label="Duration"
                value={
                  booking.nights ? `${booking.nights} nights` : undefined
                }
              />
              <SummaryRow label="Guests" value={booking.guests?.toString()} />
            </dl>

            <div aria-hidden className="w-full h-px bg-gold/20 my-6" />

            <dl className="space-y-3 font-dm-sans text-[13px]">
              <SummaryRow
                label="Total Stay"
                value={
                  booking.total != null
                    ? formatCurrency(booking.total)
                    : undefined
                }
              />
            </dl>

            <div className="border border-gold/50 p-4 mt-4 bg-gold/5">
              <p className="font-dm-sans text-[9px] tracking-[0.2em] uppercase text-gold">
                Deposit Due Now
              </p>
              <p className="font-cormorant text-[36px] font-medium text-gold mt-1">
                {formatCurrency(deposit)}
              </p>
              <p className="font-dm-sans text-[11px] text-ivory/40 mt-1">
                Balance due on arrival
              </p>
            </div>
          </div>
        </aside>
      </div>

      <RequestPaymentDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        defaults={requestDefaults}
      />
    </main>
  );
}

function DetailRow({
  label,
  value,
  copyable = false,
  highlight = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — value remains visible to copy manually.
    }
  }, [value]);

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <dt className="font-dm-sans text-[10px] tracking-[0.2em] uppercase text-ivory/40">
        {label}
      </dt>
      <dd className="flex items-center gap-3 min-w-0">
        <span
          className={cn(
            "font-dm-sans text-[15px] truncate",
            highlight ? "text-gold font-medium" : "text-ivory",
          )}
        >
          {value}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={copy}
            className="font-dm-sans text-[9px] tracking-[0.15em] uppercase text-gold/70 hover:text-gold transition-colors flex-shrink-0"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </dd>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory/50">{label}</dt>
      <dd className="text-ivory text-right">{value || "—"}</dd>
    </div>
  );
}

function FilePreview({
  file,
  previewUrl,
  onRemove,
}: {
  file: File;
  previewUrl: string | null;
  onRemove: () => void;
}) {
  return (
    <div className="border border-gold/40 bg-gold/5 p-5 flex items-center gap-5">
      <div className="w-16 h-16 flex-shrink-0 bg-charcoal overflow-hidden relative flex items-center justify-center">
        {previewUrl ? (
          // Object URL preview of the user's selected image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Receipt preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-dm-sans text-[10px] tracking-[0.15em] uppercase text-gold">
            PDF
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-dm-sans text-[14px] text-charcoal font-medium truncate">
          {file.name}
        </p>
        <p className="font-dm-sans text-[12px] text-ash mt-0.5">
          {formatBytes(file.size)} · Ready to submit
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="font-dm-sans text-[10px] tracking-[0.15em] uppercase text-ash hover:text-red-500 transition-colors flex-shrink-0"
      >
        Remove
      </button>
    </div>
  );
}

function SuccessScreen({
  booking,
  bookingRef,
  deposit,
}: {
  booking: Booking;
  bookingRef: string;
  deposit: number;
}) {
  return (
    <main>
      <header className="bg-charcoal pt-32 pb-16 px-6 md:px-12 lg:px-24 text-center">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold mb-6">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gold"
            aria-hidden
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
          Reservation Received
        </p>
        <h1 className="font-cormorant text-[48px] font-light italic text-ivory">
          Thank You, {booking.firstName}
        </h1>
        <p className="font-dm-sans text-[13px] text-ivory/50 tracking-[0.1em] mt-3">
          Confirmation {bookingRef}
        </p>
      </header>

      <div className="bg-cream px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="font-dm-sans text-[16px] text-ash leading-relaxed">
            We have received your reservation request and payment receipt for
            the{" "}
            <span className="text-charcoal font-medium">
              {booking.suiteName}
            </span>
            . Our reservations team will verify your deposit of{" "}
            <span className="text-charcoal font-medium">
              {formatCurrency(deposit)}
            </span>{" "}
            and send a final confirmation to{" "}
            <span className="text-charcoal font-medium">{booking.email}</span>{" "}
            within 24 hours.
          </p>

          <div className="bg-charcoal text-ivory p-8 mt-10">
            <h2 className="font-dm-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-6">
              Your Stay
            </h2>
            <dl className="space-y-3 font-dm-sans text-[13px]">
              <SummaryRow label="Suite" value={booking.suiteName} />
              <SummaryRow label="Check-in" value={booking.checkIn} />
              <SummaryRow label="Check-out" value={booking.checkOut} />
              <SummaryRow
                label="Duration"
                value={booking.nights ? `${booking.nights} nights` : undefined}
              />
              <SummaryRow label="Guests" value={booking.guests?.toString()} />
              <div aria-hidden className="w-full h-px bg-gold/20 my-3" />
              <SummaryRow
                label="Deposit Paid"
                value={formatCurrency(deposit)}
              />
            </dl>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center border border-charcoal/30 text-charcoal px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function LockGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="text-gold flex-shrink-0"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  );
}

function UploadGlyph() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="text-gold mx-auto"
      aria-hidden
    >
      <path
        d="M12 16V4m0 0L8 8m4-4l4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
