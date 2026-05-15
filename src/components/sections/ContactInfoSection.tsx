import { MapPin, MessageCircle, Mail, Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getExternalLinkRel } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";

interface ContactInfoSectionProps {
  studioHours?: string | null;
  closedDay?: string | null;
}

interface ContactCard {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  href?: string;
}

export async function ContactInfoSection({
  studioHours,
  closedDay,
}: ContactInfoSectionProps) {
  const { address, phone, whatsapp, email, maps } = SITE_CONFIG;
  const addressLines = [
    [address.street, address.building].filter(Boolean).join(", "),
    [address.city, address.province, address.postalCode].filter(Boolean).join(", "),
  ].filter(Boolean);

  const whatsappHref = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`;

  const cards: ContactCard[] = [
    {
      icon: <MapPin size={28} strokeWidth={1.5} />,
      title: "Visit Us",
      lines: addressLines,
      href: maps.url,
    },
    {
      icon: <MessageCircle size={28} strokeWidth={1.5} />,
      title: "WhatsApp Us",
      lines: phone ? [phone] : [],
      href: whatsappHref,
    },
    {
      icon: <Mail size={28} strokeWidth={1.5} />,
      title: "Email Us",
      lines: email ? [email] : [],
      href: email ? `mailto:${email}` : undefined,
    },
    {
      icon: <Clock size={28} strokeWidth={1.5} />,
      title: "Studio Hours",
      lines: [
        studioHours || "By appointment only",
        closedDay || "Sunday: Closed",
      ],
    },
  ];

  return (
    <section className="py-8 md:py-20">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const cardClasses =
              "flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-white px-5 py-8 text-center";

            const inner = (
              <>
                <div className="mb-3 text-primary-500">{card.icon}</div>
                <h3 className="font-heading text-xl text-neutral-800">{card.title}</h3>
                <div className="mt-2 space-y-0.5 text-sm text-neutral-500">
                  {card.lines.map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </>
            );

            if (card.href) {
              return (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={card.href.startsWith("mailto:") ? undefined : getExternalLinkRel(card.href)}
                  className={`${cardClasses} transition-colors hover:border-pink-200 hover:bg-pink-50/30`}
                >
                  {inner}
                </a>
              );
            }
            return <div key={card.title} className={cardClasses}>{inner}</div>;
          })}
        </div>
      </Container>
    </section>
  );
}
