"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminLogout } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-8">
      <Panel title="Property">
        <Row label="Name" value="The Harlen" />
        <Row label="Address" value="22 West 76th Street, New York, NY" />
        <Row label="Website" value="theharlen.com" />
      </Panel>

      <Panel title="Configuration">
        <p className="font-dm-sans text-[13px] text-ivory/50 leading-relaxed">
          Bank transfer details, Resend email delivery, and the Supabase
          service-role connection are configured via environment variables in{" "}
          <code className="text-gold/80">.env.local</code>. Update them on the
          server and redeploy to take effect.
        </p>
      </Panel>

      <Panel title="Session">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 border border-red-500/30 text-red-400 px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase hover:bg-red-900/40 transition"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-obsidian border border-graphite p-6">
      <h2 className="font-dm-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-dm-sans text-[13px] text-ivory/40">{label}</span>
      <span className="font-dm-sans text-[13px] text-ivory/80 text-right">
        {value}
      </span>
    </div>
  );
}
