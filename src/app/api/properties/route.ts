import { NextResponse } from "next/server";
import { getProperties } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  const properties = await getProperties();

  const filtered = q
    ? properties.filter((p) =>
        [p.title, p.city, p.province, p.propertyType]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : properties;

  return NextResponse.json({
    count: filtered.length,
    properties: filtered.map((p) => ({
      title: p.title,
      description: p.description,
      propertyType: p.propertyType,
      location: `${p.city}, ${p.province}`,
      price: p.price,
      status: p.status,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      lotAreaSqm: p.lotArea,
      floorAreaSqm: p.floorArea,
      features: p.features,
      amenities: p.amenities,
      photo: p.images[0] ?? null,
    })),
  });
}
