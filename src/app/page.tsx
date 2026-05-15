import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { PageBuilder } from "@/components/sections/PageBuilder";
import { JsonLd } from "@/components/shared/JsonLd";
import { buildFaqJsonLd } from "@/lib/seo";
import { getKnowledgeBase } from "@/lib/catalog";
import { buildCatalogPageJsonLd } from "@/lib/structured-data";

function loadHomePage() {
  const raw = readFileSync(join(process.cwd(), "content/pages/home.json"), "utf-8");
  return JSON.parse(raw) as {
    seoTitle: string | null;
    seoDescription: string | null;
    sections: unknown[];
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadHomePage();
  const title = page.seoTitle || "C-4 Flow | Pole & Exotic Dance Studio";
  const description =
    page.seoDescription ||
    "C4 Flow Studio offers pole dancing classes in Cape Town, with group and private sessions for all levels at our inclusive Woodstock studio.";

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      siteName: "C4 Flow",
      title,
      description,
      url: "/",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home() {
  const [page, knowledge] = await Promise.all([
    Promise.resolve(loadHomePage()),
    getKnowledgeBase(),
  ]);

  const faqJsonLd = buildFaqJsonLd(page.sections as never);
  const catalogJsonLd = buildCatalogPageJsonLd({
    pageUrl: knowledge.site.url,
    pageTitle: page.seoTitle || knowledge.site.name,
    pageDescription:
      page.seoDescription ||
      "Browse C4 Flow classes, weekly schedule, and pricing in Cape Town.",
    classes: knowledge.classes,
    bundles: knowledge.bundles,
  });

  return (
    <main id="main-content">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd data={catalogJsonLd} />
      <PageBuilder sections={page.sections as never} siteLogoUrl={knowledge.site.logoUrl} />
    </main>
  );
}
