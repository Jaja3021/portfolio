import "server-only";

import { createAnonClient, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  ClientRow,
  DealRow,
  InquiryRow,
  PropertyRow,
  SiteSettingsRow,
  TestimonialRow,
  ViewingRequestRow,
} from "@/lib/supabase/types";
import {
  MOCK_CLIENTS,
  MOCK_DEALS,
  MOCK_INQUIRIES,
  MOCK_SETTINGS,
  MOCK_VIEWING_REQUESTS,
  PROPERTIES,
  TESTIMONIALS,
} from "@/lib/mock-data";
import type { Client, Deal, Inquiry, Property, SiteSettings, Testimonial, ViewingRequest } from "@/lib/types";

function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    propertyType: row.property_type,
    region: row.region,
    province: row.province,
    city: row.city,
    price: row.price,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    lotArea: row.lot_area,
    floorArea: row.floor_area,
    status: row.status,
    featured: row.featured,
    images: row.property_images?.map((i) => i.image_url) ?? [],
    features: row.features ?? [],
    amenities: row.amenities ?? [],
    nearbyLocations: row.nearby_locations ?? [],
    createdAt: row.created_at,
  };
}

function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? undefined,
    rating: row.rating,
    message: row.message,
    enabled: row.enabled,
  };
}

function mapInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    preferredProperty: row.preferred_property,
    preferredLocation: row.preferred_location,
    budget: row.budget,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapViewingRequest(row: ViewingRequestRow): ViewingRequest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    propertyText: row.property_text,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    source: row.source,
    status: row.status,
    notes: row.notes,
    nextFollowUp: row.next_follow_up,
    createdAt: row.created_at,
  };
}

function mapDeal(row: DealRow): Deal {
  return {
    id: row.id,
    clientName: row.client_name,
    propertyTitle: row.property_title,
    stage: row.stage,
    amount: row.amount,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function mapSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    phone: row.phone,
    email: row.email,
    facebook: row.facebook,
    instagram: row.instagram,
    tiktok: row.tiktok,
    youtube: row.youtube,
    notifyOnInquiry: row.notify_on_inquiry,
    notifyOnViewing: row.notify_on_viewing,
  };
}

// Falls back to local mock data until NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are set
// (see .env.example) — this keeps the site fully functional before Phase 2 wiring
// is connected to a real project, and is the only place that needs to change.
export async function getProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) return PROPERTIES;

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(image_url)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load properties from Supabase:", error?.message);
    return PROPERTIES;
  }

  return (data as PropertyRow[]).map(mapProperty);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return TESTIMONIALS;

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("enabled", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load testimonials from Supabase:", error?.message);
    return TESTIMONIALS;
  }

  return (data as TestimonialRow[]).map(mapTestimonial);
}

// --- Admin-only reads (require an authenticated session once Supabase is connected) ---

export async function getAllTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return TESTIMONIALS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load testimonials from Supabase:", error?.message);
    return TESTIMONIALS;
  }

  return (data as TestimonialRow[]).map(mapTestimonial);
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (!isSupabaseConfigured) return MOCK_INQUIRIES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load inquiries from Supabase:", error?.message);
    return MOCK_INQUIRIES;
  }

  return (data as InquiryRow[]).map(mapInquiry);
}

export async function getViewingRequests(): Promise<ViewingRequest[]> {
  if (!isSupabaseConfigured) return MOCK_VIEWING_REQUESTS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewing_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load viewing requests from Supabase:", error?.message);
    return MOCK_VIEWING_REQUESTS;
  }

  return (data as ViewingRequestRow[]).map(mapViewingRequest);
}

export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured) return MOCK_CLIENTS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load clients from Supabase:", error?.message);
    return MOCK_CLIENTS;
  }

  return (data as ClientRow[]).map(mapClient);
}

export async function getDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured) return MOCK_DEALS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load deals from Supabase:", error?.message);
    return MOCK_DEALS;
  }

  return (data as DealRow[]).map(mapDeal);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return MOCK_SETTINGS;

  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load site settings from Supabase:", error.message);
    return MOCK_SETTINGS;
  }

  return mapSiteSettings(data as SiteSettingsRow);
}

export interface PageViewStats {
  total: number;
  today: number;
  thisWeek: number;
}

export async function getPageViewStats(): Promise<PageViewStats> {
  if (!isSupabaseConfigured) return { total: 0, today: 0, thisWeek: 0 };

  const supabase = await createClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, today, thisWeek] = await Promise.all([
    supabase.from("page_views").select("*", { count: "exact", head: true }),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo.toISOString()),
  ]);

  if (total.error) console.error("Failed to load page view stats from Supabase:", total.error.message);

  return {
    total: total.count ?? 0,
    today: today.count ?? 0,
    thisWeek: thisWeek.count ?? 0,
  };
}
