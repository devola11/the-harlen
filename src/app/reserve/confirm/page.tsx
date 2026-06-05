import type { Metadata } from "next";
import PaymentConfirmation, {
  type BankDetails,
} from "./PaymentConfirmation";

export const metadata: Metadata = {
  title: "Complete Payment",
  description:
    "Complete your reservation at The Harlen with a secure bank transfer and payment receipt upload.",
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  // Only non-sensitive fields are sent to the browser. Account & routing
  // numbers are never exposed here — they're emailed via the request route.
  const bankDetails: BankDetails = {
    bankName: process.env.BANK_NAME ?? "—",
    accountName: process.env.BANK_ACCOUNT_NAME ?? "—",
  };

  return <PaymentConfirmation bankDetails={bankDetails} />;
}
