export type SuiteTier =
  | "studio"
  | "one_bedroom"
  | "two_bedroom"
  | "three_bedroom"
  | "junior_suite"
  | "penthouse";

export interface Suite {
  id: string;
  slug: string;
  name: string;
  tier: SuiteTier;
  description: string;
  shortDescription?: string | null;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sizeSqft: number;
  amenities: string[];
  features?: string[];
  images: string[];
  heroImage?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | "pending"
  | "awaiting_payment"
  | "payment_uploaded"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Booking {
  id: string;
  bookingRef: string;
  suiteId: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  numGuests: number;
  pricePerNight: number;
  subtotal: number;
  taxes: number;
  total: number;
  depositAmount: number;
  status: BookingStatus;
  paymentProofUrl?: string | null;
  specialRequests?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedDate {
  id: string;
  suiteId: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
  createdAt: string;
}
