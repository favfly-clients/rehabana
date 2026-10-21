import { notFound } from "next/navigation";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import {
  CONDITIONS_BASE_PATH,
  getConditionTree,
  getConditionsPage,
  toAbsoluteUrl,
  toCardsById,
} from "@/lib/conditions";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateWebPageSchema,
} from "@/lib/schema-data";

/**
 * /conditions — the hub of the national conditions section. Everything on the
 * page, including the list of conditions, comes from its Prismic slices.
 *
 * 404s until the `conditions_page` singleton is published, so the section
 * stays invisible while its content is still being written.
 */
const ConditionsPage = async () => {
  const [page, tree] = await Promise.all([
    getConditionsPage(),
    getConditionTree(),
  ]);
  if (!page) notFound();

  const { data } = page;
  const url = toAbsoluteUrl(CONDITIONS_BASE_PATH);
  const context = { conditionCards: toCardsById(tree) };

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

  return (
    <>
      <SchemaMarkup data={schemas} />
      <SliceZoneWithContext
        slices={data.slices}
        components={components}
        context={context}
      />
    </>
  );
};

export async function generateMetadata() {
  const page = await getConditionsPage();
  return page ? Seo(page) : {};
}

export default ConditionsPage;
