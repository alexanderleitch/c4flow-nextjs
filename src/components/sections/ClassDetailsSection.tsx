import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { getKnowledgeBase } from "@/lib/catalog";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatCurrency, formatPriceLabel } from "@/lib/utils";
import { BookNowLink } from "@/components/ui/BookNowLink";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ClassDetailsSectionProps {
  heading?: string | null;
  subtitle?: string | null;
}

export async function ClassDetailsSection({
  heading,
  subtitle,
}: ClassDetailsSectionProps) {
  const knowledge = await getKnowledgeBase();
  const classes = knowledge.classes;

  if (!classes.length) return null;

  return (
    <section id="class-details" className="scroll-mt-24 py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "More About Our Classes..."}
        </SectionHeading>

        <div className="mx-auto mt-4 max-w-5xl divide-y divide-border/60 md:mt-6 [&>*:last-child]:pb-0 [&>*+*]:pt-12 md:[&>*+*]:pt-16">
          {classes.map((cls, index) => {
            if (!cls.descriptionBlocks?.length) return null;
            const imageLeft = index % 2 === 0;

            return (
              <div
                key={cls.id}
                id={cls.id}
                className={cn(
                  "scroll-mt-24 grid items-start gap-8 pb-12 md:grid-cols-2 md:gap-12 md:pb-16",
                  !imageLeft && "md:[&>*:first-child]:order-2"
                )}
              >
                {/* Image */}
                {cls.imageUrl && (
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                    <Image
                      src={cls.imageUrl}
                      alt={cls.imageAlt || cls.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      {...(cls.imageLqip
                        ? { placeholder: "blur" as const, blurDataURL: cls.imageLqip }
                        : {})}
                    />
                  </div>
                )}

                {/* Content */}
                <div>
                  <h3 className="mb-1 font-heading text-3xl text-neutral-800 md:text-4xl">
                    {cls.slug ? (
                      <Link href={`/classes/${cls.slug}`} className="hover:text-pink-600">
                        {cls.name}
                      </Link>
                    ) : (
                      cls.name
                    )}
                  </h3>

                  {/* Meta: price, duration, tagline */}
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {cls.listPrice != null && (
                      <span className="font-semibold">
                        {cls.hasDiscount && cls.currentPrice != null ? (
                          <>
                            <span className="text-pink-500">
                              {formatPriceLabel(cls.currentPrice)}
                            </span>
                            <span className="ml-1.5 text-xs text-neutral-400 line-through">
                              {formatCurrency(cls.listPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-pink-500">
                            {formatPriceLabel(cls.listPrice)}
                          </span>
                        )}
                      </span>
                    )}
                    {cls.durationMinutes && (
                      <span className="text-neutral-400">
                        {cls.durationMinutes} min
                      </span>
                    )}
                    {cls.tagline && (
                      <span className="text-neutral-500">{cls.tagline}</span>
                    )}
                  </div>

                  {/* Schedule */}
                  {cls.schedule.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {cls.schedule.map((slot, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                        >
                          <Calendar size={11} />
                          {slot.day}
                          <Clock size={11} className="ml-1" />
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-sm text-neutral-600 [&_p]:mb-4 [&_p]:leading-relaxed">
                    <PortableText value={cls.descriptionBlocks as never} />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <BookNowLink
                      href={cls.bookingUrl || SITE_CONFIG.booking.url}
                      label={cls.name}
                      source="class_details"
                      className="inline-block rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
                    />
                    {cls.slug && (
                      <Link
                        href={`/classes/${cls.slug}`}
                        className="inline-block rounded-full border border-border px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        View Class Page
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
