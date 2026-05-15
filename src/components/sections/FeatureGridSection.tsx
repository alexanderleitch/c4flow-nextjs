"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface Feature {
  _key: string;
  title: string;
  description: string;
  icon?: { url?: string | null } | null;
}

interface FeatureGridSectionProps {
  heading?: string | null;
  subtitle?: string | null;
  features?: Feature[] | null;
  style?: string | null;
}

const CARD_CLASS = ["feature-card-1", "feature-card-2", "feature-card-3", "feature-card-4"];
const BLOB_CLASS = ["feature-blob-1", "feature-blob-2", "feature-blob-3", "feature-blob-4"];
const ICON_CLASS = ["feature-icon-1", "feature-icon-2", "feature-icon-3", "feature-icon-4"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function FeatureGridSection({
  heading,
  subtitle,
  features,
  style,
}: FeatureGridSectionProps) {
  if (!features?.length) return null;

  const variant = style || "minimal";
  const count = features.length;
  const resolvedHeading = heading?.trim() || "Studio Benefits";
  const gridCols =
    count === 1
      ? "max-w-md mx-auto"
      : count === 2
        ? "sm:grid-cols-2 max-w-2xl mx-auto"
        : count === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : `sm:grid-cols-2 lg:grid-cols-${Math.min(count, 3)}`;

  if (variant === "cards") {
    return (
      <section className="relative overflow-hidden py-8 md:py-24">
        <div
          className="feature-ambient-glow absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <Container>
          {heading ? (
            <SectionHeading subtitle={subtitle}>{heading}</SectionHeading>
          ) : (
            <h2 className="sr-only">{resolvedHeading}</h2>
          )}
          <motion.div
            className={`grid items-start gap-7 ${gridCols}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, i) => {
              const idx = i % 4;
              return (
                <motion.div
                  key={feature._key}
                  className={`feature-card group relative overflow-hidden p-8 shadow-md ${CARD_CLASS[idx]}`}
                  variants={cardVariants}
                >
                  <div
                    className={`absolute -left-6 -top-6 h-32 w-32 blur-[18px] transition-transform duration-700 group-hover:scale-110 ${BLOB_CLASS[idx]}`}
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    {feature.icon?.url && (
                      <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center shadow-lg ${ICON_CLASS[idx]}`}>
                        <Image
                          src={feature.icon.url}
                          alt=""
                          width={34}
                          height={34}
                          className="brightness-0 invert drop-shadow-md"
                        />
                      </div>
                    )}
                    <h3 className="mb-2 font-heading text-2xl text-primary-700">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-24">
      <Container>
        {heading ? (
          <SectionHeading subtitle={subtitle}>{heading}</SectionHeading>
        ) : (
          <h2 className="sr-only">{resolvedHeading}</h2>
        )}
        <motion.div
          className={`grid items-start gap-10 ${gridCols}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div key={feature._key} className="text-center" variants={cardVariants}>
              {feature.icon?.url && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={feature.icon.url}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain"
                  />
                </div>
              )}
              <h3 className="mb-2 font-heading text-3xl text-neutral-800 lg:text-4xl">{feature.title}</h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-neutral-500">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
