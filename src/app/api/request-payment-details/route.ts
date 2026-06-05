import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { paymentRequestSchema } from "@/lib/payment-request";

export const runtime = "nodejs";

const PLACEHOLDER_KEY = "replace_with_your_resend_key";

type BankConfig = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
};

function getBankConfig(): BankConfig {
  return {
    bankName: process.env.BANK_NAME ?? "",
    accountName: process.env.BANK_ACCOUNT_NAME ?? "",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "",
    routingNumber: process.env.BANK_ROUTING_NUMBER ?? "",
  };
}

function paymentEmailHtml(input: {
  fullName: string;
  reservationReference: string;
  bank: BankConfig;
}): string {
  const { fullName, reservationReference, bank } = input;
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #2d2d2d;font:600 11px/1.4 Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#8b6f47;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #2d2d2d;font:400 15px/1.4 Arial,sans-serif;color:#f5f0e8;text-align:right;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#faf7f2;padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
      <tr>
        <td style="background:#1a1a1a;padding:40px;">
          <p style="margin:0 0 8px;font:600 10px/1 Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#c9a067;">The Harlen</p>
          <h1 style="margin:0;font:300 italic 30px/1.2 Georgia,serif;color:#f5f0e8;">Your Payment Instructions</h1>
        </td>
      </tr>
      <tr>
        <td style="background:#1a1a1a;padding:0 40px 40px;">
          <p style="margin:0 0 24px;font:400 15px/1.6 Arial,sans-serif;color:#b5b0a8;">
            Dear ${fullName},<br /><br />
            Thank you for your reservation request (reference
            <span style="color:#c9a067;">${reservationReference}</span>).
            Please use the account details below to complete your deposit transfer.
            Include your reservation reference in the transfer memo so we can match your payment.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2d2d2d;">
            ${row("Bank Name", bank.bankName)}
            ${row("Account Name", bank.accountName)}
            ${row("Account Number", bank.accountNumber)}
            ${row("Routing Number", bank.routingNumber)}
            ${row("Reference", reservationReference)}
          </table>
          <p style="margin:28px 0 0;font:400 italic 13px/1.6 Georgia,serif;color:#5f5c57;">
            Our reservations team will confirm your stay within 24 hours of receiving your transfer.
            If you did not request these details, please disregard this email.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 40px;font:400 11px/1.5 Arial,sans-serif;color:#8b8780;text-align:center;">
          The Harlen · 22 West 76th Street · New York, NY
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = paymentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 422 },
    );
  }
  const { fullName, email, phone, reservationReference } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    // Honest failure: the route is wired, but delivery needs a live key.
    return NextResponse.json(
      {
        error:
          "Email delivery is not configured yet. Please contact reservations to receive your payment instructions.",
      },
      { status: 503 },
    );
  }

  const bank = getBankConfig();
  if (!bank.accountNumber || !bank.routingNumber) {
    return NextResponse.json(
      { error: "Payment details are not configured. Please contact us." },
      { status: 500 },
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const fromAddress =
    process.env.RESEND_FROM ?? "The Harlen <reservations@theharlen.com>";

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      cc: adminEmail ? [adminEmail] : undefined,
      replyTo: adminEmail,
      subject: "Your Payment Instructions — The Harlen",
      html: paymentEmailHtml({ fullName, reservationReference, bank }),
      // Surface the requester's phone to the admin via the CC'd copy.
      headers: { "X-Harlen-Guest-Phone": phone },
    });

    if (error) {
      return NextResponse.json(
        { error: "We couldn't send your payment instructions. Please retry." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "We couldn't send your payment instructions. Please retry." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
