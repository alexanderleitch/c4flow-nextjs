interface FaqEntry {
  question?: string | null;
  answer?: string | null;
}

interface FaqSection {
  _type?: string;
  faqs?: FaqEntry[] | null;
}

function isHttpUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getExternalLinkRel(href: string): string | undefined {
  if (!isHttpUrl(href)) return undefined;
  return "noopener noreferrer";
}

export function buildFaqJsonLd(
  sections: FaqSection[] | null | undefined,
): Record<string, unknown> | null {
  const mainEntity = (sections || [])
    .filter((section) => section?._type === "faqSection")
    .flatMap((section) => section.faqs || [])
    .map((faq) => ({
      name: faq.question?.trim() || "",
      text: faq.answer?.replace(/\s+/g, " ").trim() || "",
    }))
    .filter((faq) => faq.name && faq.text)
    .map((faq) => ({
      "@type": "Question",
      name: faq.name,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.text,
      },
    }));

  if (!mainEntity.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
