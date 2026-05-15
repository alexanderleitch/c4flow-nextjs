interface TestimonialsSectionServerProps {
  heading?: string | null;
  subtitle?: string | null;
}

export async function TestimonialsSectionServer({
  heading: _heading,
  subtitle: _subtitle,
}: TestimonialsSectionServerProps) {
  // No testimonial data in the static content snapshot — render nothing.
  return null;
}
