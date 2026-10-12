import { notFound } from "next/navigation";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import { CardGrid } from "@/components/conditions";
import {
  CONDITIONS_BASE_PATH,
  getAllConditions,
  getConditionPath,
  getConditionsPage,
  splitLeadingHero,
  toAbsoluteUrl,
} from "@/lib/conditions";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateWebPageSchema,
} from "@/lib/schema-data";

/**
 * /conditions — the hub of the national conditions section. Hero first, then
 * a card for every published condition, then the rest of the slices.
 *
 * 404s until the `conditions_page` singleton is published, so the section
 * stays invisible while its content is still being written.
 */
const ConditionsPage = async () => {
  const [page, conditions] = await Promise.all([
    getConditionsPage(),
    getAllConditions(),
  ]);
  if (!page) notFound();

  const { data } = page;
  const { lead, rest } = splitLeadingHero(data.slices);
  const url = toAbsoluteUrl(CONDITIONS_BASE_PATH);

  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "https://rehabana.com" },
      { name: "Conditions", url },
    ]),
    generateWebPageSchema({
      name: data.meta_title || "Conditions | Rehabana",
      description: data.meta_description || "",
      url,
    }),
    generateFaqSchemaFromSlices(data.slices),
  ].filter(Boolean);

  const cards = conditions.map((condition) => ({
    title: condition.data.name || condition.uid,
    summary: condition.data.summary,
    href: getConditionPath(condition),
    image: condition.data.featured_image,
  }));

  return (
    <>
      <SchemaMarkup data={schemas} />
      <SliceZoneWithContext slices={lead} components={components} />
      <CardGrid
        primary={{
          subheading: data.grid_subheading,
          heading: data.grid_heading,
          description: data.grid_description,
        }}
        items={cards}
      />
      <SliceZoneWithContext slices={rest} components={components} />
    </>
  );
};

export async function generateMetadata() {
  const page = await getConditionsPage();
  return page ? Seo(page) : {};
}

export default ConditionsPage;
