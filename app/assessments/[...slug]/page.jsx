import { notFound } from "next/navigation";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import {
  ASSESSMENTS_BASE_PATH,
  findByPath,
  getAssessmentTree,
  getPageLabel,
  toAbsoluteUrl,
  toCardsById,
} from "@/lib/assessments";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateMedicalWebPageSchema,
} from "@/lib/schema-data";

const SITE_HOME = "https://rehabana.com";

const segmentsPath = (chain) =>
  `${ASSESSMENTS_BASE_PATH}/${chain.map((item) => item.uid).join("/")}`;

const buildSchemas = ({ doc, chain, path }) => {
  const url = toAbsoluteUrl(path);
  const label = getPageLabel(doc);

  const crumbs = chain.map((item, index) => ({
    name: getPageLabel(item),
    url: toAbsoluteUrl(segmentsPath(chain.slice(0, index + 1))),
  }));

  return [
    generateBreadcrumbSchema([
      { name: "Home", url: SITE_HOME },
      { name: "Assessments", url: toAbsoluteUrl(ASSESSMENTS_BASE_PATH) },
      ...crumbs,
    ]),
    generateMedicalWebPageSchema({
      name: doc.data.meta_title || label,
      description: doc.data.meta_description,
      url,
    }),
    generateFaqSchemaFromSlices(doc.data.slices),
  ].filter(Boolean);
};

/**
 * /assessments/a[/b[/c]] — any assessment page in the tree. Its content, including
 * any list of related assessments, comes from its Prismic slices.
 */
const AssessmentPage = async ({ params }) => {
  const tree = await getAssessmentTree();
  const entry = findByPath(tree, params.slug);
  if (!entry) notFound();

  const context = { assessmentCards: toCardsById(tree) };

  return (
    <>
      <SchemaMarkup data={buildSchemas(entry)} />
      <SliceZoneWithContext
        slices={entry.doc.data.slices}
        components={components}
        context={context}
      />
    </>
  );
};

export async function generateStaticParams() {
  const tree = await getAssessmentTree();
  return tree.map(({ chain }) => ({ slug: chain.map((item) => item.uid) }));
}

export async function generateMetadata({ params }) {
  const entry = findByPath(await getAssessmentTree(), params.slug);
  // === NOTE: === Seo builds the canonical from `url`; the tree path is used so
  // it matches the URL this page actually serves.
  return entry ? Seo({ ...entry.doc, url: entry.path }) : {};
}

export default AssessmentPage;
