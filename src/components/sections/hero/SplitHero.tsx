import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";
import type { HeroSectionProps } from "./types";
import { heroAspectClasses, hasImageRatio } from "./types";
import { HeroCta } from "./HeroCta";

type SplitHeroProps = Pick<
  HeroSectionProps,
  | "headline"
  | "headlineColor"
  | "imageRatio"
  | "subtitle"
  | "body"
  | "backgroundImage"
  | "sectionBackground"
  | "ctaText"
  | "ctaUrl"
>;

export function SplitHero({
  headline,
  headlineColor,
  imageRatio,
  subtitle,
  body,
  backgroundImage,
  sectionBackground,
  ctaText,
  ctaUrl,
}: SplitHeroProps) {
  const hasSectionBg = !!sectionBackground?.url;

  return (
    <section className="relative overflow-hidden bg-white">
      {hasSectionBg && (
        <Image
          src={sectionBackground.url!}
          alt=""
          fill
          priority
          className="hidden object-cover lg:block"
          sizes="100vw"
          {...(sectionBackground.lqip
            ? { placeholder: "blur" as const, blurDataURL: sectionBackground.lqip }
            : {})}
        />
      )}

      <div className="relative mx-auto max-w-7xl">
        <div className="relative z-10 lg:w-full lg:max-w-2xl">
          {!hasSectionBg && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 fill-white lg:block"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>
          )}

          <div className="relative px-6 py-14 sm:py-16 lg:px-12 lg:py-32 lg:pr-0">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <h1
                className="font-heading text-5xl tracking-tight text-pink-700 sm:text-6xl lg:text-7xl"
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
                <div className="mt-6 text-base leading-relaxed text-neutral-500 sm:text-lg [&_a]:text-pink-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-pink-700 [&_p]:mb-0">
                  {typeof body === "string" ? (
                    <p>{body}</p>
                  ) : (
                    <PortableText value={body as never} />
                  )}
                </div>
              )}

              {ctaText && ctaUrl && (
                <div className="mt-10">
                  <HeroCta href={ctaUrl} source="hero_split">
                    {ctaText}
                  </HeroCta>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative lg:absolute lg:inset-y-0 lg:right-0 lg:min-h-0 lg:w-1/2",
          hasImageRatio(imageRatio, { skipDesktop: true })
            ? heroAspectClasses(imageRatio, { skipDesktop: true })
            : "aspect-4/3",
          hasSectionBg &&
            "lg:[clip-path:polygon(18%_0%,100%_0%,100%_100%,0%_100%)]",
        )}
      >
        {backgroundImage?.url ? (
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            {...(backgroundImage.lqip
              ? { placeholder: "blur" as const, blurDataURL: backgroundImage.lqip }
              : {})}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary-100 via-pink-100 to-primary-50" />
        )}
      </div>
    </section>
  );
}
