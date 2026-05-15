"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import Link from "next/link";
import { getExternalLinkRel } from "@/lib/seo";

interface SecondaryLink {
  _key?: string;
  label: string;
  url: string;
}

interface CtaSectionProps {
  heading: string;
  subtitle?: Array<Record<string, unknown>> | string | null;
  buttonText: string;
  buttonUrl?: string | null;
  style?: string | null;
  backgroundImage?: { url?: string | null; lqip?: string | null } | null;
  secondaryLinks?: SecondaryLink[] | null;
}

export function CtaSection({
  heading,
  subtitle,
  buttonText,
  buttonUrl,
  style,
  backgroundImage,
  secondaryLinks,
}: CtaSectionProps) {
  const cleanStyle = style || "gradient";
  const hasBgImage = cleanStyle === "bgImage" && !!backgroundImage?.url;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-16 md:py-28",
        cleanStyle === "gradient" &&
          "animated-gradient bg-linear-to-br from-primary-700 via-primary-600 to-pink-500 text-white",
        cleanStyle === "dark" && "bg-primary-700 text-white",
        cleanStyle === "light" && "bg-muted text-neutral-800",
        hasBgImage && "text-neutral-800"
      )}
    >
      {hasBgImage && (
        <Image
          src={backgroundImage!.url!}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
          {...(backgroundImage!.lqip
            ? { placeholder: "blur" as const, blurDataURL: backgroundImage!.lqip }
            : {})}
        />
      )}

      {cleanStyle !== "light" && !hasBgImage && (
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl"
          aria-hidden="true"
        />
      )}

      <Container className="relative z-10 text-center">
        <motion.h2
          className={cn(
            "font-heading text-3xl md:text-5xl",
            cleanStyle === "light" || hasBgImage
              ? "text-neutral-800"
              : "text-white"
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h2>
        {subtitle && (
          <motion.div
            className={cn(
              "mx-auto mt-4 max-w-xl text-lg [&_p]:mb-0",
              cleanStyle === "light" || hasBgImage
                ? "text-neutral-500 [&_a]:text-pink-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-pink-700"
                : "text-primary-100 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-pink-200"
            )}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {typeof subtitle === "string" ? (
              <p>{subtitle}</p>
            ) : (
              <PortableText value={subtitle as never} />
            )}
          </motion.div>
        )}
        {buttonUrl && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TrackedCtaLink
              href={buttonUrl}
              source="cta_section"
              className={cn(
                "mt-8 inline-block rounded-full px-8 py-3.5 text-lg font-medium shadow-md transition-transform duration-200 hover:scale-105",
                cleanStyle === "light"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : hasBgImage
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-white text-primary-600 hover:bg-primary-50"
              )}
            >
              {buttonText}
            </TrackedCtaLink>
          </motion.div>
        )}
        {secondaryLinks && secondaryLinks.length > 0 && (
          <motion.div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {secondaryLinks.map((link, i) => {
              const isExternal = link.url.startsWith("http");
              const linkClass = cn(
                "text-sm font-medium underline underline-offset-4 transition-colors",
                cleanStyle === "light" || hasBgImage
                  ? "text-neutral-500 hover:text-neutral-800"
                  : "text-primary-100 hover:text-white"
              );
              return isExternal ? (
                <a
                  key={link._key || i}
                  href={link.url}
                  target="_blank"
                  rel={getExternalLinkRel(link.url)}
                  className={linkClass}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link._key || i}
                  href={link.url}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
