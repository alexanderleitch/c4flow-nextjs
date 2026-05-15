export interface ImageField {
  url?: string | null;
  lqip?: string | null;
  alt?: string;
}

export interface SanityColorValue {
  hex?: string;
  _type?: string;
}

export interface ImageRatio {
  mobile?: string | null;
  tablet?: string | null;
  desktop?: string | null;
}

export interface HeroSectionProps {
  layout?: string | null;
  headline: string;
  headlineColor?: SanityColorValue | null;
  imageRatio?: ImageRatio | null;
  subtitle?: string | null;
  tagline?: string | null;
  body?: Array<Record<string, unknown>> | string | null;
  backgroundImage?: ImageField | null;
  sectionBackground?: ImageField | null;
  overlayLogo?: ImageField | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  siteLogoUrl?: string | null;
}

/*
 * Responsive aspect-ratio class lookup.
 *
 * Every class string is a literal so Tailwind v4's content scanner
 * detects and generates the CSS for it.
 */
const MOBILE_ASPECT: Record<string, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-4/3",
  "3:4": "aspect-3/4",
  "16:9": "aspect-video",
  "9:16": "aspect-9/16",
  "3:2": "aspect-3/2",
};

const TABLET_ASPECT: Record<string, string> = {
  "1:1": "md:aspect-square",
  "4:3": "md:aspect-4/3",
  "3:4": "md:aspect-3/4",
  "16:9": "md:aspect-video",
  "9:16": "md:aspect-9/16",
  "3:2": "md:aspect-3/2",
};

const DESKTOP_ASPECT: Record<string, string> = {
  "1:1": "lg:aspect-square",
  "4:3": "lg:aspect-4/3",
  "3:4": "lg:aspect-3/4",
  "16:9": "lg:aspect-video",
  "9:16": "lg:aspect-9/16",
  "3:2": "lg:aspect-3/2",
};

interface AspectOptions {
  skipDesktop?: boolean;
}

export function heroAspectClasses(
  ratio?: ImageRatio | null,
  opts?: AspectOptions,
): string {
  if (!ratio) return "";
  const parts: string[] = [];
  if (ratio.mobile && MOBILE_ASPECT[ratio.mobile]) {
    parts.push(MOBILE_ASPECT[ratio.mobile]);
  }
  if (ratio.tablet && TABLET_ASPECT[ratio.tablet]) {
    parts.push(TABLET_ASPECT[ratio.tablet]);
  }
  if (!opts?.skipDesktop && ratio.desktop && DESKTOP_ASPECT[ratio.desktop]) {
    parts.push(DESKTOP_ASPECT[ratio.desktop]);
  }
  return parts.join(" ");
}

export function hasImageRatio(
  ratio?: ImageRatio | null,
  opts?: AspectOptions,
): boolean {
  if (!ratio) return false;
  if (opts?.skipDesktop) return !!(ratio.mobile || ratio.tablet);
  return !!(ratio.mobile || ratio.tablet || ratio.desktop);
}
