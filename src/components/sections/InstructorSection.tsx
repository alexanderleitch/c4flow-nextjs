import Image from "next/image";
import { Instagram } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PortableText } from "@portabletext/react";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import { getExternalLinkRel } from "@/lib/seo";

interface InstructorSectionProps {
  heading?: string | null;
  instructor?: {
    name: string | null;
    title: string | null;
    experience: string | null;
    photoUrl: string | null;
    photoLqip?: string | null;
    bio: Array<Record<string, unknown>> | null;
    shortBio?: string | null;
    instagramUrl: string | null;
    bookingUrl: string | null;
  } | null;
}

export function InstructorSection({ heading, instructor }: InstructorSectionProps) {
  if (!instructor) return null;

  return (
    <section className="relative overflow-hidden py-8 md:py-24">
      <div
        className="gradient-orb absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <SectionHeading>{heading || "Meet Your Instructor"}</SectionHeading>

        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-8 lg:items-stretch lg:gap-10">
          {instructor.photoUrl && (
            <div className="overflow-hidden rounded-2xl shadow-lg sm:max-w-md md:max-w-none lg:relative lg:min-h-full">
              <Image
                src={instructor.photoUrl}
                alt={instructor.name || "Instructor"}
                width={500}
                height={670}
                className="h-auto w-full object-cover object-top md:object-center lg:absolute lg:inset-0 lg:h-full lg:w-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 384px, 320px"
                {...(instructor.photoLqip
                  ? { placeholder: "blur" as const, blurDataURL: instructor.photoLqip }
                  : {})}
              />
            </div>
          )}

          <div>
            <h3 className="font-heading text-3xl text-primary-600 lg:text-4xl">{instructor.name}</h3>
            {instructor.title && (
              <p className="mt-1 font-medium text-pink-500">{instructor.title}</p>
            )}
            {instructor.experience && (
              <p className="mt-1 text-sm text-neutral-400">{instructor.experience}</p>
            )}

            <div className="mt-4 text-sm leading-relaxed text-neutral-600 [&_p]:mb-4 [&_p]:leading-relaxed md:text-base">
              {instructor.bio ? (
                <PortableText value={instructor.bio as never} />
              ) : instructor.shortBio ? (
                <p>{instructor.shortBio}</p>
              ) : null}
            </div>

            <div className="mt-6 flex gap-3">
              {instructor.bookingUrl && (
                <TrackedCtaLink
                  href={instructor.bookingUrl}
                  source="instructor_section"
                  className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
                >
                  Book a Session
                </TrackedCtaLink>
              )}
              {instructor.instagramUrl && (
                <a
                  href={instructor.instagramUrl}
                  target="_blank"
                  rel={getExternalLinkRel(instructor.instagramUrl)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
                  aria-label={`${instructor.name} on Instagram`}
                >
                  <Instagram size={16} />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
