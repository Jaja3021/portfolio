import type { PropertyStatus } from "@/lib/types";

const statusStyles: Record<PropertyStatus, string> = {
  RFO: "bg-primary text-white",
  "Pre-selling": "bg-blue-600 text-white",
  "Accept Reservation": "bg-amber-500 text-white",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm ${statusStyles[status]}`}
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
