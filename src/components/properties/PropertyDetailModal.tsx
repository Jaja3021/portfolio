"use client";

import {
  BathtubIcon as Bath,
  BedIcon as BedDouble,
  CalculatorIcon as Calculator,
  CaretDownIcon as ChevronDown,
  CarIcon as Car,
  CheckIcon as Check,
  CertificateIcon as Certificate,
  ArrowSquareOutIcon as ExternalLink,
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
import { MessagePropertyButtons } from "@/components/contact/MessagePropertyButtons";
import { AmortizationCalculator } from "@/components/calculator/AmortizationCalculator";
import { mapEmbedUrl, mapLinkUrl, youtubeEmbedUrl, youtubeVideoId } from "@/lib/media";
import { propertyPath } from "@/lib/property-url";
import type { Property } from "@/lib/types";
import { bedroomLabel, formatArea, formatPrice, showsLotArea } from "@/lib/utils";

type View = "details" | "inquire" | "schedule";

export function PropertyDetailModal({
  property,
  onClose,
}: {
  property: Property | null;
  onClose: () => void;
}) {
  if (!property) return null;

  return (
    <Modal open={!!property} onClose={onClose} labelledBy="property-modal-title">
      {/* Keyed so the inquire/schedule view resets when another listing opens. */}
      <PropertyDetails key={property.id} property={property} headingId="property-modal-title" />
    </Modal>
  );
}

/** Listing details with inquire/schedule views. Shared by the modal and /properties/[slug]. */
export function PropertyDetails({
  property,
  headingId,
  headingAs: Heading = "h2",
}: {
  property: Property;
  headingId: string;
  headingAs?: "h1" | "h2";
}) {
  const [view, setView] = useState<View>("details");

  return (
    <>
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
                <Heading id={headingId} className="mt-1 text-2xl font-semibold text-foreground">
                  {property.title}
                </Heading>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/60">
                  <MapPin className="h-4 w-4 text-primary" />
                  {formatLocation(property)}
                </p>
                {(property.developer || property.subdivision) && (
                  <p className="mt-1 text-sm text-foreground/50">
                    {[property.developer, property.subdivision].filter(Boolean).join(" · ")}
                  </p>
                )}
                {property.licenseToSell && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-accent-light px-2.5 py-1 text-xs font-medium text-primary">
                    <Certificate className="h-4 w-4" weight="fill" />
                    DHSUD License to Sell: {property.licenseToSell}
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
                {property.financing && (
                  <span className="inline-flex items-center rounded-full bg-background-secondary px-3 py-1 text-xs font-medium text-foreground/70">
                    {property.financing} financing
                  </span>
                )}
              </div>
            </div>

            <p className="mt-4 text-2xl font-semibold text-foreground">{formatPrice(property.price)}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {property.bedrooms !== null && <Stat icon={BedDouble} label={bedroomLabel(property.bedrooms, "long")} />}
              {property.bathrooms !== null && <Stat icon={Bath} label={plural(property.bathrooms, "Bathroom")} />}
              {showsLotArea(property) && <Stat icon={Ruler} label={formatArea(property.lotArea, "sqm Lot")!} />}
              {property.floorArea !== null && (
                <Stat icon={Square} label={formatArea(property.floorArea, "sqm Floor")!} />
              )}
              {property.floors !== null && <Stat icon={Stairs} label={plural(property.floors, "Floor")} />}
              {property.carParkingSpaces !== null && (
                <Stat icon={Car} label={`${property.carParkingSpaces} Parking`} />
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-foreground/70">{property.description}</p>

            <VideoTour url={property.youtubeUrl} title={property.title} />

            {property.features.length > 0 && (
              <DetailList title="Features" items={property.features} />
            )}
            {property.amenities.length > 0 && (
              <DetailList title="Amenities" items={property.amenities} />
            )}
            {property.nearbyLocations.length > 0 && (
              <DetailList title="Nearby Locations" items={property.nearbyLocations} />
            )}

            {property.latitude != null && property.longitude != null && (
              <LocationMap latitude={property.latitude} longitude={property.longitude} title={property.title} />
            )}

            {property.listingType !== "For Rent/Lease" && property.status !== "Sold" && property.price > 0 && (
              <PaymentEstimate price={property.price} />
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
            <MessagePropertyButtons property={property} />
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
    </>
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
    const url = `${window.location.origin}${propertyPath(property)}`;
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

function VideoTour({ url, title }: { url: string | null | undefined; title: string }) {
  const id = youtubeVideoId(url);
  if (!id) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-foreground">Video Tour</h3>
      <div className="mt-2 aspect-video overflow-hidden rounded-lg bg-black">
        <iframe
          src={youtubeEmbedUrl(id)}
          title={`Video tour: ${title}`}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}

function LocationMap({ latitude, longitude, title }: { latitude: number; longitude: number; title: string }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Location</h3>
        <a
          href={mapLinkUrl({ latitude, longitude })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
        >
          Open in Google Maps <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-2 aspect-[4/3] overflow-hidden rounded-lg border border-border sm:aspect-video">
        <iframe
          src={mapEmbedUrl({ latitude, longitude })}
          title={`Map: ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}

// Collapsed by default so the modal stays short on phones.
function PaymentEstimate({ price }: { price: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors cursor-pointer ${
          open ? "border-primary" : "border-border hover:border-foreground/25"
        }`}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Calculator className="h-5 w-5 text-primary" />
          Estimate Monthly Payments
        </span>
        <span className="flex items-center gap-2 text-sm text-muted">
          <span className="hidden sm:inline">Pag-IBIG · Bank · In-house</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180 text-primary" : ""}`} />
        </span>
      </button>
      {open && (
        <div className="mt-3">
          <AmortizationCalculator initialPrice={price} compact />
        </div>
      )}
    </div>
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
