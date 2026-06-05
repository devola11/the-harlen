"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SUITES, getSuiteBySlug, type SuiteData } from "@/lib/suites";
import {
  calculateDeposit,
  calculateNights,
  cn,
  formatCurrency,
} from "@/lib/utils";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Nigeria",
  "Canada",
  "Australia",
  "France",
  "Germany",
  "Japan",
  "UAE",
  "South Africa",
  "Other",
] as const;

const bookingSchema = z
  .object({
    checkIn: z.string().min(1, "Required"),
    checkOut: z.string().min(1, "Required"),
    suiteSlug: z.string().min(1, "Please select a suite"),
    firstName: z.string().min(2, "At least 2 characters"),
    lastName: z.string().min(2, "At least 2 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(7, "Please enter a valid phone"),
    country: z.string().min(1, "Please select a country"),
    guests: z.number().min(1).max(6),
    specialRequests: z.string().optional(),
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

type BookingFormValues = z.infer<typeof bookingSchema>;

const INPUT_CLASS =
  "w-full border-b border-linen focus:border-gold outline-none font-dm-sans text-[15px] text-charcoal py-3 bg-transparent transition-colors";

function clampGuests(raw: string | null): number {
  const n = Number(raw ?? "1");
  return Number.isFinite(n) && n >= 1 && n <= 6 ? n : 1;
}

function ReserveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSuite = searchParams.get("suite") ?? "";
  const initialCheckIn = searchParams.get("checkin") ?? "";
  const initialCheckOut = searchParams.get("checkout") ?? "";
  const initialGuests = clampGuests(searchParams.get("guests"));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      suiteSlug: initialSuite,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      guests: initialGuests,
      specialRequests: "",
    },
  });

  const watched = watch();
  const selectedSuite = getSuiteBySlug(watched.suiteSlug);
  const nights =
    watched.checkIn && watched.checkOut
      ? calculateNights(watched.checkIn, watched.checkOut)
      : 0;
  const subtotal = selectedSuite ? selectedSuite.pricePerNight * nights : 0;
  const total = subtotal;
  const deposit = calculateDeposit(total);

  const onSubmit: SubmitHandler<BookingFormValues> = (data) => {
    const suite = getSuiteBySlug(data.suiteSlug);
    if (!suite) return;
    const n = calculateNights(data.checkIn, data.checkOut);
    const sub = suite.pricePerNight * n;
    const ttl = sub;
    const dep = calculateDeposit(ttl);

    const payload = {
      ...data,
      suiteSlug: suite.slug,
      suiteName: suite.name,
      suiteImage: suite.image,
      suiteSize: suite.size,
      pricePerNight: suite.pricePerNight,
      nights: n,
      subtotal: sub,
      total: ttl,
      deposit: dep,
    };

    sessionStorage.setItem("harlen_booking", JSON.stringify(payload));
    router.push("/reserve/confirm");
  };

  return (
    <main>
      <header className="bg-charcoal pt-32 pb-12 px-6 md:px-12 lg:px-24">
        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
          The Harlen
        </p>
        <h1 className="font-cormorant text-[48px] font-light italic text-ivory">
          Reserve Your Residence
        </h1>
        <p className="font-dm-sans text-[11px] text-ivory/40 tracking-[0.15em] mt-2">
          Step 1 of 2 — Your Details
        </p>
      </header>

      <div className="bg-cream grid grid-cols-1 lg:grid-cols-[60%_40%]">
        <div className="px-6 md:px-12 lg:px-16 py-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <section className="space-y-6">
              <h2 className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold">
                Your Stay
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Check In" error={errors.checkIn?.message}>
                  <input
                    type="date"
                    {...register("checkIn")}
                    className={INPUT_CLASS}
                  />
                </FormField>
                <FormField
                  label="Check Out"
                  error={errors.checkOut?.message}
                >
                  <input
                    type="date"
                    {...register("checkOut")}
                    className={INPUT_CLASS}
                  />
                </FormField>
              </div>
              {nights > 0 && (
                <p className="font-cormorant text-[18px] italic text-gold">
                  {nights} {nights === 1 ? "night" : "nights"} selected
                </p>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-2">
                Select Your Suite
              </h2>
              <div className="space-y-2">
                {SUITES.map((s) => (
                  <SuiteRadioCard
                    key={s.slug}
                    suite={s}
                    selected={watched.suiteSlug === s.slug}
                    onSelect={() =>
                      setValue("suiteSlug", s.slug, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
              {errors.suiteSlug && (
                <p className="font-dm-sans text-[11px] text-red-500 mt-1">
                  {errors.suiteSlug.message}
                </p>
              )}
            </section>

            <section className="space-y-6">
              <h2 className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold">
                Guest Information
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  label="First Name *"
                  error={errors.firstName?.message}
                >
                  <input
                    type="text"
                    {...register("firstName")}
                    className={INPUT_CLASS}
                  />
                </FormField>
                <FormField
                  label="Last Name *"
                  error={errors.lastName?.message}
                >
                  <input
                    type="text"
                    {...register("lastName")}
                    className={INPUT_CLASS}
                  />
                </FormField>
              </div>

              <FormField label="Email Address *" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email")}
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label="Phone Number *" error={errors.phone?.message}>
                <div className="flex items-center border-b border-linen focus-within:border-gold transition-colors">
                  <span className="font-dm-sans text-[15px] text-ash pr-2">
                    +1
                  </span>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="flex-1 font-dm-sans text-[15px] text-charcoal py-3 bg-transparent outline-none"
                  />
                </div>
              </FormField>

              <FormField
                label="Country / Region *"
                error={errors.country?.message}
              >
                <select {...register("country")} className={INPUT_CLASS}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  label="Number of Guests *"
                  error={errors.guests?.message}
                >
                  <select
                    {...register("guests", { valueAsNumber: true })}
                    className={INPUT_CLASS}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </FormField>
                <div />
              </div>

              <FormField label="Special Requests (Optional)">
                <textarea
                  {...register("specialRequests")}
                  rows={4}
                  className="w-full border-b border-linen focus:border-gold outline-none font-dm-sans text-[15px] text-charcoal py-3 bg-transparent transition-colors resize-none"
                />
              </FormField>
            </section>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-gold text-obsidian py-5 text-[12px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment →
            </button>
          </form>
        </div>

        <aside className="px-6 md:px-12 lg:px-0 lg:pr-12 py-12">
          <div className="lg:sticky lg:top-24 bg-charcoal p-8 text-ivory">
            <h2 className="font-dm-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-8">
              Reservation Summary
            </h2>

            {selectedSuite ? (
              <>
                <div className="aspect-[16/9] relative overflow-hidden mb-6">
                  <Image
                    src={selectedSuite.image}
                    alt={selectedSuite.name}
                    fill
                    sizes="(min-width: 1024px) 35vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-cormorant text-[24px] font-medium text-ivory">
                  {selectedSuite.name}
                </h3>
                <p className="font-dm-sans text-[11px] tracking-[0.1em] text-gold mt-1">
                  {selectedSuite.size}
                </p>
              </>
            ) : (
              <p className="font-dm-sans text-[13px] italic text-ivory/40">
                Select a suite to see details.
              </p>
            )}

            <div aria-hidden className="w-full h-px bg-gold/20 my-6" />

            <dl className="space-y-3 font-dm-sans text-[13px]">
              <div className="flex justify-between">
                <dt className="text-ivory/50">Check-in</dt>
                <dd className="text-ivory">{watched.checkIn || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ivory/50">Check-out</dt>
                <dd className="text-ivory">{watched.checkOut || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ivory/50">Duration</dt>
                <dd className="text-ivory">
                  {nights > 0 ? `${nights} nights` : "—"}
                </dd>
              </div>
            </dl>

            <div aria-hidden className="w-full h-px bg-gold/20 my-6" />

            <dl className="space-y-3 font-dm-sans text-[13px]">
              <div className="flex justify-between">
                <dt className="text-ivory/50">Price per night</dt>
                <dd className="text-ivory">
                  {selectedSuite
                    ? formatCurrency(selectedSuite.pricePerNight)
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ivory/50">
                  Subtotal ({nights} {nights === 1 ? "night" : "nights"})
                </dt>
                <dd className="text-ivory">{formatCurrency(subtotal)}</dd>
              </div>
            </dl>

            <div aria-hidden className="w-full h-px bg-gold/20 my-4" />

            <div className="flex justify-between items-baseline">
              <span className="font-dm-sans text-[13px] text-ivory/50">
                Total Amount
              </span>
              <span className="font-cormorant text-[28px] font-light text-ivory">
                {formatCurrency(total)}
              </span>
            </div>

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

            <p className="mt-6 font-dm-sans text-[11px] italic text-ivory/30">
              Prices in USD · Rates subject to availability · 30% deposit
              required to confirm reservation
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FormField({
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

function SuiteRadioCard({
  suite,
  selected,
  onSelect,
}: {
  suite: SuiteData;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative w-full cursor-pointer border p-4 flex items-center gap-4 text-left transition-colors",
        selected
          ? "border-gold bg-gold/5"
          : "border-linen hover:border-gold/50",
      )}
    >
      <span
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
          selected ? "border-gold" : "border-linen",
        )}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-gold" />}
      </span>
      <span className="flex-1 flex flex-col">
        <span className="font-dm-sans text-[14px] font-medium text-charcoal">
          {suite.name}
        </span>
        <span className="font-dm-sans text-[11px] text-ash">{suite.size}</span>
      </span>
      <span className="font-dm-sans text-[13px] text-gold whitespace-nowrap">
        From {formatCurrency(suite.pricePerNight)}/night
      </span>
    </button>
  );
}

function ReserveLoading() {
  return (
    <main className="min-h-screen bg-cream pt-32 px-6 md:px-12 lg:px-24">
      <p className="font-dm-sans text-ash">Loading reservation…</p>
    </main>
  );
}

export default function ReservePage() {
  return (
    <Suspense fallback={<ReserveLoading />}>
      <ReserveContent />
    </Suspense>
  );
}
