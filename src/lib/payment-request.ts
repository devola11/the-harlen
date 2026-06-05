import { z } from "zod";

// Shared between the client modal (form validation) and the server route
// handler (request validation) so the two never drift.
export const paymentRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  reservationReference: z
    .string()
    .trim()
    .min(3, "Enter your reservation reference"),
});

export type PaymentRequestInput = z.infer<typeof paymentRequestSchema>;
