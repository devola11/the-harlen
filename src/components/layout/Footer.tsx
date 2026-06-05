import Link from "next/link";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const EXPLORE_LINKS = [
  { label: "Accommodations", href: "/accommodations" },
  { label: "Amenities", href: "/amenities" },
  { label: "Neighborhood", href: "/neighborhood" },
  { label: "Gallery", href: "/gallery" },
  { label: "Design", href: "/design" },
  { label: "Offers", href: "/offers" },
];

const STAY_LINKS = [
  { label: "Reserve Now", href: "/reserve" },
  { label: "Rates & Packages", href: "/rates" },
  { label: "Corporate Stays", href: "/corporate" },
  { label: "Long-Term Residency", href: "/long-term" },
  { label: "FAQ", href: "/faq" },
];

export default function Footer() {
  return (
    <footer className="bg-obsidian pt-20 pb-10 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <p className="font-cormorant text-[24px] tracking-[0.3em] uppercase text-ivory">
            The Harlen
          </p>
          <p className="font-dm-sans text-[13px] text-ivory/50 mt-2 italic">
            New York, Elevated.
          </p>
          <address className="mt-6 space-y-1 font-dm-sans text-[13px] text-ivory/40 leading-relaxed not-italic">
            <p>22 West 76th Street</p>
            <p>Upper West Side, Manhattan</p>
            <p>New York, NY 10023</p>
          </address>
          <p className="mt-4 font-dm-sans text-[13px] text-ivory/40">
            +1 (212) 555-0176
          </p>
        </div>

        <div>
          <h3 className="font-dm-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-6">
            Explore
          </h3>
          <ul className="space-y-3">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-dm-sans text-[13px] text-ivory/50 hover:text-ivory transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-dm-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-6">
            Stay
          </h3>
          <ul className="space-y-3">
            {STAY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-dm-sans text-[13px] text-ivory/50 hover:text-ivory transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-dm-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-6">
            Contact
          </h3>
          <ul className="space-y-3 font-dm-sans text-[13px] text-ivory/50">
            <li>reservations@theharlen.com</li>
            <li>+1 (212) 555-0176</li>
            <li>Open 24 hours, 7 days</li>
          </ul>
          <a
            href="https://instagram.com/theharlen"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-2 font-dm-sans text-[13px] text-ivory/40 hover:text-gold transition-colors w-fit"
          >
            <InstagramIcon size={16} />
            <span>@theharlen</span>
          </a>
        </div>
      </div>

      <div className="w-full h-px bg-gold/20 my-0" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
        <p className="font-dm-sans text-[11px] text-ivory/25">
          © 2025 The Harlen. All rights reserved.
        </p>
        <p className="font-dm-sans text-[11px] text-ivory/25">
          Privacy Policy · Terms of Service
        </p>
      </div>
    </footer>
  );
}
