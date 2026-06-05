import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theharlen.com"),
  title: {
    default: "The Harlen | Luxury Serviced Apartments on the Upper West Side",
    template: "%s | The Harlen",
  },
  description:
    "The Harlen offers a curated collection of luxury serviced apartments at 22 West 76th Street, steps from Central Park on Manhattan's Upper West Side.",
  keywords: [
    "luxury serviced apartments",
    "Upper West Side",
    "Manhattan",
    "Central Park",
    "extended stay",
    "New York City",
    "The Harlen",
  ],
  authors: [{ name: "The Harlen" }],
  openGraph: {
    title: "The Harlen | Luxury Serviced Apartments",
    description:
      "A curated collection of luxury serviced apartments on Manhattan's Upper West Side, steps from Central Park.",
    url: "https://theharlen.com",
    siteName: "The Harlen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Harlen | Luxury Serviced Apartments",
    description:
      "A curated collection of luxury serviced apartments on Manhattan's Upper West Side.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-obsidian font-dm-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
