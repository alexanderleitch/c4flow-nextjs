import { MetadataRoute } from "next";
import { getKnowledgeBase } from "@/lib/catalog";
import { getSiteOriginForMetadata } from "@/lib/site-origin";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteOriginForMetadata();
  const knowledge = await getKnowledgeBase();

  const pageEntries: MetadataRoute.Sitemap = knowledge.pages.map((page) => ({
    url: page.slug === "home" ? baseUrl : `${baseUrl}/${page.slug}`,
    changeFrequency: "weekly" as const,
    priority: page.slug === "home" ? 1 : 0.8,
  }));

  const classEntries: MetadataRoute.Sitemap = knowledge.classes.map((cls) => ({
    url: `${baseUrl}/classes/${cls.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...pageEntries, ...classEntries];
}
