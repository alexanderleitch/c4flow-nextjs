"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import { trackGalleryOpen } from "@/lib/analytics";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface GalleryImage {
  _key: string;
  thumbUrl: string;
  fullUrl: string;
  alt: string;
  caption?: string | null;
  lqip?: string | null;
}

interface GalleryGridProps {
  images: GalleryImage[];
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function GalleryGrid({ images }: GalleryGridProps) {
  const [index, setIndex] = useState(-1);

  const slides: Slide[] = images.map((img) => ({
    src: img.fullUrl,
    alt: img.alt,
    title: img.caption || undefined,
  }));

  const openLightbox = useCallback((i: number) => {
    setIndex(i);
    trackGalleryOpen(i);
  }, []);

  return (
    <>
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {images.map((image, i) => (
          <motion.button
            key={image._key}
            type="button"
            onClick={() => openLightbox(i)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            aria-label={`View ${image.alt || "gallery image"} in lightbox`}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={image.thumbUrl}
              alt={image.alt || "Gallery image"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              {...(image.lqip
                ? { placeholder: "blur" as const, blurDataURL: image.lqip }
                : {})}
            />
            <div
              className="absolute inset-0 bg-primary-700/0 transition-colors duration-300 group-hover:bg-primary-700/20"
              aria-hidden="true"
            />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
                <p className="text-sm text-white">{image.caption}</p>
              </div>
            )}
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/0 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/80 group-hover:text-neutral-800 group-hover:opacity-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions, Counter, Zoom]}
        captions={{ descriptionTextAlign: "center" }}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        animation={{ fade: 250, swipe: 300 }}
        carousel={{ finite: false, preload: 2 }}
        zoom={{ maxZoomPixelRatio: 3 }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.92)" } }}
        render={{
          iconPrev: () => <ChevronIcon direction="left" />,
          iconNext: () => <ChevronIcon direction="right" />,
          iconClose: () => <CloseIcon />,
        }}
      />
    </>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
