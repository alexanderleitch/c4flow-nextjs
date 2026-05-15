import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GalleryGrid } from "@/components/ui/GalleryGrid";

interface GalleryImage {
  _key: string;
  alt?: string;
  caption?: string;
  asset?: {
    url?: string | null;
    metadata?: { lqip?: string | null } | null;
  } | null;
}

interface GallerySectionProps {
  heading?: string | null;
  subtitle?: string | null;
  images?: GalleryImage[] | null;
}

export function GallerySection({ heading, subtitle, images }: GallerySectionProps) {
  if (!images?.length) return null;

  const preparedImages = images
    .filter((img) => img.asset?.url)
    .map((img) => ({
      _key: img._key,
      thumbUrl: img.asset!.url!,
      fullUrl: img.asset!.url!,
      alt: img.alt || "Gallery image",
      caption: img.caption || null,
      lqip: img.asset?.metadata?.lqip || null,
    }));

  if (!preparedImages.length) return null;

  return (
    <section className="relative overflow-hidden bg-muted py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>{heading || "Gallery"}</SectionHeading>
        <GalleryGrid images={preparedImages} />
      </Container>
    </section>
  );
}
