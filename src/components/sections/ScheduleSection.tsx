import { Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BookNowLink } from "@/components/ui/BookNowLink";
import { formatPriceLabel } from "@/lib/utils";
import { getKnowledgeBase } from "@/lib/catalog";

interface ScheduleSectionProps {
  heading?: string | null;
  subtitle?: string | null;
}

export async function ScheduleSection({ heading, subtitle }: ScheduleSectionProps) {
  const knowledge = await getKnowledgeBase();
  const scheduleByDay = knowledge.scheduleByDay;

  if (!scheduleByDay.length) return null;

  return (
    <section className="py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "Weekly Schedule"}
        </SectionHeading>

        {/* Mobile: stacked cards */}
        <div className="mx-auto max-w-lg space-y-4 md:hidden" role="list">
          {scheduleByDay.map(({ day, slots }) => (
            <div
              key={day}
              className="overflow-hidden rounded-xl border border-border"
              role="listitem"
            >
              <div className="bg-primary-600 px-4 py-2.5">
                <h3 className="text-sm font-medium text-white">{day}</h3>
              </div>
              <div className="divide-y divide-border">
                {slots.map((slot, i) => (
                  <div
                    key={`${day}-${i}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-800">{slot.className || "Class"}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-400">
                        <Clock size={12} aria-hidden="true" />
                        {slot.time}
                      </p>
                      {slot.currentPrice != null && (
                        <p className="mt-0.5 text-sm">
                          {slot.listPrice != null && slot.currentPrice < slot.listPrice ? (
                            <>
                              <span className="font-semibold text-pink-500">
                                {formatPriceLabel(slot.currentPrice)}
                              </span>
                              <span className="ml-1.5 text-neutral-400 line-through">
                                {formatPriceLabel(slot.listPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-pink-500">
                              {formatPriceLabel(slot.currentPrice)}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <BookNowLink
                      href={slot.bookingUrl}
                      label={slot.className || "class"}
                      source="schedule_mobile"
                      ariaLabel={`Book ${slot.className || "class"} on ${day}`}
                      className="shrink-0 rounded-full bg-pink-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-pink-600"
                    >
                      Book
                    </BookNowLink>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="mx-auto hidden max-w-3xl overflow-hidden rounded-2xl border border-border md:block">
          <table className="w-full text-left">
            <caption className="sr-only">
              Weekly class schedule with days, class names, times, prices, and booking links
            </caption>
            <thead>
              <tr className="bg-linear-to-r from-primary-600 via-purple-600 to-pink-500 text-white">
                <th scope="col" className="px-6 py-3 text-sm font-medium">Day</th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">Class</th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">Time</th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">Price</th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">
                  <span className="sr-only">Book</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {scheduleByDay.map(({ day, slots }) =>
                slots.map((slot, i) => (
                  <tr
                    key={`${day}-${i}`}
                    className="border-t border-border transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4 font-medium text-neutral-800">
                      {i === 0 ? day : <span className="sr-only">{day}</span>}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{slot.className || "Class"}</td>
                    <td className="px-6 py-4 text-neutral-600">{slot.time}</td>
                    <td className="px-6 py-4">
                      {slot.currentPrice != null ? (
                        slot.listPrice != null && slot.currentPrice < slot.listPrice ? (
                          <span>
                            <span className="font-semibold text-pink-500">
                              {formatPriceLabel(slot.currentPrice)}
                            </span>
                            <span className="ml-1.5 text-sm text-neutral-400 line-through">
                              {formatPriceLabel(slot.listPrice)}
                            </span>
                          </span>
                        ) : (
                          <span className="font-medium text-pink-500">
                            {formatPriceLabel(slot.currentPrice)}
                          </span>
                        )
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <BookNowLink
                        href={slot.bookingUrl}
                        label={slot.className || "class"}
                        source="schedule_table"
                        ariaLabel={`Book ${slot.className || "class"} on ${day}`}
                        className="text-sm font-medium text-pink-500 hover:text-pink-600"
                      >
                        Book
                      </BookNowLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
