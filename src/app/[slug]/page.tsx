import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBuilder } from "@/components/sections/PageBuilder";
import { JsonLd } from "@/components/shared/JsonLd";
import { buildFaqJsonLd } from "@/lib/seo";
import { getKnowledgeBase } from "@/lib/catalog";
import { buildCatalogPageJsonLd } from "@/lib/structured-data";

interface PageData {
  slug: string;
  title: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  sections: unknown[];
}

const PAGES_DIR = join(process.cwd(), "content/pages");

function loadPage(slug: string): PageData | null {
  try {
    const raw = readFileSync(join(PAGES_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(raw) as PageData;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const files = readdirSync(PAGES_DIR).filter(
    (f) => f.endsWith(".json") && f !== "home.json",
  );
  return files.map((f) => ({ slug: f.replace(".json", "") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = loadPage(slug);
  if (!page) return {};

  const title = page.seoTitle || page.title || undefined;
  const description = page.seoDescription || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      siteName: "C4 Flow",
      title,
      description,
      url: `/${slug}`,
      ...(page.ogImageUrl && {
        images: [{ url: page.ogImageUrl, width: 1200, height: 630, type: "image/jpeg" }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(page.ogImageUrl && { images: [page.ogImageUrl] }),
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, knowledge] = await Promise.all([
    Promise.resolve(loadPage(slug)),
    getKnowledgeBase(),
  ]);

  if (!page) notFound();

  const faqJsonLd = buildFaqJsonLd(page.sections as never);
  const sectionTypes = (page.sections || [])
    .map((s: unknown) => (s as { _type?: string })?._type || "")
    .filter(Boolean);
  const showCatalogJsonLd = sectionTypes.some((t: string) =>
    ["classesSection", "classDetailsSection", "scheduleSection", "pricingSection"].includes(t),
  );
  const catalogJsonLd = showCatalogJsonLd
    ? buildCatalogPageJsonLd({
        pageUrl: `${knowledge.site.url}/${slug}`,
        pageTitle: page.seoTitle || page.title || slug,
        pageDescription:
          page.seoDescription ||
          `Browse ${knowledge.site.name} classes, schedule, and pricing.`,
        classes: knowledge.classes,
        bundles: knowledge.bundles,
      })
    : null;

  return (
    <main id="main-content">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {catalogJsonLd && <JsonLd data={catalogJsonLd} />}
      <PageBuilder sections={page.sections as never} siteLogoUrl={knowledge.site.logoUrl} />
    </main>
  );
}
