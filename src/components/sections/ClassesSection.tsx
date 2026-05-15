import { Info } from "lucide-react";
import { getKnowledgeBase } from "@/lib/catalog";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ClassCard } from "@/components/ui/ClassCard";
import { MotionDiv } from "@/components/shared/MotionDiv";

interface ClassesSectionProps {
  heading?: string | null;
  subtitle?: string | null;
  columns?: number | null;
  showBookingNote?: boolean | null;
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const GRID_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export async function ClassesSection({
  heading,
  subtitle,
  columns,
  showBookingNote,
}: ClassesSectionProps) {
  const knowledge = await getKnowledgeBase();
  const classes = knowledge.classes;

  if (!classes.length) return null;

  return (
    <section className="relative overflow-hidden bg-muted py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>{heading || "Our Classes"}</SectionHeading>

        <MotionDiv
          className={`grid gap-6 ${GRID_COLS[columns ?? 4] ?? GRID_COLS[4]}`}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.15 }}
        >
          {classes.map((cls) => (
            <MotionDiv key={cls.id} variants={cardReveal}>
              <ClassCard
                cls={{
                  id: cls.id,
                  name: cls.name,
                  slug: cls.slug,
                  tagline: cls.tagline,
                  daysSummary: cls.daysSummary,
                  imageUrl: cls.imageUrl,
                  imageAlt: cls.imageAlt,
                  imageLqip: cls.imageLqip,
                  listPrice: cls.listPrice,
                  currentPrice: cls.currentPrice,
                  hasDiscount: cls.hasDiscount,
                  durationMinutes: cls.durationMinutes,
                  bookingUrl: cls.bookingUrl,
                }}
                detailsHref={`/classes/${cls.slug}`}
              />
            </MotionDiv>
          ))}
        </MotionDiv>

        {showBookingNote && (
          <p className="mt-8 flex flex-col items-center gap-1 text-center text-sm text-neutral-400">
            <Info size={14} className="shrink-0" aria-hidden="true" />
            Clicking &ldquo;Book Now&rdquo; will redirect you to our booking platform (Setmore).
          </p>
        )}
      </Container>
    </section>
  );
}
