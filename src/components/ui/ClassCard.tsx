"use client";

import Image from "next/image";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, formatPriceLabel } from "@/lib/utils";
import { BookNowLink } from "@/components/ui/BookNowLink";
import { SITE_CONFIG } from "@/lib/constants";

interface ClassCardData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  daysSummary: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageLqip: string | null;
  listPrice: number | null;
  currentPrice: number | null;
  hasDiscount: boolean;
  durationMinutes: number | null;
  bookingUrl: string;
}

interface ClassCardProps {
  cls: ClassCardData;
  detailsHref?: string;
}

export function ClassCard({ cls, detailsHref }: ClassCardProps) {
  const {
    name,
    tagline,
    daysSummary,
    imageUrl,
    imageAlt,
    imageLqip,
    listPrice,
    currentPrice,
    hasDiscount,
    durationMinutes,
    bookingUrl,
  } = cls;

  const isFreeClass = listPrice === 0;
  const resolvedBookingUrl = bookingUrl || SITE_CONFIG.booking.url;

  const meta = [
    durationMinutes ? `${durationMinutes} min` : null,
    daysSummary || null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-card"
      whileHover={{
        y: -4,
        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {imageUrl && (
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            {...(imageLqip
              ? { placeholder: "blur" as const, blurDataURL: imageLqip }
              : {})}
          />
          <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
            {hasDiscount && currentPrice != null ? (
              <>
                <span className="text-pink-500">{formatPriceLabel(currentPrice)}</span>
                <span className="ml-1 text-[10px] text-neutral-400 line-through">
                  {formatCurrency(listPrice ?? 0)}
                </span>
              </>
            ) : (
              <span className="text-primary-600">{formatPriceLabel(listPrice ?? 0)}</span>
            )}
          </div>
          {hasDiscount && !isFreeClass && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Tag size={9} />
              SALE
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-heading text-lg text-neutral-800">{name}</h3>

        {meta && <p className="mt-1 text-xs text-neutral-400">{meta}</p>}

        {tagline && <p className="mt-1 text-xs text-neutral-500">{tagline}</p>}

        <div className="mt-3 flex gap-2">
          <BookNowLink
            href={resolvedBookingUrl}
            label={name}
            source="class_card"
            className="rounded-full border border-neutral-800 bg-neutral-800 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
          />
          {detailsHref && (
            <a
              href={detailsHref}
              className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
            >
              Learn More
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
