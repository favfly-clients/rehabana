import CardGrid from "@/components/conditions/card-grid";

/**
 * Assessment cards the editor picks by hand in Prismic. Each link resolves to
 * its card through `context.assessmentCards`, built from the same tree as the
 * assessment pages. A link to an unplaceable or unpublished page drops out.
 *
 * @param {{
 *   slice: { primary: { subheading?: string; heading?: object[]; description?: object[]; items?: { assessment?: { id?: string } }[] } };
 *   context?: { assessmentCards?: Record<string, object> };
 * }} props
 */
export const AssessmentsSection = ({ slice, context }) => {
  const { primary } = slice;
  const cards = (primary?.items ?? [])
    .map(({ assessment }) => context?.assessmentCards?.[assessment?.id])
    .filter(Boolean);

  return <CardGrid primary={primary} items={cards} />;
};
