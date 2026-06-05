"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentRequestSchema,
  type PaymentRequestInput,
} from "@/lib/payment-request";

const INPUT_CLASS =
  "w-full border-b border-linen focus:border-gold outline-none font-dm-sans text-[15px] text-charcoal py-3 bg-transparent transition-colors";

export type RequestDefaults = Partial<PaymentRequestInput>;

export default function RequestPaymentDetailsModal({
  open,
  onOpenChange,
  defaults,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaults: RequestDefaults;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-cream p-8 md:p-10 shadow-2xl focus:outline-none max-h-[90vh] overflow-y-auto">
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-5 top-5 text-ash hover:text-charcoal transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </Dialog.Close>

          {/* Mounted fresh on each open (Radix unmounts Content on close), so
              form + request state reset naturally without an effect. */}
          <RequestForm
            defaults={defaults}
            onDone={() => onOpenChange(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function RequestForm({
  defaults,
  onDone,
}: {
  defaults: RequestDefaults;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentRequestInput>({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: {
      fullName: defaults.fullName ?? "",
      email: defaults.email ?? "",
      phone: defaults.phone ?? "",
      reservationReference: defaults.reservationReference ?? "",
    },
  });

  const onSubmit: SubmitHandler<PaymentRequestInput> = async (data) => {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/request-payment-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold mb-5">
          <svg
            width="20"
            height="20"
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
        <Dialog.Title className="font-cormorant text-[30px] font-light italic text-charcoal">
          Check your inbox
        </Dialog.Title>
        <Dialog.Description className="font-dm-sans text-[14px] text-ash mt-3 leading-relaxed">
          We&rsquo;ve emailed your payment instructions. Please check your inbox
          (and spam folder) to complete your transfer.
        </Dialog.Description>
        <button
          type="button"
          onClick={onDone}
          className="mt-7 w-full bg-gold text-obsidian py-4 text-[12px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
        The Harlen
      </p>
      <Dialog.Title className="font-cormorant text-[30px] font-light italic text-charcoal">
        Request Payment Details
      </Dialog.Title>
      <Dialog.Description className="font-dm-sans text-[14px] text-ash mt-3 leading-relaxed">
        For your security, we share account information directly. Enter your
        details and we&rsquo;ll email your payment instructions.
      </Dialog.Description>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 space-y-5"
        noValidate
      >
        <Field label="Full Name" error={errors.fullName?.message}>
          <input
            type="text"
            autoComplete="name"
            {...register("fullName")}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            className={INPUT_CLASS}
          />
        </Field>
        <Field
          label="Reservation Reference"
          error={errors.reservationReference?.message}
        >
          <input
            type="text"
            {...register("reservationReference")}
            className={INPUT_CLASS}
          />
        </Field>

        {errorMsg && (
          <p className="font-dm-sans text-[12px] text-red-500">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-gold text-obsidian py-4 text-[12px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting"
            ? "Sending…"
            : "Email My Payment Instructions"}
        </button>
        <p className="font-dm-sans text-[11px] italic text-ash/60 text-center">
          Your details are used only to send your payment instructions.
        </p>
      </form>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-dm-sans text-[9px] tracking-[0.2em] uppercase text-ash mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-dm-sans text-[11px] text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
