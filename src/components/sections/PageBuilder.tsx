import { HeroSection } from "./HeroSection";
import { FeatureGridSection } from "./FeatureGridSection";
import { ClassesSection } from "./ClassesSection";
import { InstructorSection } from "./InstructorSection";
import { ScheduleSection } from "./ScheduleSection";
import { RichTextSection } from "./RichTextSection";
import { GallerySection } from "./GallerySection";
import { CtaSection } from "./CtaSection";
import { MapSection } from "./MapSection";
import { TestimonialsSectionServer } from "./TestimonialsSectionServer";
import { FaqSection } from "./FaqSection";
import { PricingSection } from "./PricingSection";
import { ClassDetailsSection } from "./ClassDetailsSection";
import { ContactInfoSection } from "./ContactInfoSection";

interface Section {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

interface PageBuilderProps {
  sections: Section[] | null;
  siteLogoUrl?: string | null;
}

export function PageBuilder({ sections, siteLogoUrl }: PageBuilderProps) {
  if (!sections?.length) return null;

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "hero":
            return (
              <HeroSection
                key={section._key}
                layout={section.layout as string | null}
                headline={section.headline as string}
                headlineColor={section.headlineColor as never}
                imageRatio={section.imageRatio as never}
                subtitle={section.subtitle as string | null}
                tagline={section.tagline as string | null}
                body={section.body as string | null}
                backgroundImage={section.backgroundImage as never}
                sectionBackground={section.sectionBackground as never}
                overlayLogo={section.overlayLogo as never}
                ctaText={section.ctaText as string | null}
                ctaUrl={section.ctaUrl as string | null}
                siteLogoUrl={siteLogoUrl}
              />
            );
          case "featureGrid":
            return (
              <FeatureGridSection
                key={section._key}
                heading={section.heading as string | null}
                subtitle={section.subtitle as string | null}
                features={section.features as never}
                style={section.style as string | null}
              />
            );
          case "classesSection":
            return (
              <ClassesSection
                key={section._key}
                heading={section.heading as string | null}
                subtitle={section.subtitle as string | null}
                columns={section.columns as number | null}
                showBookingNote={section.showBookingNote as boolean | null}
              />
            );
          case "instructorSection":
            return (
              <InstructorSection
                key={section._key}
                heading={section.heading as string | null}
                instructor={section.instructor as never}
              />
            );
          case "scheduleSection":
            return (
              <ScheduleSection
                key={section._key}
                heading={section.heading as string | null}
                subtitle={section.subtitle as string | null}
              />
            );
          case "richTextSection":
            return (
              <RichTextSection
                key={section._key}
                heading={section.heading as string | null}
                content={section.content as never}
                layout={section.layout as string | null}
                image={section.image as never}
                imagePosition={section.imagePosition as string | null}
              />
            );
          case "gallerySection":
            return (
              <GallerySection
                key={section._key}
                heading={section.heading as string | null}
                subtitle={section.subtitle as string | null}
                images={section.images as never}
              />
            );
          case "ctaSection":
            return (
              <CtaSection
                key={section._key}
                heading={section.heading as string}
                subtitle={section.subtitle as string | null}
                buttonText={section.buttonText as string}
                buttonUrl={section.buttonUrl as string | null}
                style={section.style as string | null}
                backgroundImage={section.backgroundImage as never}
                secondaryLinks={section.secondaryLinks as never}
              />
            );
          case "testimonialsSection":
            return (
              <TestimonialsSectionServer
                key={section._key}
                heading={section.heading as string | null}
                subtitle={section.subtitle as string | null}
              />
            );
          case "faqSection":
            return (
              <FaqSection
                key={section._key}
                heading={section.heading as string | null}
                faqs={section.faqs as never}
              />
            );
          case "pricingSection":
            return (
              <PricingSection
                key={section._key}
                heading={section.heading as string}
                subtitle={section.subtitle as string | null}
                bundleCategory={section.bundleCategory as string}
                footerNote={section.footerNote as string | null}
              />
            );
          case "classDetailsSection":
            return (
              <ClassDetailsSection
                key={section._key}
                heading={section.heading as string | null}
                subtitle={section.subtitle as string | null}
              />
            );
          case "contactInfoSection":
            return (
              <ContactInfoSection
                key={section._key}
                studioHours={section.studioHours as string | null}
                closedDay={section.closedDay as string | null}
              />
            );
          case "mapSection":
            return (
              <MapSection
                key={section._key}
                heading={section.heading as string | null}
                additionalInfo={section.additionalInfo as string | null}
                logoUrl={siteLogoUrl}
              />
            );
          default:
            return (
              <div
                key={section._key}
                className="py-8 text-center text-sm text-neutral-400"
              >
                Unknown section: {section._type}
              </div>
            );
        }
      })}
    </>
  );
}
