import type { HeroSectionProps } from "./hero/types";
import { CenteredHero } from "./hero/CenteredHero";
import { SplitHero } from "./hero/SplitHero";
import { GradientHeroClient } from "@/components/ui/GradientHeroClient";

export type { HeroSectionProps };

export function HeroSection({
  layout,
  headline,
  headlineColor,
  imageRatio,
  subtitle,
  tagline,
  body,
  backgroundImage,
  sectionBackground,
  overlayLogo,
  ctaText,
  ctaUrl,
  siteLogoUrl,
}: HeroSectionProps) {
  const variant = layout || "centered";

  if (variant === "split") {
    return (
      <SplitHero
        {...{ headline, headlineColor, imageRatio, subtitle, body, backgroundImage, sectionBackground, ctaText, ctaUrl }}
      />
    );
  }

  if (variant === "gradient") {
    return (
      <GradientHeroClient
        {...{ headline, headlineColor, subtitle, body, backgroundImage, ctaText, ctaUrl }}
      />
    );
  }

  return (
    <CenteredHero
      {...{ headline, headlineColor, imageRatio, subtitle, tagline, backgroundImage, overlayLogo, siteLogoUrl, ctaText, ctaUrl }}
    />
  );
}
