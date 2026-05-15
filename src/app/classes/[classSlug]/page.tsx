import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { JsonLd } from "@/components/shared/JsonLd";
import { BookNowLink } from "@/components/ui/BookNowLink";
import { formatCurrency, formatPriceLabel } from "@/lib/utils";
import { getClassBySlug, getKnowledgeBase } from "@/lib/catalog";
import {
  buildBreadcrumbJsonLd,
  buildClassPageJsonLd,
} from "@/lib/structured-data";

interface ClassPageProps {
  params: Promise<{ classSlug: string }>;
}

function buildScheduleSummary(
  schedule: Array<{ day: string; time: string }>,
): string | null {
  if (!schedule.length) return null;
  return schedule.map((slot) => `${slot.day} at ${slot.time}`).join(", ");
}

export async function generateStaticParams() {
  const knowledge = await getKnowledgeBase();
  return knowledge.classes.map((entry) => ({ classSlug: entry.slug }));
}

export async function generateMetadata({
  params,
}: ClassPageProps): Promise<Metadata> {
  const { classSlug } = await params;
  const [entry, knowledge] = await Promise.all([
    getClassBySlug(classSlug),
    getKnowledgeBase(),
  ]);

  if (!entry) return {};

  const scheduleSummary = buildScheduleSummary(entry.schedule);
  const title = `${entry.name} Class in ${knowledge.site.address.city}`;
  const descriptionParts = [
    entry.summary,
    scheduleSummary ? `Schedule: ${scheduleSummary}.` : null,
    entry.currentPrice != null
      ? `Price: ${entry.currentPrice === 0 ? "Free" : formatCurrency(entry.currentPrice)}.`
      : null,
  ].filter(Boolean);

  return {
    title,
    description: descriptionParts.join(" "),
    alternates: {
      canonical: `/classes/${entry.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description: descriptionParts.join(" "),
      url: `/classes/${entry.slug}`,
      ...(entry.imageUrl && {
        images: [{ url: entry.imageUrl, width: 1200, height: 900 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptionParts.join(" "),
      ...(entry.imageUrl && { images: [entry.imageUrl] }),
    },
  };
}

export default async function ClassPage({ params }: ClassPageProps) {
  const { classSlug } = await params;
  const [entry, knowledge] = await Promise.all([
    getClassBySlug(classSlug),
    getKnowledgeBase(),
  ]);

  if (!entry) notFound();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: knowledge.site.url },
    { name: "Classes", url: `${knowledge.site.url}/classes` },
    { name: entry.name, url: entry.url },
  ]);
  const classJsonLd = buildClassPageJsonLd(entry, knowledge.site);

  return (
    <main id="main-content" className="py-10 md:py-20">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={classJsonLd} />

      <Container className="max-w-5xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-neutral-400"
        >
          <Link href="/" className="hover:text-neutral-700">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href="/classes" className="hover:text-neutral-700">
            Classes
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="text-neutral-700">{entry.name}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-pink-500">
              {knowledge.site.tagline}
            </p>
            <h1 className="mt-3 font-heading text-4xl text-neutral-800 md:text-6xl">
              {entry.name}
            </h1>
            {entry.tagline && (
              <p className="mt-3 text-lg text-neutral-500">{entry.tagline}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {entry.currentPrice != null && (
                <span className="rounded-full bg-pink-50 px-4 py-2 font-medium text-pink-700">
                  {entry.hasDiscount && entry.listPrice ? (
                    <>
                      {formatPriceLabel(entry.currentPrice)}
                      <span className="ml-2 text-neutral-400 line-through">
                        {formatCurrency(entry.listPrice)}
                      </span>
                    </>
                  ) : (
                    formatPriceLabel(entry.currentPrice)
                  )}
                </span>
              )}
              {entry.durationMinutes && (
                <span className="rounded-full bg-neutral-100 px-4 py-2 text-neutral-700">
                  {entry.durationMinutes} min
                </span>
              )}
              {entry.daysSummary && (
                <span className="rounded-full bg-neutral-100 px-4 py-2 text-neutral-700">
                  {entry.daysSummary}
                </span>
              )}
            </div>

            <div className="prose prose-neutral mt-8 max-w-none text-neutral-600 [&_p]:leading-relaxed">
              {entry.descriptionBlocks?.length ? (
                <PortableText value={entry.descriptionBlocks as never} />
              ) : (
                <p>{entry.summary}</p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <BookNowLink
                href={entry.bookingUrl}
                label={entry.name}
                source="class_page"
                className="rounded-full bg-pink-500 px-6 py-3 text-sm font-medium text-white hover:bg-pink-600"
              >
                Book This Class
              </BookNowLink>
              <Link
                href="/classes"
                className="rounded-full border border-border px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                See All Classes
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {entry.imageUrl && (
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border/60 bg-neutral-100">
                <Image
                  src={entry.imageUrl}
                  alt={entry.imageAlt || entry.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  placeholder={entry.imageLqip ? "blur" : "empty"}
                  blurDataURL={entry.imageLqip || undefined}
                />
              </div>
            )}

            <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-2xl text-neutral-800">
                Weekly Schedule
              </h2>
              {entry.schedule.length ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-border/60">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">Day</th>
                        <th className="px-4 py-3 font-medium">Time</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.schedule.map((slot, index) => (
                        <tr
                          key={`${slot.day}-${slot.time}-${index}`}
                          className="border-t border-border/60"
                        >
                          <td className="px-4 py-3 font-medium text-neutral-800">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar size={14} aria-hidden="true" />
                              {slot.day}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-600">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={14} aria-hidden="true" />
                              {slot.time}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-600">
                            {entry.currentPrice != null ? (
                              <span className="font-medium text-pink-500">
                                {formatPriceLabel(entry.currentPrice)}
                              </span>
                            ) : (
                              "Contact us"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-sm text-neutral-500">
                  Schedule times are updated on the main classes page. Contact us if
                  you need the next available session for {entry.name}.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-border/60 bg-neutral-50 p-6">
              <h2 className="font-heading text-2xl text-neutral-800">
                Studio Details
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-neutral-700">Location</dt>
                  <dd className="text-neutral-500">
                    {knowledge.site.address.building
                      ? `${knowledge.site.address.building}, `
                      : ""}
                    {knowledge.site.address.street}, {knowledge.site.address.city}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-700">Booking</dt>
                  <dd className="text-neutral-500">
                    Contact Cattleya directly via WhatsApp or the contact page to book your spot.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-700">Contact</dt>
                  <dd className="text-neutral-500">
                    <a
                      href={`tel:${knowledge.site.phone}`}
                      className="hover:text-neutral-700"
                    >
                      {knowledge.site.phone}
                    </a>
                    {" · "}
                    <a
                      href={`mailto:${knowledge.site.email}`}
                      className="hover:text-neutral-700"
                    >
                      {knowledge.site.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
