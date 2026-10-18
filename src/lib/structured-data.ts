import { CONTACT_INFO } from "@/lib/constants";
import { propertyPath } from "@/lib/property-url";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import type { Property } from "@/lib/types";

const AGENT_ID = "#agent";

const AREAS_SERVED = [
  "Naic, Cavite",
  "Tanza, Cavite",
  "Trece Martires, Cavite",
  "Imus, Cavite",
  "Dasmariñas, Cavite",
  "Bacoor, Cavite",
  "Pampanga",
  "Tarlac",
  "Batangas",
  "Parañaque, Metro Manila",
];

/** schema.org RealEstateAgent for the homepage. */
export function realEstateAgentJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/${AGENT_ID}`,
    name: SITE_NAME,
    description:
      "PRC-licensed real estate salesperson with Dream House Realty, helping Filipino families, first-time buyers, and OFWs buy house and lot and condo units in Cavite and across Luzon.",
    url: siteUrl,
    image: `${siteUrl}/arnold-fadriquila.png`,
    telephone: CONTACT_INFO.phoneHref,
    email: CONTACT_INFO.email,
    address: { "@type": "PostalAddress", addressRegion: "Cavite", addressCountry: "PH" },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "Place", name })),
    parentOrganization: { "@type": "RealEstateAgent", name: "Dream House Realty" },
    identifier: { "@type": "PropertyValue", name: "PRC Real Estate Salesperson (RES) No.", value: "0032198" },
    knowsLanguage: ["en", "fil"],
    sameAs: [CONTACT_INFO.facebook, CONTACT_INFO.instagram, CONTACT_INFO.tiktok, CONTACT_INFO.youtube],
  };
}

function accommodationType(property: Property): string {
  switch (property.propertyType) {
    case "Condominium":
      return "Apartment";
    case "Lot & Land":
      return "Place";
    case "Townhouse":
      return "House";
    default:
      return "SingleFamilyResidence";
  }
}

/** schema.org RealEstateListing for /properties/[slug]. */
export function realEstateListingJsonLd(property: Property) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${propertyPath(property)}`;
  const isLot = property.propertyType === "Lot & Land";
  const hasGeo = property.latitude != null && property.longitude != null;

  const accommodation: Record<string, unknown> = {
    "@type": accommodationType(property),
    name: property.title,
    address: {
      "@type": "PostalAddress",
      ...(property.propertyAddress && { streetAddress: property.propertyAddress }),
      addressLocality: property.city,
      addressRegion: property.province,
      addressCountry: "PH",
    },
    ...(hasGeo && {
      geo: { "@type": "GeoCoordinates", latitude: property.latitude, longitude: property.longitude },
    }),
  };
  if (!isLot) {
    if (property.bedrooms !== null) accommodation.numberOfBedrooms = property.bedrooms;
    if (property.bathrooms !== null) accommodation.numberOfBathroomsTotal = property.bathrooms;
    if (property.floorArea !== null) {
      accommodation.floorSize = { "@type": "QuantitativeValue", value: property.floorArea, unitCode: "MTK" };
    }
    if (property.amenities.length || property.features.length) {
      accommodation.amenityFeature = [...property.features, ...property.amenities].map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      }));
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url,
    datePosted: property.createdAt,
    ...(property.images.length && { image: property.images }),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "PHP",
      availability:
        property.status === "Sold"
          ? "https://schema.org/SoldOut"
          : property.status === "Pre-selling"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
      ...(property.listingType === "For Rent/Lease" && { businessFunction: "https://purl.org/goodrelations/v1#LeaseOut" }),
      seller: { "@type": "RealEstateAgent", "@id": `${siteUrl}/${AGENT_ID}`, name: SITE_NAME },
    },
    about: accommodation,
  };
}
