"use client";

import {
  BathtubIcon as Bath,
  BedIcon as BedDouble,
  CarIcon as Car,
  CheckIcon as Check,
  MapPinIcon as MapPin,
  LinkIcon as LinkSimple,
  RulerIcon as Ruler,
  ShareNetworkIcon as Share,
  SquareIcon as Square,
  StairsIcon as Stairs,
} from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ViewingForm } from "@/components/forms/ViewingForm";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/utils";

type View = "details" | "inquire" | "schedule";

export function PropertyDetailModal({
  property,
  onClose,
}: {
  property: Property | null;
  onClose: () => void;
}) {
  const [view, setView] = useState<View>("details");

  const close = () => {
    onClose();
    setTimeout(() => setView("details"), 200);
  };

  if (!property) return null;

  return (
    <Modal open={!!property} onClose={close} labelledBy="property-modal-title">
      {view === "details" && (
        <div>
          <PropertyGallery images={property.images} title={property.title} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-accent">
                  {property.propertyType}
                  {property.houseType && ` · ${property.houseType}`}
                </p>
                <h2 id="property-modal-title" className="mt-1 text-2xl font-semibold text-foreground">
                  {property.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/60">
                  <MapPin className="h-4 w-4 text-primary" />
                  {formatLocation(property)}
                </p>
                {(property.developer || property.subdivision) && (
                  <p className="mt-1 text-sm text-foreground/50">
                    {[property.developer, property.subdivision].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <StatusBadge status={property.status} />
                {property.listingType && (
                  <span className="inline-flex items-center rounded-full bg-background-secondary px-3 py-1 text-xs font-medium text-foreground/70">
                    {property.listingType}
                  </span>
                )}
                {property.condition && (
                  <span className="inline-flex items-center rounded-full bg-background-secondary px-3 py-1 text-xs font-medium text-foreground/70">
                    {property.condition}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-4 text-2xl font-semibold text-foreground">{formatPrice(property.price)}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {property.bedrooms !== null && <Stat icon={BedDouble} label={plural(property.bedrooms, "Bedroom")} />}
              {property.bathrooms !== null && <Stat icon={Bath} label={plural(property.bathrooms, "Bathroom")} />}
              {property.lotArea !== null && <Stat icon={Ruler} label={formatArea(property.lotArea, "sqm Lot")!} />}
              {property.floorArea !== null && (
                <Stat icon={Square} label={formatArea(property.floorArea, "sqm Floor")!} />
              )}
              {property.floors !== null && <Stat icon={Stairs} label={plural(property.floors, "Floor")} />}
              {property.carParkingSpaces !== null && (
                <Stat icon={Car} label={`${property.carParkingSpaces} Parking`} />
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-foreground/70">{property.description}</p>

            {property.features.length > 0 && (
              <DetailList title="Features" items={property.features} />
            )}
            {property.amenities.length > 0 && (
              <DetailList title="Amenities" items={property.amenities} />
            )}
            {property.nearbyLocations.length > 0 && (
              <DetailList title="Nearby Locations" items={property.nearbyLocations} />
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" onClick={() => setView("inquire")}>
                Inquire About This Property
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setView("schedule")}>
                Schedule a Viewing
              </Button>
              <ShareButton property={property} />
            </div>
          </div>
        </div>
      )}

      {view === "inquire" && (
        <FormWrapper title="Inquire About This Property" onBack={() => setView("details")}>
          <InquiryForm presetProperty={property.title} />
        </FormWrapper>
      )}

      {view === "schedule" && (
        <FormWrapper title="Schedule a Viewing" onBack={() => setView("details")}>
          <ViewingForm presetProperty={property.title} />
        </FormWrapper>
      )}
    </Modal>
  );
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

// The street address often already ends with the city/province, so only append
// the parts it doesn't contain (avoids "Tanza, Cavite, Tanza, Cavite").
function formatLocation({ propertyAddress, city, province }: Property) {
  const address = propertyAddress?.trim() ?? "";
  const lower = address.toLowerCase();
  const extra = [city, province].filter((part) => part && !lower.includes(part.toLowerCase()));
  return [address, ...extra].filter(Boolean).join(", ");
}

function ShareButton({ property }: { property: Property }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/properties?property=${encodeURIComponent(property.id)}`;
    const text = `${property.title} — ${formatPrice(property.price)}`;

    // Phones get the native share sheet (Messenger, Viber, SMS, ...); desktops copy the link.
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice && navigator.share) {
      try {
        await navigator.share({ title: property.title, text, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link to share the property:", url);
    }
  };

  return (
    <Button variant="outline" onClick={share} aria-label="Share this property" className="sm:w-auto">
      {copied ? <LinkSimple className="h-4 w-4" /> : <Share className="h-4 w-4" />}
      {copied ? "Link copied!" : "Share"}
    </Button>
  );
}

function Stat({ icon: Icon, label }: { icon: typeof BedDouble; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-background-secondary px-3 py-2.5 text-sm text-foreground/70">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-foreground/60">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormWrapper({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 sm:p-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-medium text-primary hover:underline cursor-pointer"
      >
        ← Back to details
      </button>
      <h2 className="mb-6 text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}
