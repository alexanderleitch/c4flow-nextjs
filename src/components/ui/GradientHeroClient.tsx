"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { HeroCta } from "@/components/sections/hero/HeroCta";

interface GradientHeroClientProps {
  headline: string;
  headlineColor?: { hex?: string } | null;
  subtitle?: string | null;
  body?: Array<Record<string, unknown>> | string | null;
  backgroundImage?: {
    url?: string | null;
    alt?: string;
    lqip?: string | null;
  } | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

const SPRING_CONFIG = { stiffness: 50, damping: 30, mass: 1 };

export function GradientHeroClient({
  headline,
  headlineColor,
  subtitle,
  body,
  backgroundImage,
  ctaText,
  ctaUrl,
}: GradientHeroClientProps) {
  const hasBgImage = !!backgroundImage?.url;
  const sectionRef = useRef<HTMLElement>(null);

  const blobAx = useMotionValue(0);
  const blobAy = useMotionValue(0);
  const blobBx = useMotionValue(0);
  const blobBy = useMotionValue(0);

  const springAx = useSpring(blobAx, SPRING_CONFIG);
  const springAy = useSpring(blobAy, SPRING_CONFIG);
  const springBx = useSpring(blobBx, SPRING_CONFIG);
  const springBy = useSpring(blobBy, SPRING_CONFIG);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      blobAx.set(x * 30);
      blobAy.set(y * 20);
      blobBx.set(x * -20);
      blobBy.set(y * -25);
    },
    [blobAx, blobAy, blobBx, blobBy],
  );

  const handleMouseLeave = useCallback(() => {
    blobAx.set(0);
    blobAy.set(0);
    blobBx.set(0);
    blobBy.set(0);
  }, [blobAx, blobAy, blobBx, blobBy]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate overflow-hidden bg-white px-6 py-14 sm:py-20 lg:px-8 lg:py-28"
    >
      {hasBgImage && (
        <Image
          src={backgroundImage!.url!}
          alt=""
          fill
          priority
          className="object-cover -z-20"
          sizes="100vw"
          {...(backgroundImage!.lqip
            ? { placeholder: "blur" as const, blurDataURL: backgroundImage!.lqip }
            : {})}
        />
      )}

      <motion.div
        aria-hidden="true"
        className="absolute -top-10 right-1/2 -z-10 mr-10 hidden transform-gpu blur-3xl sm:block"
        style={{ x: springAx, y: springAy }}
      >
        <div className="blob-clip aspect-1097/845 w-274 bg-linear-to-tr from-pink-300 to-primary-300 opacity-20" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:ml-16 sm:-top-112 sm:translate-x-0"
        style={{ x: springBx, y: springBy }}
      >
        <div className="blob-clip aspect-1097/845 w-274 bg-linear-to-tr from-pink-400 to-primary-400 opacity-15" />
      </motion.div>

      <div className="mx-auto max-w-2xl text-center">
        <h1
          className="font-heading text-5xl tracking-tight text-primary-600 sm:text-6xl lg:text-7xl"
          style={headlineColor?.hex ? { color: headlineColor.hex } : undefined}
        >
          {headline}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg font-medium text-neutral-600 sm:text-xl">
            {subtitle}
          </p>
        )}
        {body && (
          <div className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg [&_a]:text-pink-500 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-pink-600 [&_p]:mb-0">
            {typeof body === "string" ? (
              <p>{body}</p>
            ) : (
              <PortableText value={body as never} />
            )}
          </div>
        )}
        {ctaText && ctaUrl && (
          <div className="mt-10">
            <HeroCta href={ctaUrl} source="hero_gradient">
              {ctaText}
            </HeroCta>
          </div>
        )}
      </div>
    </section>
  );
}
