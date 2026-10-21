import { notFound } from "next/navigation";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import { CardGrid } from "@/components/conditions";
import {
  CONDITIONS_BASE_PATH,
  findByPath,
  getChildren,
  getConditionTree,
  getPageLabel,
  splitLeadingHero,
  toAbsoluteUrl,
  toCards,
  toCardsById,
} from "@/lib/conditions";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateMedicalConditionSchema,
  generateMedicalWebPageSchema,
} from "@/lib/schema-data";

const SITE_HOME = "https://rehabana.com";

const heading = (text) => [{ type: "heading2", text, spans: [] }];

const segmentsPath = (chain) =>
  `${CONDITIONS_BASE_PATH}/${chain.map((item) => item.uid).join("/")}`;

const buildSchemas = ({ doc, chain, path }) => {
  const url = toAbsoluteUrl(path);
  const label = getPageLabel(doc);
  const rootUrl = toAbsoluteUrl(segmentsPath(chain.slice(0, 1)));
  const isTopLevel = chain.length === 1;

  const crumbs = chain.map((item, index) => ({
    name: getPageLabel(item),
    url: toAbsoluteUrl(segmentsPath(chain.slice(0, index + 1))),
  }));

  return [
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
 * /conditions/a[/b[/c]] — any condition page in the tree. A page with
 * children shows them as cards under its hero; a page without children
 * (an article) shows its siblings after the content instead.
 */
const ConditionPage = async ({ params }) => {
  const tree = await getConditionTree();
  const entry = findByPath(tree, params.slug);
  if (!entry) notFound();

  const { doc, chain } = entry;
  const children = getChildren(tree, doc);
  const parent = chain.at(-2) ?? null;
  const siblings = children.length
    ? []
    : getChildren(tree, parent).filter((item) => item.doc.id !== doc.id);
  const { lead, rest } = splitLeadingHero(doc.data.slices);
  const context = { conditionCards: toCardsById(tree) };

  return (
    <>
      <SchemaMarkup data={buildSchemas(entry)} />
      {children.length > 0 ? (
        <>
          <SliceZoneWithContext
            slices={lead}
            components={components}
            context={context}
          />
          <CardGrid
            primary={{
              subheading: "Explore",
              heading: heading(`More on ${getPageLabel(doc)}`),
            }}
            items={toCards(children)}
          />
          <SliceZoneWithContext
            slices={rest}
            components={components}
            context={context}
          />
        </>
      ) : (
        <>
          <SliceZoneWithContext
            slices={doc.data.slices}
            components={components}
            context={context}
          />
          {parent && (
            <CardGrid
              primary={{
                subheading: "Keep reading",
                heading: heading(`More on ${getPageLabel(parent)}`),
              }}
              items={toCards(siblings)}
            />
          )}
        </>
      )}
    </>
  );
};

export async function generateStaticParams() {
  const tree = await getConditionTree();
  return tree.map(({ chain }) => ({ slug: chain.map((item) => item.uid) }));
}

export async function generateMetadata({ params }) {
  const entry = findByPath(await getConditionTree(), params.slug);
  // === NOTE: === Seo builds the canonical from `url`; the tree path is used so
  // it matches the URL this page actually serves.
  return entry ? Seo({ ...entry.doc, url: entry.path }) : {};
}

export default ConditionPage;
