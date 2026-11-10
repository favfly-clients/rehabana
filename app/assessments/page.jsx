import { notFound } from "next/navigation";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import {
  ASSESSMENTS_BASE_PATH,
  getAssessmentTree,
  getAssessmentsPage,
  toAbsoluteUrl,
  toCardsById,
} from "@/lib/assessments";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateWebPageSchema,
} from "@/lib/schema-data";

/**
 * /assessments — the hub of the assessments section. Everything on the
 * page, including the list of assessments, comes from its Prismic slices.
 *
 * 404s until the `assessments_page` singleton is published, so the section
 * stays invisible while its content is still being written.
 */
const AssessmentsPage = async () => {
  const [page, tree] = await Promise.all([
    getAssessmentsPage(),
    getAssessmentTree(),
  ]);
  if (!page) notFound();

  const { data } = page;
  const url = toAbsoluteUrl(ASSESSMENTS_BASE_PATH);
  const context = { assessmentCards: toCardsById(tree) };

  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "https://rehabana.com" },
      { name: "Assessments", url },
    ]),
    generateWebPageSchema({
      name: data.meta_title || "Assessments | Rehabana",
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
  const page = await getAssessmentsPage();
  return page ? Seo(page) : {};
}

export default AssessmentsPage;
