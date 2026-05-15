import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getSiteOriginForMetadata } from "@/lib/site-origin";

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export interface SiteKnowledge {
  name: string;
  tagline: string;
  motto: string | null;
  url: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  bookingUrl: string;
  instagramUrl: string | null;
  instructorInstagramUrl: string | null;
  mapsUrl: string | null;
  logoUrl: string | null;
  defaultOgImageUrl: string | null;
  primaryInstructor: {
    name: string;
    title: string | null;
    instagramUrl: string | null;
    photoUrl: string | null;
    photoLqip?: string | null;
    experience?: string | null;
    bio?: unknown | null;
  } | null;
  address: {
    building: string | null;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
}

export interface PageKnowledge {
  title: string;
  slug: string;
  url: string;
  description: string | null;
  sectionTypes: string[];
}

export interface ScheduleEntry {
  day: string;
  time: string;
  startTime24: string | null;
  endTime24: string | null;
  nextOccurrenceIso: string | null;
  bookingUrl: string;
}

export interface ClassKnowledge {
  id: string;
  name: string;
  slug: string;
  url: string;
  shortDescription: string | null;
  descriptionText: string | null;
  descriptionBlocks: Array<Record<string, unknown>> | null;
  summary: string;
  tagline: string | null;
  category: string | null;
  days: string | null;
  daysSummary: string | null;
  durationMinutes: number | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageLqip: string | null;
  bookingUrl: string;
  priceCurrency: "ZAR";
  offerValidFrom: string;
  listPrice: number | null;
  currentPrice: number | null;
  salePrice: number | null;
  hasDiscount: boolean;
  discountLabel: string | null;
  schedule: ScheduleEntry[];
}

export interface BundleKnowledge {
  id: string;
  name: string;
  category: string;
  tagline: string | null;
  note: string | null;
  highlighted: boolean;
  url: string;
  priceCurrency: "ZAR";
  listPrice: number;
  currentPrice: number;
  salePrice: number | null;
  hasDiscount: boolean;
  discountLabel: string | null;
}

export interface KnowledgeBase {
  generatedAt: string;
  site: SiteKnowledge;
  pages: PageKnowledge[];
  classes: ClassKnowledge[];
  bundles: BundleKnowledge[];
  scheduleByDay: Array<{
    day: string;
    slots: Array<
      ScheduleEntry & {
        classId: string;
        className: string;
        classSlug: string;
        classUrl: string;
        currentPrice: number | null;
        listPrice: number | null;
        durationMinutes: number | null;
      }
    >;
  }>;
}

const SITE_ORIGIN = getSiteOriginForMetadata();

function normaliseUrls(kb: KnowledgeBase): KnowledgeBase {
  // Replace the baked-in production URL with the current origin so local dev
  // and preview deploys produce correct absolute URLs.
  const prod = "https://www.c4flow.co.za";
  if (SITE_ORIGIN === prod) return kb;

  const fix = (url: string | null | undefined): string | null => {
    if (!url) return url ?? null;
    return url.startsWith(prod) ? SITE_ORIGIN + url.slice(prod.length) : url;
  };

  return {
    ...kb,
    site: { ...kb.site, url: fix(kb.site.url) ?? kb.site.url },
    pages: kb.pages.map((p) => ({ ...p, url: fix(p.url) ?? p.url })),
    classes: kb.classes.map((c) => ({
      ...c,
      url: fix(c.url) ?? c.url,
      schedule: c.schedule.map((s) => ({ ...s })),
    })),
    bundles: kb.bundles.map((b) => ({ ...b, url: fix(b.url) ?? b.url })),
  };
}

let cached: KnowledgeBase | null = null;

export async function getKnowledgeBase(): Promise<KnowledgeBase> {
  if (cached) return cached;
  const filePath = join(process.cwd(), "content/data/knowledge-base.json");
  const raw = readFileSync(filePath, "utf-8");
  cached = normaliseUrls(JSON.parse(raw) as KnowledgeBase);
  return cached;
}

export async function getClassBySlug(slug: string): Promise<ClassKnowledge | null> {
  const kb = await getKnowledgeBase();
  return kb.classes.find((c) => c.slug === slug) ?? null;
}
