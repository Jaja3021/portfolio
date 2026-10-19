import type { PropertyStatus } from "@/lib/types";

// RFO = green, Pre-selling = amber, everything else neutral (colors are theme tokens).
const statusStyles: Record<PropertyStatus, string> = {
  RFO: "bg-primary-soft text-primary-strong",
  "Pre-selling": "bg-status-presell-bg text-status-presell-text",
  "Ongoing Construction": "bg-status-neutral-bg text-status-neutral-text",
  "Accept Reservation": "bg-status-neutral-bg text-status-neutral-text",
  Sold: "bg-status-neutral-bg text-status-neutral-text",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-background-secondary px-3 py-1 text-xs font-medium text-foreground/70 ${className}`}
    >
      {children}
    </span>
  );
}
