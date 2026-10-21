import CardGrid from "@/components/conditions/card-grid";

/**
 * Condition cards the editor picks by hand in Prismic. Each link resolves to
 * its card through `context.conditionCards`, built from the same tree as the
 * condition pages. A link to an unplaceable or unpublished page drops out.
 *
 * @param {{
 *   slice: { primary: { subheading?: string; heading?: object[]; description?: object[]; items?: { condition?: { id?: string } }[] } };
 *   context?: { conditionCards?: Record<string, object> };
 * }} props
 */
export const ConditionsSection = ({ slice, context }) => {
  const { primary } = slice;
  const cards = (primary?.items ?? [])
    .map(({ condition }) => context?.conditionCards?.[condition?.id])
    .filter(Boolean);

  return <CardGrid primary={primary} items={cards} />;
};
