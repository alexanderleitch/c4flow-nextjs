import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSectionProps } from "./types";
import { heroAspectClasses, hasImageRatio } from "./types";
import { HeroCta } from "./HeroCta";

type CenteredHeroProps = Pick<
  HeroSectionProps,
  | "headline"
  | "headlineColor"
  | "imageRatio"
  | "subtitle"
  | "tagline"
  | "backgroundImage"
  | "overlayLogo"
  | "siteLogoUrl"
  | "ctaText"
  | "ctaUrl"
>;

export function CenteredHero({
  headline,
  headlineColor,
  imageRatio,
  subtitle,
  tagline,
  backgroundImage,
  overlayLogo,
  siteLogoUrl,
  ctaText,
  ctaUrl,
}: CenteredHeroProps) {
  const logoSrc = overlayLogo?.url ?? siteLogoUrl;

  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-plum-900 text-white",
        hasImageRatio(imageRatio)
          ? heroAspectClasses(imageRatio)
          : "h-[calc(100svh-var(--header-h)-var(--banner-h))]",
      )}
    >
      {backgroundImage?.url ? (
        <>
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
            {...(backgroundImage.lqip
              ? { placeholder: "blur" as const, blurDataURL: backgroundImage.lqip }
              : {})}
          />
          <div className="absolute inset-0 bg-plum-900/60" aria-hidden="true" />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-linear-to-br from-plum-900 via-plum-800 to-pink-800"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {logoSrc && (
          <Image
            src={logoSrc}
            alt={`${headline} logo`}
            width={160}
            height={167}
            className="mb-6 h-28 w-auto brightness-0 invert drop-shadow-lg md:h-36 lg:h-44"
            priority
          />
        )}

        <h1
          className="font-heading text-5xl drop-shadow-md md:text-7xl lg:text-8xl"
          style={headlineColor?.hex ? { color: headlineColor.hex } : undefined}
        >
          {headline}
        </h1>

        {subtitle && (
          <p className="mt-3 text-xl font-medium drop-shadow-sm md:text-2xl lg:text-3xl">
            {subtitle}
          </p>
        )}

        {tagline && (
          <p className="mt-4 text-lg font-medium italic tracking-wide text-pink-200 drop-shadow-sm md:text-xl">
            {tagline}
          </p>
        )}

        {ctaText && ctaUrl && (
          <HeroCta href={ctaUrl} source="hero_centered" size="lg" className="mt-8">
            {ctaText}
          </HeroCta>
        )}
      </div>
    </section>
  );
}
