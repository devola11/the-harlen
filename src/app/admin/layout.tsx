"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminLogout } from "@/lib/admin-api";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/bookings": "Bookings",
  "/admin/calendar": "Calendar",
  "/admin/settings": "Settings",
};

const emptySubscribe = () => () => {};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Live date label, client-only (server snapshot is empty to avoid mismatch).
  const today = useSyncExternalStore(
    emptySubscribe,
    () =>
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    () => "",
  );

  // Login lives under /admin but must not render the dashboard shell.
  if (pathname?.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const title = TITLES[pathname ?? ""] ?? "Admin";

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <aside className="w-64 bg-obsidian flex flex-col fixed left-0 top-0 h-full z-40 border-r border-graphite">
        <div className="p-6 border-b border-graphite">
          <p className="font-cormorant text-[18px] text-ivory tracking-[0.25em] uppercase">
            The Harlen
          </p>
          <p className="font-dm-sans text-[10px] text-gold tracking-[0.2em] uppercase mt-1">
            Admin
          </p>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : (pathname?.startsWith(href) ?? false);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-left w-full transition-colors",
                  active
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-ivory/50 hover:text-ivory hover:bg-white/5 border-l-2 border-transparent",
                )}
              >
                <Icon size={18} />
                <span className="font-dm-sans text-[13px] tracking-[0.05em]">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-graphite">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 text-ivory/40 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            <span className="font-dm-sans text-[13px]">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="ml-64 flex-1 flex flex-col">
        <header className="bg-obsidian border-b border-graphite px-8 py-5 flex items-center justify-between">
          <h1 className="font-cormorant text-[24px] text-ivory font-light">
            {title}
          </h1>
          <p className="font-dm-sans text-[12px] text-ivory/40">{today}</p>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
