"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { motion } from "framer-motion";

interface Testimonial {
  _id: string;
  quote: string | null;
  name: string | null;
  role: string | null;
  photo: { url?: string | null; lqip?: string | null } | null;
  rating: number | null;
}

interface TestimonialsSectionProps {
  heading?: string | null;
  subtitle?: string | null;
  testimonials: Testimonial[];
}

const CARD_THEMES = [
  {
    bg: "from-primary-50 via-pink-50 to-primary-50",
    accent: "text-primary-500",
    quote: "text-primary-300/50",
    border: "border-primary-200/60",
    avatarBg: "bg-primary-200 text-primary-600",
  },
  {
    bg: "from-pink-50 via-orange-50 to-pink-50",
    accent: "text-pink-500",
    quote: "text-pink-300/50",
    border: "border-pink-200/60",
    avatarBg: "bg-pink-200 text-pink-600",
  },
  {
    bg: "from-teal-50 via-primary-50 to-teal-50",
    accent: "text-teal-500",
    quote: "text-teal-300/50",
    border: "border-teal-500/30",
    avatarBg: "bg-teal-50 text-teal-600",
  },
  {
    bg: "from-orange-50 via-pink-50 to-orange-50",
    accent: "text-orange-500",
    quote: "text-orange-300/50",
    border: "border-orange-200/60",
    avatarBg: "bg-orange-200 text-orange-600",
  },
];

export function TestimonialsSection({
  heading,
  subtitle,
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials?.length) return null;

  return (
    <section className="py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "What Our Students Say"}
        </SectionHeading>
      </Container>
      <TestimonialCarousel testimonials={testimonials} />
    </section>
  );
}

function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.clientWidth || 340;
    const gap = 24;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      {/* Navigation buttons — positioned within content area */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg ring-1 ring-black/5 transition-colors hover:bg-neutral-50 md:left-4 lg:left-8"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} className="text-neutral-600" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg ring-1 ring-black/5 transition-colors hover:bg-neutral-50 md:right-4 lg:right-8"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} className="text-neutral-600" />
        </button>
      )}

      {/* Scroll container — full-bleed with content-aligned padding */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+1.5rem))]"
        role="list"
        aria-label="Testimonials"
      >
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={t._id}
            testimonial={t}
            theme={CARD_THEMES[i % CARD_THEMES.length]}
            index={i}
          />
        ))}
      </div>

      {/* Dot indicators for mobile */}
      {testimonials.length > 1 && (
        <div
          className="mt-6 flex justify-center gap-1.5 md:hidden"
          aria-hidden="true"
        >
          {testimonials.map((t, i) => (
            <div
              key={t._id}
              className={`h-1.5 rounded-full transition-colors ${
                i === 0
                  ? "w-6 bg-primary-400"
                  : "w-1.5 bg-neutral-200"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  theme,
  index,
}: {
  testimonial: Testimonial;
  theme: (typeof CARD_THEMES)[number];
  index: number;
}) {
  const { quote, name, role, photo, rating } = testimonial;
  const hasPhoto = !!photo?.url;
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "★";

  return (
    <motion.div
      data-card
      className={`relative flex w-[min(85vw,360px)] shrink-0 snap-center flex-col rounded-2xl border bg-linear-to-br p-6 shadow-sm md:w-[380px] md:p-8 ${theme.bg} ${theme.border}`}
      role="listitem"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Decorative quote mark */}
      <Quote
        size={48}
        className={`absolute right-5 top-5 ${theme.quote}`}
        strokeWidth={1.5}
        aria-hidden="true"
      />

      {/* Stars */}
      {rating && (
        <div className="mb-4 flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < rating
                  ? "fill-orange-400 text-orange-400"
                  : "fill-neutral-200 text-neutral-200"
              }
            />
          ))}
        </div>
      )}

      {/* Quote text */}
      <blockquote className="relative z-10 flex-1 text-base leading-relaxed text-neutral-600 md:text-lg">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Attribution */}
      {(name || role) && (
        <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
          {/* Avatar */}
          {hasPhoto ? (
            <Image
              src={photo!.url!}
              alt={name || "Student"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              {...(photo?.lqip ? { placeholder: "blur" as const, blurDataURL: photo.lqip } : {})}
            />
          ) : (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white ${theme.avatarBg}`}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}

          <div className="min-w-0">
            {name && (
              <p className="text-sm font-semibold text-neutral-800">
                {name}
              </p>
            )}
            {role && (
              <p className={`text-xs ${theme.accent}`}>{role}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
