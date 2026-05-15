import Link from "next/link";
import { getKnowledgeBase } from "@/lib/catalog";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PricingCards } from "@/components/ui/PricingCards";

interface PricingSectionProps {
  heading: string;
  subtitle?: string | null;
  bundleCategory: string;
  footerNote?: string | null;
}

function FooterNote({ text }: { text: string }) {
  const parts = text.split(/(Contact Us)/i);
  return (
    <p className="mt-8 text-center text-sm text-neutral-400">
      {parts.map((part, i) =>
        /^contact us$/i.test(part) ? (
          <Link key={i} href="/contact" className="font-medium text-pink-500 underline hover:no-underline">
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export async function PricingSection({
  heading,
  subtitle,
  bundleCategory,
  footerNote,
}: PricingSectionProps) {
  const knowledge = await getKnowledgeBase();
  const bundles = knowledge.bundles.filter((b) => b.category === bundleCategory);

  if (!bundles.length) return null;

  const enriched = bundles.map((b) => ({
    _id: b.id,
    name: b.name,
    tagline: b.tagline,
    originalPrice: b.listPrice,
    effectivePrice: b.hasDiscount ? b.currentPrice : null,
    hasDiscount: b.hasDiscount,
    note: b.note,
    highlighted: b.highlighted,
  }));

  return (
    <section className="py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>{heading}</SectionHeading>
        <PricingCards bundles={enriched} />
        {footerNote && <FooterNote text={footerNote} />}
      </Container>
    </section>
  );
}
