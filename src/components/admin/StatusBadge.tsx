import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  pending: "bg-amber-900/40 text-amber-400 border-amber-500/30",
  confirmed: "bg-green-900/40 text-green-400 border-green-500/30",
  checked_in: "bg-blue-900/40 text-blue-400 border-blue-500/30",
  checked_out: "bg-gray-800 text-gray-400 border-gray-600",
  cancelled: "bg-red-900/40 text-red-400 border-red-500/30",
};

const LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block border font-dm-sans text-[10px] tracking-[0.1em] uppercase px-2 py-1",
        STYLES[status] ?? STYLES.pending,
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
