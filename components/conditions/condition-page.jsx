import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import {
  CONDITIONS_BASE_PATH,
  getPageLabel,
  toAbsoluteUrl,
  toCardsById,
  toConditionPath,
} from "@/lib/conditions";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateMedicalConditionSchema,
  generateMedicalWebPageSchema,
} from "@/lib/schema-data";

const SITE_HOME = "https://rehabana.com";

const buildSchemas = ({ doc, chain, path }) => {
  const url = toAbsoluteUrl(path);
  const label = getPageLabel(doc);
  const rootUrl = toAbsoluteUrl(toConditionPath(chain.slice(0, 1)));
  const isTopLevel = chain.length === 1;

  const crumbs = chain.map((item, index) => ({
    name: getPageLabel(item),
    url: toAbsoluteUrl(toConditionPath(chain.slice(0, index + 1))),
  }));

  return [
    // === NOTE: === The /conditions hub stays in the trail for every level,
    // even where the URL no longer starts with /conditions.
    generateBreadcrumbSchema([
      { name: "Home", url: SITE_HOME },
      { name: "Conditions", url: toAbsoluteUrl(CONDITIONS_BASE_PATH) },
      ...crumbs,
    ]),
    generateMedicalWebPageSchema({
      name: doc.data.meta_title || label,
      description: doc.data.meta_description,
      url,
      aboutId: `${rootUrl}#condition`,
    }),
    isTopLevel &&
      generateMedicalConditionSchema({
        name: label,
        url,
        description: doc.data.meta_description,
      }),
    generateFaqSchemaFromSlices(doc.data.slices),
  ].filter(Boolean);
};

/**
 * One condition page from the tree. Its content, including any list of
 * related conditions, comes from its Prismic slices.
 *
 * @param {{ entry: { doc: object; chain: object[]; path: string }; tree: object[] }} props - The page's tree entry and the whole tree (for condition cards).
 * @returns {JSX.Element} The rendered page.
 */
export const ConditionPage = ({ entry, tree }) => (
  <>
    <SchemaMarkup data={buildSchemas(entry)} />
    <SliceZoneWithContext
      slices={entry.doc.data.slices}
      components={components}
      context={{ conditionCards: toCardsById(tree) }}
    />
  </>
);

/**
 * Metadata for a condition page. The canonical is built from the tree path so
 * it matches the URL the page actually serves.
 *
 * @param {{ doc: object; path: string }} entry - The page's tree entry.
 * @returns {object} Next.js metadata.
 */
export const getConditionMetadata = (entry) =>
  Seo({ ...entry.doc, url: entry.path });
