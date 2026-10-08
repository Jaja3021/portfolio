import { HouseIcon as House } from "@phosphor-icons/react/ssr";

// Shown in place of a listing photo when a property has no images uploaded yet.
export function NoPhoto() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-background-secondary text-foreground/40">
      <House className="h-10 w-10" />
      <span className="text-xs font-medium">No photo yet</span>
    </div>
  );
}
