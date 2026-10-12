import { notFound } from "next/navigation";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import { CardGrid, LocalTreatment } from "@/components/conditions";
import {
  CONDITIONS_BASE_PATH,
  getAllConditions,
  getCondition,
  getConditionPath,
  getTopicPath,
  getTopicsForCondition,
  splitLeadingHero,
  toAbsoluteUrl,
} from "@/lib/conditions";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateMedicalConditionSchema,
  generateMedicalWebPageSchema,
} from "@/lib/schema-data";

/**
 * /conditions/<condition> — one condition pillar, e.g. Parkinson's Disease.
 * Hero, then a card for each of its topics, then the rest of the slices, then
 * the hand-off to the Kolkata treatment page.
 */
const ConditionPage = async ({ params }) => {
  const condition = await getCondition(params.condition);
  if (!condition) notFound();

  const topics = await getTopicsForCondition(condition.id);

  const { data } = condition;
  const name = data.name || condition.uid;
  const path = getConditionPath(condition);
  const url = toAbsoluteUrl(path);
  const { lead, rest } = splitLeadingHero(data.slices);

  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "https://rehabana.com" },
      { name: "Conditions", url: toAbsoluteUrl(CONDITIONS_BASE_PATH) },
      { name, url },
    ]),
    generateMedicalWebPageSchema({
      name: data.meta_title || name,
      description: data.meta_description,
      url,
      aboutId: `${url}#condition`,
    }),
    generateMedicalConditionSchema({
      name,
      url,
      description: data.meta_description || data.summary,
    }),
    generateFaqSchemaFromSlices(data.slices),
  ].filter(Boolean);

  const cards = topics
    .filter((topic) => getTopicPath(topic))
    .map((topic) => ({
      title: topic.data.title || topic.uid,
      summary: topic.data.summary,
      href: getTopicPath(topic),
      image: topic.data.featured_image,
    }));

  return (
    <>
      <SchemaMarkup data={schemas} />
      <SliceZoneWithContext slices={lead} components={components} />
      <CardGrid
        primary={{
          subheading: data.topics_subheading,
          heading: data.topics_heading,
          description: data.topics_description,
        }}
        items={cards}
      />
      <SliceZoneWithContext slices={rest} components={components} />
      <LocalTreatment link={data.local_page} conditionName={name} />
    </>
  );
};

export async function generateStaticParams() {
  const conditions = await getAllConditions();
  return conditions.map((condition) => ({ condition: condition.uid }));
}

export async function generateMetadata({ params }) {
  const condition = await getCondition(params.condition);
  return condition ? Seo(condition) : {};
}

export default ConditionPage;
